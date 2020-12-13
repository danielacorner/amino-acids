import React from "react";
import { Button } from "@material-ui/core";
import { useFetchTimeline } from "../../utils/hooks";
import { User } from "../../types";

/** button which shows up when we're looking at a user's gallery */
const BtnFetchMore = ({ user }: { user: User }) => {
  const { fetchTimeline, loading } = useFetchTimeline();

  const handleFetchMore = () => {
    fetchTimeline(user.id, true);
  };
  return (
    <Button variant="outlined" disabled={loading} onClick={handleFetchMore}>
      Fetch More
    </Button>
  );
};

export default BtnFetchMore;
