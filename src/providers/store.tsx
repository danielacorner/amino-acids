import create from "zustand";
import shallow from "zustand/shallow";
import { uniqBy } from "lodash";
import { Tweet } from "../types";
import { COLOR_BY, FILTER_LEVELS } from "../utils/constants";
import mockTweetsData from "../assets/mockTweetsData.json";
import { useCallback, useEffect, useRef } from "react";
import { useLocation } from "react-router";
import qs from "query-string";

export const useSearchObj = () => qs.parse(useLocation().search);

export type GlobalStateStoreType = {
  nodesFromServer: Tweet[];
  selectedNode: Tweet | null;
  setSelectedNode: (node: Tweet | null) => void;
  tooltipNode: Tweet | null;
  setTooltipNode: (node: Tweet | null) => void;
  setNodesFromServer: (nodes: Tweet[]) => void;
  config: AppConfig;
  setConfig: (newConfig: Partial<AppConfig>) => void;
  likesByUserId: { [userId: string]: string[] };
  setLikesByUserId: (newlikesByUserId: { [userId: string]: string[] }) => void;
  // repliesByUserId: { [tweetId: string]: string[] };
  // setRepliesByUserId: (newRepliesByUserId: {
  //   [userId: string]: string[];
  // }) => void;
  retweetsByTweetId: { [tweetId: string]: string[] };
  setRetweetsByTweetId: (newRetweetsByTweetId: {
    [tweetId: string]: string[];
  }) => void;
  loading: boolean;
  setLoading: (newLoading: boolean) => void;
  wordcloudConfig: WordcloudConfig;
  setWordcloudConfig: (newConfig: Partial<WordcloudConfig>) => void;
  savedDatasets: { saveName: string; ids: string[] }[];
  setSavedDatasets: (newSaves: { saveName: string; ids: string[] }[]) => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (next: boolean) => void;
};
export type AppConfig = {
  is3d: boolean;
  gravity: number;
  charge: number;
  isPaused: boolean;
  d3VelocityDecay: number;
  d3AlphaDecay: number;
  cooldownTime: number;
  isGridMode: boolean;
  isOffline: boolean;
  showUserNodes: boolean;
  colorBy: keyof typeof COLOR_BY | null;
  lang: string;
  resultType: "mixed" | "recent" | "popular";
  geolocation: {
    latitude: { left: number; right: number };
    longitude: { left: number; right: number };
  } | null;
  countryCode: string;
  allowedMediaTypes: {
    video: boolean;
    photo: boolean;
    text: boolean;
    animated_gif: boolean;
  };
  replace: boolean;
  filterLevel: keyof typeof FILTER_LEVELS;
  searchTerm: string;
  numTweets: number;
};

// use to turn off mock nodes in dev mode
const SHOULD_MOCK_TWEETS = true;

