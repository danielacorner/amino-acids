import React from "react";
import { Menu, MenuItem } from "@material-ui/core";
import { User } from "types";

type RightClickMenuProps = {
  anchorEl: any;
  handleClose: Function;
  isMenuOpen: boolean;
  user?: User;
  MenuProps?: any;
};

// tslint:disable-next-line: cognitive-complexity
export default function RightClickMenu({
  anchorEl,
  handleClose,
  isMenuOpen,
  user,
  MenuProps = {},
}: RightClickMenuProps) {
  return (
    <Menu
      {...(anchorEl ? { anchorEl } : {})}
      onBackdropClick={handleClose}
      open={isMenuOpen}
      {...MenuProps}
    >
      {/* <MenuItem
        onClick={() => {
          if (user) {
            fetchTimeline(user.id);
          }
          handleClose();
        }}
      >
        Fetch {numTweets} nodes by {tooltipNode?.user.name} (@
        {tooltipNode?.user.screen_name})
      </MenuItem> */}
      <MenuItem
        onClick={() => {
          console.log("hey");
        }}
      >
        Media
      </MenuItem>
      {/* <MenuItem onClick={handleFetchFollowing}>Following</MenuItem> */}
      {/* <MenuItem onClick={handleFetchFollowers}>Followers</MenuItem> */}
    </Menu>
  );
}
