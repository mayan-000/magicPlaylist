import {
  Avatar,
  Card,
  Grow,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";

export default function SearchSongsList(props) {

  if (props.songs.length === 0) {
    return (
      <Typography
        variant="h4"
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: "5px",
        }}
      >
        Whoopsie! Can't Find it.
      </Typography>
    );
  }
  return (
    <Box sx={{ height: "55vh", overflow: "auto" }}>
      {props.songs.map((song, index) => (
        <Card
          sx={{
            width: { xs: "90vw", md: "50vw" },
            mt: "2px",
            cursor: "pointer",
          }}
          key={index}
          onClick={(event) => {
            props.songClickHandler(song);
          }}
        >
          <Grow in timeout={500}>
            <ListItem
              sx={{
                mt: "1px",
              }}
              disablePadding
            >
              <ListItemButton>
                <ListItemIcon>
                  <Avatar src={song.album.images[0].url} alt={song.name} />
                </ListItemIcon>
                <ListItemText
                  primary={song.name}
                  secondary={song.artists.map(
                    (node, index) =>
                      node.name +
                      (song.artists.length - 1 !== index ? " | " : "")
                  )}
                />
              </ListItemButton>
            </ListItem>
          </Grow>
        </Card>
      ))}
    </Box>
  );
}