const [useStore] = create(
  (set) =>
    ({
      nodesFromServer:
        process.env.NODE_ENV === "development" && SHOULD_MOCK_TWEETS
          ? /* mockTweetsData.nodes */ []
          : ([] as Tweet[]),
      // map between tweet.user.id and the liked tweet.id
      // likesByUserId is populated when we "fetch nodes liked by a user"
      likesByUserId:
        process.env.NODE_ENV === "development"
          ? mockTweetsData.likesByUserId
          : {},
      setLikesByUserId: (likesByUserId) => set(() => ({ likesByUserId })),
      // map between tweet.id and the retweeted tweet.id
      retweetsByTweetId:
        process.env.NODE_ENV === "development"
          ? mockTweetsData.retweetsByTweetId
          : {},
      setRetweetsByTweetId: (retweetsByTweetId) =>
        set(() => ({ retweetsByTweetId })),
      /** which node is displayed in the BottomDrawer */
      selectedNode: null as Tweet | null,
      setSelectedNode: (node: Tweet | null) =>
        set(() => ({ selectedNode: node })),

      tooltipNode: null as Tweet | null,
      setTooltipNode: (node: Tweet | null) =>
        set(() => ({ tooltipNode: node })),
      setNodesFromServer: (nodes) => set(() => ({ nodesFromServer: nodes })),
      loading: false,
      // * only works for authenticated user (me)
      // repliesByUserId: {},
      // setRepliesByUserId: (repliesByUserId) => set(() => ({ repliesByUserId })),
      setLoading: (loading) => set(() => ({ loading })),
      config: {
        isGridMode: false,
        showUserNodes: true,
        is3d: true,
        /** is the simulation paused */
        isPaused: false,
        gravity: 10,
        charge: -500,
        d3VelocityDecay: 0.9,
        d3AlphaDecay: 0.007,
        cooldownTime: 15 * 1000,
        colorBy: COLOR_BY.mediaType as keyof typeof COLOR_BY | null,
        lang: "All",
        countryCode: "All",
        resultType: "mixed",
        geolocation: null,
        allowedMediaTypes: {
          text: true,
          video: true,
          photo: true,
          animated_gif: true,
        },
        replace: false,
        filterLevel: FILTER_LEVELS.none,
        searchTerm: "",
        numTweets: 10,
        // numTweets: 50,
        isOffline: false,
      },
      isDrawerOpen: window.innerWidth > 600,
      setIsDrawerOpen: (next) => set((state) => ({ isDrawerOpen: next })),
      /** overwrite any values passed in */
      setConfig: (newConfig) =>
        set((state) => ({ config: { ...state.config, ...newConfig } })),
      wordcloudConfig: {
        minChars: 1,
        maxChars: 25,
        minInstances: 1,
        numAngles: 3,
      },
      setWordcloudConfig: (newConfig) =>
        set((state) => ({
          wordcloudConfig: { ...state.wordcloudConfig, ...newConfig },
        })),
      savedDatasets: JSON.parse(window.localStorage.getItem("saves") || "[]"),
      setSavedDatasets: (newSaves) =>
        set((state) => ({ savedDatasets: newSaves })),
    } as GlobalStateStoreType)
);

export default useStore;

/** return all configurable values from the control panel
 * * the convenience of a big object useConfig() is offset by the consequence of
 * * causing re-renders on each component using it, every time any config value changes
 */
export const useConfig = () => {
  // ? is it possible to return factory functions which generate these selectors instead?
  // ? e.g.
  // ? return { getLoading: () => useStore(state...
  // ? const {getLoading} = useConfig(); const loading = getLoading())

  return {
    isStorybook: window.location.href.includes("localhost:6006"),
    // useLoading: ()=> useStore((state) => (state as GlobalStateStoreType).loading, shallow),
    is3d: useStore(
      (state) => (state as GlobalStateStoreType).config.is3d,
      shallow
    ),
    gravity: useStore(
      (state) => (state as GlobalStateStoreType).config.gravity,
      shallow
    ),
    charge: useStore(
      (state) => (state as GlobalStateStoreType).config.charge,
      shallow
    ),
    isPaused: useStore(
      (state) => (state as GlobalStateStoreType).config.isPaused,
      shallow
    ),
    d3VelocityDecay: useStore(
      (state) => (state as GlobalStateStoreType).config.d3VelocityDecay,
      shallow
    ),
    d3AlphaDecay: useStore(
      (state) => (state as GlobalStateStoreType).config.d3AlphaDecay,
      shallow
    ),
    cooldownTime: useStore(
      (state) => (state as GlobalStateStoreType).config.cooldownTime,
      shallow
    ),
    isGridMode: useStore(
      (state) => (state as GlobalStateStoreType).config.isGridMode,
      shallow
    ),
    showUserNodes: useStore(
      (state) => (state as GlobalStateStoreType).config.showUserNodes,
      shallow
    ),
    colorBy: useStore(
      (state) => (state as GlobalStateStoreType).config.colorBy,
      shallow
    ),
    lang: useStore(
      (state) => (state as GlobalStateStoreType).config.lang,
      shallow
    ),
    countryCode: useStore(
      (state) => (state as GlobalStateStoreType).config.countryCode,
      shallow
    ),
    geolocation: useStore(
      (state) => (state as GlobalStateStoreType).config.geolocation,
      shallow
    ),
    resultType: useStore(
      (state) => (state as GlobalStateStoreType).config.resultType,
      shallow
    ),
    allowedMediaTypes: useStore(
      (state) => (state as GlobalStateStoreType).config.allowedMediaTypes,
      shallow
    ),
    replace: useStore(
      (state) => (state as GlobalStateStoreType).config.replace,
      shallow
    ),
    filterLevel: useStore(
      (state) => (state as GlobalStateStoreType).config.filterLevel,
      shallow
    ),
    searchTerm: useStore(
      (state) => (state as GlobalStateStoreType).config.searchTerm,
      shallow
    ),
    numTweets: useStore(
      (state) => (state as GlobalStateStoreType).config.numTweets,
      shallow
    ),
    isOffline: useStore(
      (state) => (state as GlobalStateStoreType).config.isOffline,
      shallow
    ),
    setConfig: useStore(
      (state) => (state as GlobalStateStoreType).setConfig,
      shallow
    ),
  };
};

