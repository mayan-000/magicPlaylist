import { Avatar, ImageListItem, ImageListItemBar, Button } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

export default function Image(props) {
  return (
    <Button
      sx={{
        px: { xs: "2px" },
        width: props.imgStyle.width,
      }}
      onClick={() => {
        props.listItemClickHandler(props.element);
      }}
    >
      <Box>
        <ImageListItem sx={{ objectFit: "cover" }}>
          <img
            style={props.imgStyle}
            src={`${props.element.url}?w=248&fit=crop&auto=format`}
            srcSet={`${props.element.url}?w=248&fit=crop&auto=format&dpr=2 2x`}
            alt={"songImage"}
            loading="lazy"
          />
          <ImageListItemBar title={props.element.title} sx={{ pl: "25px" }} />
          <Avatar
            src="https://img.icons8.com/plasticine/100/000000/spotify.png"
            alt="Spotify"
          />
        </ImageListItem>
      </Box>
    </Button>
  );
}
