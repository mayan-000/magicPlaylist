import React, { useEffect } from "react";
import { Outlet } from "react-router";
import { AppBar, Toolbar, CardMedia, Card, Button, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./store/spotifySlice";
import SnackBar from "./components/UI/SnackBar";
import { PlaylistActions } from "./store/playlistSlice";
import { useNavigate } from "react-router";


function App() {
  const loggedIn = useSelector((state) => state.spotify.loggedIn);
  const playerOpen = useSelector((state) => state.spotify.link);
  const playlistCreated = useSelector(
    (state) => state.playlist.playlistCreated
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => {
      dispatch(PlaylistActions.playlistSnackBar({ status: false }));
    }, 5000);
  }, [dispatch, playlistCreated]);

  return (
    <Box>
      <AppBar position="static" sx={{ height: "80px" }}>
        <Toolbar>
          <Card
            sx={{
              bgcolor: "black",
              p: "10px",
              m: "10px",
            }}
          >
            <Button
              onClick={() => {
                navigate("/");
              }}
            >
              <CardMedia
                component="img"
                height="40px"
                image="https://magicplaylist.co/images/header_logo_min.png"
                alt="Logo"
                sx={{ display: { sm: "none" } }}
              />
              <CardMedia
                component="img"
                height="40px"
                image="https://magicplaylist.co/images/header_logo_2x.png"
                alt="Logo"
                sx={{ display: { xs: "none", sm: "block" } }}
              />
            </Button>
          </Card>
          <Box sx={{ position: "absolute", right: 0, mr: "5vw" }}>
            <Button
              color="inherit"
              sx={{ px: { md: "10px", xs: "5px" }, border: "white 1px solid" }}
              onClick={login}
              disabled={loggedIn}
            >
              {loggedIn ? "Connected" : "Connect"}
              <CardMedia
                component="img"
                height="50px"
                image="https://img.icons8.com/plasticine/100/000000/spotify.png"
                alt="Spotify"
                sx={{ height: { xs: "30px", md: "50px" } }}
              />
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Outlet />
      {playerOpen.type !== null && (
        <Card
          sx={{
            position: "fixed",
            bottom: 0,
            width: "100%",
            height: "81px",
          }}
        >
          <iframe
            title="Player"
            src={`https://open.spotify.com/embed/${playerOpen.type}/${playerOpen.id}`}
            width="100%"
            height="80"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          ></iframe>
        </Card>
      )}

      <SnackBar
        message={"Playlist Created"}
        open={playlistCreated}
        time={5000}
      />
    </Box>
  );
}

export default App;