export const useNodes = (): Tweet[] =>
  useStore((state) => (state as GlobalStateStoreType).nodesFromServer);
export const useSelectedNode = () =>
  useStore((state) => (state as GlobalStateStoreType).selectedNode);
export const useSetSelectedNode = () =>
  useStore((state) => (state as GlobalStateStoreType).setSelectedNode);
export const useTooltipNode = (): Tweet | null =>
  useStore((state) => (state as GlobalStateStoreType).tooltipNode);
export const useSetTooltipNode = () =>
  useStore((state) => (state as GlobalStateStoreType).setTooltipNode);
export const useLoading = () =>
  useStore((state) => (state as GlobalStateStoreType).loading);
export const useSetLoading = () =>
  useStore((state) => (state as GlobalStateStoreType).setLoading);
export const useLikesByUserId = () =>
  useStore((state) => (state as GlobalStateStoreType).likesByUserId);
export const useSetLikesByUserId = () =>
  useStore((state) => (state as GlobalStateStoreType).setLikesByUserId);
// export const useRepliesByUserId = () =>
//   useStore((state) => (state as GlobalStateStoreType).repliesByUserId);
// export const useSetRepliesByUserId = () =>
//   useStore((state) => (state as GlobalStateStoreType).setRepliesByUserId);
export const useRetweetsByTweetId = () =>
  useStore((state) => (state as GlobalStateStoreType).retweetsByTweetId);
export const useSetRetweetsByTweetId = () =>
  useStore((state) => (state as GlobalStateStoreType).setRetweetsByTweetId);

export const useStoredSaves = () =>
  useStore((state) => ({
    saves: (state as GlobalStateStoreType).savedDatasets,
    setSaves: (state as GlobalStateStoreType).setSavedDatasets,
  }));

/** transform and save nodes to store */
export const useSetNodes = () => {
  const { replace } = useConfig();
  const setRetweets = useSetRetweetsByTweetId();
  const setLikes = useSetLikesByUserId();
  const nodesFromServer = useStore(
    (state) => (state as GlobalStateStoreType).nodesFromServer
  );
  const setNodesFromServer = useStore(
    (state) => (state as GlobalStateStoreType).setNodesFromServer
  );
  return (nodesArg: Tweet[], forceReplace: boolean = false) => {
    if (replace || forceReplace) {
      // delete all likes, retweets
      setRetweets({});
      setLikes({});
    }

    const isError = !Array.isArray(nodesArg);
    if (isError) {
      console.error(nodesArg);
    }
    const nodes = isError ? [] : nodesArg;

    const newTweets =
      replace || forceReplace
        ? nodes
        : uniqBy([...nodesFromServer, ...nodes], (t) => t.id);

    // * whenever we change the nodes,
    // * scan all the nodes once to create
    // * retweetsByTweetId

    const retweetsByTweetId: { [tweetId: string]: string[] } = newTweets.reduce(
      (acc, tweet) => {
        // for each tweet,
        // if the tweet has a retweet in it
        const hasRetweet = tweet?.retweeted_status?.id;
        // add its id_str to the array associated with its tweet.id
        if (hasRetweet) {
          // check the existing nodes for this tweet,
          // if it exists, add it to the list to create a link
          // *(this operation is now O^N2, but it's only performed when the nodes change)
          const isRetweetInAllTweets = Boolean(
            newTweets.find((t) => t.id === tweet.retweeted_status?.id)
          );

          if (isRetweetInAllTweets) {
            acc = {
              ...acc,
              [tweet.id]: [
                ...(acc[tweet.id] || []),
                tweet.retweeted_status?.id,
              ],
            };
          }
        }

        return acc;
      },
      {}
    );

    // for each retweet node, tag is as such
    const tweetIdsToTagAsOriginal = Object.values(retweetsByTweetId).reduce(
      (acc, retweetIds) => [...acc, ...retweetIds],
      [] as string[]
    );
    const tweetIdsToTagAsRetweet = Object.keys(retweetsByTweetId).reduce(
      (acc, tweetId) => [...acc, tweetId],
      [] as string[]
    );

    setRetweets(retweetsByTweetId);

    const newTweetsTagged = newTweets.map((t) => ({
      ...t,
      ...(tweetIdsToTagAsOriginal.includes(t.id)
        ? { isRetweetNode: true }
        : {}),
      ...(tweetIdsToTagAsRetweet.includes(t.id)
        ? { isOriginalNode: true }
        : {}),
    }));

    setNodesFromServer(newTweetsTagged);
  };
};

