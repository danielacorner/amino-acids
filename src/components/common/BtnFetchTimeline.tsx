import React, { useState, useRef } from "react";

import { Button, Tooltip } from "@material-ui/core";
import { useFetchTimeline } from "../../utils/hooks";
import { User } from "../../types";
import { useIsLight } from "../../providers/ThemeManager";
import RightClickMenu from "./RightClickMenu";

export default function BtnFetchTimeline({ user }: { user: User }) {
  const { fetchTimeline } = useFetchTimeline();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLight = useIsLight();
  const ref = useRef();
  const handleClose = () => setIsMenuOpen(false);
  return (
    <>
      <Tooltip title="right-click for more options">
        <Button
          ref={ref as any}
          className="btnFetchTimeline"
          variant="outlined"
          style={{
            border: "1px solid cornflowerblue",
            color: `hsl(200,50%,${isLight ? 30 : 70}%)`,
          }}
          onClick={() => user?.id && fetchTimeline(user.id)}
          onContextMenu={(e) => {
            e.preventDefault();
            setIsMenuOpen(true);
          }}
        >
          Fetch
        </Button>
      </Tooltip>
      <RightClickMenu
        {...{
          user,
          isMenuOpen,
          handleClose,
          anchorEl: ref.current,
        }}
      />
    </>
  );
}
