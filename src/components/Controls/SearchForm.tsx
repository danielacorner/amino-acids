import React, { useState } from "react";
import { TextField, IconButton } from "@material-ui/core";
import { SERVER_URL } from "../../utils/constants";
import { useFetchTimeline, useParamsForFetch } from "../../utils/hooks";
import {
  useConfig,
  useSetNodes,
  useLoading,
  useSetLoading,
} from "../../providers/store";
import SearchIcon from "@material-ui/icons/Search";
import styled from "styled-components/macro";

export function SearchForm() {
  const [searchTerm, setSearchTerm] = useState("");
  const { numTweets, resultType } = useConfig();
  const loading = useLoading();
  const setLoading = useSetLoading();
  const setNodes = useSetNodes();
  const { fetchTimelineByHandle } = useFetchTimeline();

  const {
    langParam,
    allowedMediaTypesParam,
    countryParam,
    geocodeParam,
  } = useParamsForFetch();

  const fetchSearchResults = async () => {
    setLoading(true);

    if (searchTerm[0] === "@") {
      fetchTimelineByHandle(searchTerm.slice(1));
      // fetch user
    } else {
      // search by term
      const resp = await fetch(
        `${SERVER_URL}/api/search?term=${searchTerm}&num=${numTweets}&result_type=${resultType}${langParam}${allowedMediaTypesParam}${countryParam}${geocodeParam}`
      );
      const data = await resp.json();

      setNodes(data);
    }
  };
  return (
    <Form
      css={`
        display: flex;
        /* place-items: center;
        grid-gap: 0.5em;
        grid-template-columns: 1fr auto; */
      `}
      onSubmit={(e) => {
        e.preventDefault();
        fetchSearchResults();
      }}
    >
      <TextField
        label="Search by terms or @username"
        value={searchTerm}
        style={{
          // textAlign: "left",
          // height: 36,
          // marginTop: -32,
          width: "100%",
        }}
        // InputProps={{ style: { height: 36 } }}
        onChange={(e) => setSearchTerm(e.target.value)}
        type="text"
      />
      <IconButton
        color="primary"
        onClick={fetchSearchResults}
        disabled={loading || searchTerm === ""}
        type="submit"
      >
        <SearchIcon />
      </IconButton>
    </Form>
  );
}
const Form = styled.form``;
