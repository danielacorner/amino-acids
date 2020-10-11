import React from "react";
import {
  useConfig,
  useSetTweets,
  useLoading,
  useAllowedMediaTypes,
} from "../../../providers/store";
import DiceIcon from "@material-ui/icons/Casino";
import { SERVER_URL } from "../../../utils/constants";
import { CollapsibleButton } from "./CollapsibleButton";
import { RowDiv } from "../../common/styledComponents";
import { HowManyTweets } from "../Inputs";

export function BtnStreamNewTweets() {
  const {
    lang,
    countryCode,
    numTweets,
    filterLevel,
    geolocation,
  } = useConfig();
  const allowedMediaTypesStrings = useAllowedMediaTypes();
  const { loading, setLoading } = useLoading();
  const setTweets = useSetTweets();

  const fetchNewTweets = async () => {
    setLoading(true);
    // after 10 seconds, stop loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 10 * 1000);

    const langParam = lang !== "All" ? `&lang=${lang}` : "";
    const allowedMediaParam =
      allowedMediaTypesStrings.length > 0
        ? `&allowedMediaTypes=${allowedMediaTypesStrings.join(",")}`
        : "";
    const countryParam =
      countryCode !== "All" ? `&countryCode=${countryCode}` : "";

    const locations = geolocation
      ? `${geolocation.latitude.left},${geolocation.longitude.left},${geolocation.latitude.right},${geolocation.longitude.right}`
      : "";

    const resp = await fetch(
      geolocation
        ? `${SERVER_URL}/api/filter?num=${numTweets}&locations=${locations}${allowedMediaParam}`
        : `${SERVER_URL}/api/stream?num=${numTweets}&filterLevel=${filterLevel}${allowedMediaParam}${countryParam}${langParam}`
    );

    const data = await resp.json();
    setLoading(false);
    clearTimeout(timer);

    setTweets(data);
  };

  return (
    <RowDiv style={{ alignItems: "flex-end" }}>
      <HowManyTweets />
      <CollapsibleButton
        css={`
          width: fit-content;
        `}
        text={"Stream Tweets"}
        icon={<DiceIcon className="diceIcon" />}
        disabled={loading}
        onClick={fetchNewTweets}
        className="btnFetch"
        variant="contained"
        color="primary"
      />
    </RowDiv>
  );
}