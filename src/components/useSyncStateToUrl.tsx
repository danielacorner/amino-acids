import { useEffect } from "react";
import { useHistory, useLocation } from "react-router";
import { useNodes } from "../providers/store";
import qs from "query-string";

/** when the tweets change, update the url */
export default function useSyncStateToUrl() {
  const nodes = useNodes();
  const history = useHistory();
  const { pathname, search } = useLocation();
  const queryObj = qs.parse(search);

  // TODO: not working when fetch tweets by id?
  useEffect(() => {
    // const queryObj = qs.parse(search);
    const newQueryObj = {
      ...queryObj,
      ...(nodes ? { nodes: nodes.map((t) => t.id).join(",") } : {}),
    };

    const newSearch = "?" + qs.stringify(newQueryObj);

    const oldPathAndSearch = `${pathname}${search}`;
    const newPathAndSearch = `${pathname}${newSearch}`;

    if (newPathAndSearch !== oldPathAndSearch) {
      history.push(newPathAndSearch);
    }
  }, [pathname, history, nodes, search, queryObj]);
}