/** transform and add nodes to store */
export const useAddTweets = () => {
  const nodesFromServer = useStore(
    (state) => (state as GlobalStateStoreType).nodesFromServer
  );
  const setNodesFromServer = useStore(
    (state) => (state as GlobalStateStoreType).setNodesFromServer
  );

  return (nodes: Tweet[]) => {
    const newTweets = uniqBy([...nodesFromServer, ...nodes], (t) => t.id);
    setNodesFromServer(newTweets);
  };
};

/** delete a tweet from store */
export const useDeleteTweet = () => {
  const nodesFromServer = useStore(
    (state) => (state as GlobalStateStoreType).nodesFromServer,
    shallow
  );
  const setNodesFromServer = useStore(
    (state) => (state as GlobalStateStoreType).setNodesFromServer
  );
  return useCallback(
    (tweetId: string) => {
      const newTweets = nodesFromServer.filter((t) => t.id !== tweetId);
      setNodesFromServer(newTweets);
    },
    [nodesFromServer, setNodesFromServer]
  );
};

export type WordcloudConfig = {
  minChars: number;
  maxChars: number;
  minInstances: number;
  numAngles: number;
};

export const useWordcloudConfig = () => {
  return {
    minChars: useStore(
      (state) => (state as GlobalStateStoreType).wordcloudConfig.minChars
    ),
    maxChars: useStore(
      (state) => (state as GlobalStateStoreType).wordcloudConfig.maxChars
    ),
    minInstances: useStore(
      (state) => (state as GlobalStateStoreType).wordcloudConfig.minInstances
    ),
    numAngles: useStore(
      (state) => (state as GlobalStateStoreType).wordcloudConfig.numAngles
    ),
    setWordcloudConfig: useStore(
      (state) => (state as GlobalStateStoreType).setWordcloudConfig
    ),
  };
};

/** returns some of ["all","video","photo","text"] */
export function useAllowedMediaTypes(): string[] {
  const allowedMediaTypes = useStore(
    (state) => (state as GlobalStateStoreType).config.allowedMediaTypes
  );

  return [
    ...(allowedMediaTypes.video ? ["video"] : []),
    ...(allowedMediaTypes.photo ? ["photo"] : []),
    ...(allowedMediaTypes.animated_gif ? ["animated_gif"] : []),
    ...(allowedMediaTypes.text ? ["text"] : []),
  ];
}

export const useIsLeftDrawerOpen = () => {
  const isDrawerOpen = useStore(
    (state) => (state as GlobalStateStoreType).isDrawerOpen
  );
  const setIsDrawerOpen = useStore(
    (state) => (state as GlobalStateStoreType).setIsDrawerOpen
  );
  return { isDrawerOpen, setIsDrawerOpen };
};

export const useRecomputeGraph = () => {
  const nodes = useNodes();
  const setNodes = useSetNodes();
  return () => setTimeout(() => setNodes(nodes));
};

export function usePrevious(value: any): typeof value {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef();

  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current;
}
