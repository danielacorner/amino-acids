import { useEffect, useRef } from "react";
import { NODE_DIAMETER, AVATAR_DIAMETER } from "./useForceGraphProps";
import { useConfig, useNodes } from "../../providers/store";
import * as d3 from "d3";
import {
  useGetIsLikeLink,
  getIsRetweetLink,
  getIsTweetToRetweetLink,
} from "utils/hooks";
import { SimulationNodeDatum } from "d3";
import { Tweet } from "types";

// tslint:disable-next-line
export function useTheForce(fg: any, graph: { nodes: any[]; links: any[] }) {
  const getIsLikeLink = useGetIsLikeLink();
  const {
    gravity,
    charge,
    showUserNodes,
    isGridMode,
    setConfig,
    isPaused,
  } = useConfig();

  // in Grid mode, when we fetch new nodes, temporarily unpause
  const nodes = useNodes();
  const prevTweets = useRef(nodes);
  useEffect(() => {
    let timer;
    if (isGridMode && isPaused && nodes.length !== prevTweets.current.length) {
      setConfig({ isPaused: false });
      timer = window.setTimeout(() => setConfig({ isPaused: false }), 1000);
    }

    prevTweets.current = nodes;

    return () => {
      if (timer) {
        window.clearTimeout(timer);
      }
    };
  }, [setConfig, nodes, isGridMode, isPaused]);

  // pause when we activate grid mode
  // unpause when we deactivate grid mode
  useEffect(() => {
    if (isGridMode) {
      // once the nodes have settled, pause the simulation
      setTimeout(() => {
        setConfig({ isPaused: true });
      }, 1000);
    } else {
      setConfig({ isPaused: false });
    }
  }, [setConfig, isGridMode]);

  // handle the force simulation
  useEffect(() => {
    if (!fg) {
      return;
    }

    // Deactivate existing forces
    // fg.d3Force("center", d3.forceCenter());
    // fg.d3Force("gravity", d3.forceManyBody().strength(10));
    // position each node in a (square?) grid
    // order from top-left, rightwards
    const gridColumnWidth = 100;

    if (isGridMode) {
      // turn off forces
      fg.d3Force("gravity", null);
      fg.d3Force("charge", null);
      fg.d3Force("link", null);
      fg.d3Force("center", null);

      const FORCE_GRID_STRENGTH = 2;

      fg.d3Force(
        "forceX",
        d3
          .forceX((node, idx, allNodes) => {
            // each node goes to the right
            const numNodesAcross = Math.floor(allNodes.length ** 0.5);
            const gridColumn = idx % numNodesAcross;

            // const randomNumberNear1 = 1.01 - 0.05 * Math.random();
            const randomNumberNear1 = 1;

            return (
              -0.5 * gridColumnWidth +
              gridColumn * gridColumnWidth * randomNumberNear1
            );
          })
          .strength(FORCE_GRID_STRENGTH)
      );
      fg.d3Force(
        "forceY",
        d3
          .forceY((node, idx, allNodes) => {
            // each node goes in its column
            const numNodesAcross = Math.floor(allNodes.length ** 0.5);
            const gridRow = Math.floor(idx / numNodesAcross);

            // const randomNumberNear1 = 1.01 - 0.05 * Math.random();
            const randomNumberNear1 = 1;

            return (
              -0.5 * gridColumnWidth +
              gridRow * gridColumnWidth * randomNumberNear1
            );
          })
          .strength(FORCE_GRID_STRENGTH)
      );
    } else {
      // disable positioning forces
      fg.d3Force("forceY", null);
      fg.d3Force("forceX", null);

      // gravitate nodes together
      fg.d3Force(
        "gravity",
        d3.forceManyBody().strength((node, idx, nodes) => {
          if (showUserNodes) {
            // if users are visible, only user nodes have gravity
            const nodeMass = (node as Tweet & SimulationNodeDatum).isUserNode
              ? (AVATAR_DIAMETER / NODE_DIAMETER) ** 2
              : 0;
            return gravity * nodeMass;
          } else {
            return gravity;
          }
        })
        // turn off gravity when nodes get close enough together
        // .distanceMin(NODE_DIAMETER * 5)
        // so that you can drag nodes apart and have them stop pulling back together, max distance
        // .distanceMax(NODE_DIAMETER * 50)
      );

      // repel nodes from each other
      fg.d3Force(
        "charge",
        d3
          .forceManyBody()
          .strength((node, idx, nodes) => {
            const nodeMass = (node as Tweet & SimulationNodeDatum).isUserNode
              ? AVATAR_DIAMETER / NODE_DIAMETER
              : 1;
            return charge * nodeMass;
          })
          // .strength((node) => ((node as Tweet).isUserNode ? -360 : -30))
          // max distance to push other nodes away
          .distanceMax((showUserNodes ? AVATAR_DIAMETER : NODE_DIAMETER) * 5)
      );

      // fg.d3Force("collide", d3.forceCollide(NODE_DIAMETER));
      // fg.d3Force("link", null);
      // apply custom forces
      fg.d3Force(
        "link",
        d3
          .forceLink(graph.links)
          .strength((link, idx, links) => {
            const isLikeLink = getIsLikeLink(link);
            const isRetweetLink = getIsRetweetLink(link);
            const isTweetToRetweetLink = getIsTweetToRetweetLink(link);

            const mult = isLikeLink
              ? 1
              : isRetweetLink
              ? 1
              : isTweetToRetweetLink
              ? 0 // original tweet can be any distance from retweet
              : 1;

            return mult * 0.2;
          })
          .distance((link, idx, links) => {
            const isLikeLink = getIsLikeLink(link);
            const isRetweetLink = getIsRetweetLink(link);
            const isTweetToRetweetLink = getIsTweetToRetweetLink(link);

            const mult = isLikeLink
              ? 7
              : isRetweetLink
              ? 5
              : isTweetToRetweetLink
              ? 0 // original tweet can be any distance from retweet
              : 1;
            return mult * AVATAR_DIAMETER;
          })
      );
      fg.d3Force("center", d3.forceCenter());

      // fg.d3Force("pullTogether", d3.forceManyBody().strength(400));
      // setTimeout(() => {
      //   fg.d3Force("pullTogether", null);
      // }, 250);
      // gravitate all towards each other
      // fg.d3Force("gravity", d3.forceManyBody().strength(140));
      // spring all to center, then stop
      // fg.d3Force("forceY", d3.forceY(0).strength(0.1));
      // fg.d3Force("forceX", d3.forceX(0).strength(0.1));
      // setTimeout(() => {
      // fg.d3Force("gravity", null);
      //   fg.d3Force("forceY", null);
      //   fg.d3Force("forceX", null);
      // }, 250);
    }

    // https://github.com/vasturiano/react-force-graph/blob/master/example/collision-detection/index.html
    // https://www.npmjs.com/package/d3-force-cluster
    // https://bl.ocks.org/ericsoco/4e1b7b628771ae77753842e6dabfcef3
    // cluster centers = user nodes
    // const clusterCenters: { [userId: string]: Tweet } = userNodes.reduce(
    //   (acc, cur) =>
    //     // if we don't already have the user node, add it to the object
    //     ({ ...acc, [cur.user.id]: cur }),
    //   // !(cur.user.id in acc) ? { ...acc, [cur.user.id]: cur } : acc,
    //   {}
    // );
    // fg.d3Force("cluster", (alpha) => {
    //   graphWithUsers.nodes.forEach(function (d) {
    //     const cluster = clusterCenters[d.cluster] as any;
    //     if (!cluster || cluster.id === d.id) {
    //       return;
    //     }
    //     let x = d.x - (cluster.x || 0),
    //       y = d.y - (cluster.y || 0),
    //       l = Math.sqrt(x * x + y * y),
    //       r = NODE_DIAMETER / 2;
    //     // r = d.radius + cluster.radius;
    //     if (l != r) {
    //       l = (l - r) / (l * alpha ** 0.1);
    //       d.x -= x *= l;
    //       d.y -= y *= l;
    //       cluster.x += x;
    //       cluster.y += y;
    //     }
    //   });
    // });
    // fg.d3Force("box", () => {
    //   const SQUARE_HALF_SIDE = (window.innerWidth - CONTROLS_WIDTH) / 2;
    //   graph.nodes.forEach((node) => {
    //     const x = node.x || 0,
    //       y = node.y || 0;
    //     // bounce on box walls
    //     if (Math.abs(x) > SQUARE_HALF_SIDE) {
    //       node.vx *= -1;
    //     }
    //     if (Math.abs(y) > SQUARE_HALF_SIDE) {
    //       node.vy *= -1;
    //     }
    //   });
    // });
  }, [
    graph,
    fg,
    isGridMode,
    showUserNodes,
    gravity,
    charge,
    getIsLikeLink,
    setConfig,
  ]);
}
