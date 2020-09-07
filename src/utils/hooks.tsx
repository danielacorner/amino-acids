import { useState, useEffect } from "react";
import { useConfig, useSetTweets } from "../providers/store";

export function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  return windowSize;
}

export function useFetchTimeline() {
  const [loading, setLoading] = useState(false);
  const { numTweets, mediaType } = useConfig();
  const setTweets = useSetTweets();

  const fetchTimeline = async (userId: string) => {
    setLoading(true);
    const resp = await fetch(
      `/api/user_timeline?id_str=${userId}&num=${numTweets}&mediaType=${mediaType}`
    );
    console.log("🌟🚨: fetchTimeline -> resp", resp);
    const data = await resp.json();
    console.log("🌟🚨: fetchTimeline -> data", data);
    setLoading(false);
    setTweets(data);
  };

  return { loading, fetchTimeline };
}
