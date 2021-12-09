import { Close, Save, Create } from "@mui/icons-material";
import {
  Card,
  CardContent,
  List,
  Box,
  ListItem,
  ListItemIcon,
  Avatar,
  ListItemText,
  ListItemButton,
  ImageList,
  Typography,
  IconButton,
  Button,
  Drawer,
  Checkbox,
  Modal,
  TextField,
  Collapse,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { PlaylistActions } from "../store/playlistSlice";
import {
  getSimilarSongs,
  getSong,
  login,
  savePlaylist,
  searchSong,
} from "../store/spotifySlice";
import { SpotifyActions } from "../store/spotifySlice";
import Image from "./UI/Image";
import SearchSongsList from "./UI/SearchSongsList";
import SkeletonLoading from "./UI/SkeletonLoading";
import SnackBar from "./UI/SnackBar";

const Songs = () => {
  const params = useParams();
  const [list, setList] = useState(null);
  const [snackBarOpen, setSnackBarOpen] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const expiresAt = useSelector((state) => state.spotify.expiresAt);

  useEffect(() => {
    dispatch(PlaylistActions.removeSongs());
    const findSimilar = async () => {
      if (expiresAt <= new Date().getTime()) {
        sessionExpired();
      } else {
        try {
          setList(null);

          let param = params.id;
          if (param.startsWith("genre")) {
            param = param.substring(6);
            const response = await getSimilarSongs(null, param);
            dispatch(
              SpotifyActions._playSong({
                link: { type: "track", id: response[0].id },
              })
            );
            setList([...response]);
          } else {
            const response = await getSimilarSongs(param, null);
            const song = await getSong(param);
            dispatch(
              SpotifyActions._playSong({
                link: { type: "track", id: params.id },
              })
            );
            setList([song, ...response]);
          }
        } catch (e) {
          console.log(e);
          navigate("/");
        }
      }
    };

    findSimilar();
  }, [dispatch, expiresAt, params, navigate]);

  const addSong = (song) => {
    setList((prev) => {
      let temp = prev.find((_song) => _song.uri === song.uri);
      if (temp === undefined) {
        setSnackBarOpen("Song Added!");

        return [...prev, song];
      } else {
        setSnackBarOpen("Song Already Present!");

        return prev;
      }
    });
    setTimeout(() => {
      setSnackBarOpen(null);
    }, 2000);
  };

  const sessionExpired = () => {
    setSnackBarOpen("Session Expired...");
    setTimeout(() => {
      login();
      setSnackBarOpen(null);
    }, 2000);
  };

  const playlistCreated = () => {
    setSnackBarOpen("Playlist Created!");
    setTimeout(() => {
      setSnackBarOpen(null);
    }, 2000);
  };

  return (
    <>
      <SongsList
        response={list}
        addSong={addSong}
        sessionExpired={sessionExpired}
        playlistCreated={playlistCreated}
      />
      <SnackBar open={snackBarOpen !== null} message={snackBarOpen} />
    </>
  );
};

export default Songs;

const SongsList = (props) => {
  const [openModal, setOpenModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();

  const openMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const songImageClickHandler = (element) => {
    dispatch(SpotifyActions._playSong({ link: { type: null, id: null } }));
    setTimeout(() => {
      dispatch(
        SpotifyActions._playSong({
          link: { type: "track", id: element.id },
        })
      );
    }, 100);
  };

  return (
    <>
      <Box>
        {props.response !== null &&
          (props.response.length !== 0 ? (
            <Card
              sx={{
                border: "",
                borderRadius: 0,
                display: "grid",
                gridTemplateColumns: "repeat(12, 1fr)",
              }}
            >
              <CardContent
                sx={{
                  overflowY: "scroll",
                  boxSizing: "border-box",
                  gridColumnStart: "1",
                  gridColumnEnd: "9",
                  padding: 0,
                  px: "5px",
                  height: "calc(100vh - 140px)",
                  display: { xs: "none", md: "block" },
                }}
              >
                <Box>
                  <ImageList cols={4} gap={2}>
                    {props.response.map((element, index) => (
                      <Image
                        element={{
                          url: element.album.images[0].url,
                          title: element.name,
                          id: element.id,
                        }}
                        imgStyle={{
                          width: "16vw",
                        }}
                        key={index}
                        listItemClickHandler={songImageClickHandler}
                      />
                    ))}
                  </ImageList>
                </Box>
              </CardContent>

              <CardContent
                sx={{
                  padding: 0,
                  overflow: "scroll",
                  height: "calc(100vh - 140px)",
                  boxSizing: "border-box",
                  gridColumnStart: { xs: "1", md: "9" },
                  gridColumnEnd: "13",
                  mt: "10px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-evenly",
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={() => {
                      openMenu();
                    }}
                    sx={{px: {xs: "4px", sm:"8px", md: "16px"}}}
                  >
                    Create Playlist <Save sx={{ ml: "2px" }} />
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setOpenModal(true);
                    }}
                    sx={{px: {xs: "4px", sm: "8px", md: "16px"}}}
                  >
                    Add new Song <Create sx={{ ml: "2px" }} />
                  </Button>
                </Box>
                <List>
                  {props.response.map((element, index) => (
                    <Song key={index} element={element} />
                  ))}
                </List>
              </CardContent>
            </Card>
          ) : (
            <CantFind />
          ))}
      </Box>
      <AddSongModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        addSong={props.addSong}
        sessionExpired={props.sessionExpired}
      />
      <MenuDrawer
        menuOpen={menuOpen}
        setMenuOpen={openMenu}
        sessionExpired={props.sessionExpired}
        playlistCreated={props.playlistCreated}
      />
    </>
  );
};

const Song = (props) => {
  const dispatch = useDispatch();
  const [checked, setChecked] = useState(true);

  useEffect(() => {
    if (checked) {
      dispatch(PlaylistActions.addSong({ uri: props.element.uri }));
    } else {
      dispatch(PlaylistActions.removeSong({ uri: props.element.uri }));
    }
  }, [checked, dispatch, props.element.uri]);

  return (
    <ListItem
      sx={{
        mt: "1px",
      }}
      disablePadding
      secondaryAction={
        <Checkbox
          edge="end"
          onChange={() => {
            setChecked((prev) => !prev);
          }}
          checked={checked}
        />
      }
    >
      <ListItemButton
        onClick={() => {
          dispatch(
            SpotifyActions._playSong({ link: { type: null, id: null } })
          );
          setTimeout(() => {
            dispatch(
              SpotifyActions._playSong({
                link: { type: "track", id: props.element.id },
              })
            );
          }, 100);
        }}
      >
        <ListItemIcon>
          <Avatar
            src={props.element.album.images[0].url}
            alt={props.element.name}
          />
        </ListItemIcon>
        <ListItemText
          primary={props.element.name}
          secondary={props.element.artists.map(
            (node, index) =>
              node.name +
              (props.element.artists.length - 1 !== index ? " | " : "")
          )}
        />
      </ListItemButton>
    </ListItem>
  );
};

const CantFind = () => {
  const bull = useMemo(() => {
    return (
      <Box
        component="span"
        sx={{
          display: "inline-block",
          mx: "2px",
          transform: "scale(0.8)",
        }}
      >
        •
      </Box>
    );
  }, []);

  return (
    <Card
      variant="outlined"
      sx={{
        mx: "auto",
        textAlign: "center",
      }}
    >
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Word of the Day
        </Typography>
        <Typography
          variant="h5"
          component="div"
          sx={{ fontWeight: 700, mb: 2 }}
        >
          Can't{bull}Find{bull}Simi{bull}lar
        </Typography>
        <Typography sx={{ fontWeight: 600, mb: 1 }} color="text.secondary">
          adjective
        </Typography>
        <Typography variant="body2">Empty List.</Typography>
      </CardContent>
    </Card>
  );
};

const AddSongModal = (props) => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState(null);
  const [searchParams, setSearchParams] = useState("");
  const expiresAt = useSelector((state) => state.spotify.expiresAt);

  useEffect(() => {
    let search = setTimeout(() => {
      if (searchParams === "") {
        setLoading(false);
        setList(null);
      } else {
        setLoading(true);
        if (expiresAt <= new Date().getTime()) {
          props.sessionExpired();
        } else {
          searchSong(searchParams)
            .then((data) => {
              setList(null);
              setList(data.tracks.items);
            })
            .catch((e) => {
              console.log(e);
            });
        }
      }
    }, 500);
    return () => {
      clearTimeout(search);
    };
  }, [expiresAt, props, searchParams]);

  return (
    <Modal
      open={props.openModal}
      onClose={() => {
        props.setOpenModal(false);
        setSearchParams("");
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Card sx={{ minHeight: "40vh", display: "grid", placeItems: "center", width: {xs: "100vw", sm: "60vw"} }}>
          <CardContent
            sx={{
              display: "grid",
              placeItems: "center",
              textAlign: "center",
            }}
          >
            <Typography variant="h5">Add Song by your choice.</Typography>
            <TextField
              variant="standard"
              label="Find Song"
              value={searchParams}
              autoFocus
              onChange={(event) => {
                setSearchParams(event.target.value);
              }}
            />
            <Collapse in={loading}>
              {list === null ? (
                <SkeletonLoading />
              ) : (
                <SearchSongsList
                  songs={list}
                  songClickHandler={props.addSong}
                />
              )}
            </Collapse>
          </CardContent>
        </Card>
      </Box>
    </Modal>
  );
};

const MenuDrawer = (props) => {
  const [playlistName, setPlaylistName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("public");
  const playlist = useSelector((state) => state.playlist.songUris);
  const expiresAt = useSelector((state) => state.spotify.expiresAt);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const buttonClickHandler = () => {
    if (playlistName === "") {
      setError("Enter a name!");
    } else if (playlist.length === 0) {
      setError("No Songs Selected!");
    } else {
      setError(null);
      if (expiresAt <= new Date().getTime()) {
        props.sessionExpired();
      } else {
        savePlaylist(
          playlistName,
          description,
          status === "public" ? true : false,
          playlist
        ).then((response) => {
          props.setMenuOpen(false);
          setPlaylistName("");
          setDescription("");
          setStatus("public");
          dispatch(
            SpotifyActions._playSong({
              link: { type: "playlist", id: response },
            })
          );
          dispatch(PlaylistActions.playlistSnackBar({ status: true }));
          setTimeout(() => {
            navigate("/", { replace: true });
          }, 1);
        });
      }
    }
  };

  return (
    <>
      <Drawer
        anchor={"right"}
        open={props.menuOpen}
        onClose={() => {
          props.setMenuOpen();
        }}
      >
        <Box
          sx={{
            width: {xs: "90vw", sm: "50vw"},
            display: "grid",
            placeItems: "center",
            height: "100%",
            minHeight: "40vh"
          }}
        >
          <IconButton
            onClick={() => {
              props.setMenuOpen();
            }}
            sx={{
              position: "fixed",
              top: 0,
              right: 0,
            }}
          >
            <Close />
          </IconButton>

          <Card sx={{ width: "90%", height: "90%" }}>
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",
                alignItems: "center",
                textAlign: "center",
                height: "80%",
              }}
            >
              <Typography variant="h4">Playlist Details</Typography>

              <FormControl
                component="fieldset"
                sx={{ display: "grid", placeItems: "center" }}
              >
                <TextField
                  variant="standard"
                  label="Add a name"
                  required
                  autoFocus
                  error={error !== null}
                  helperText={error || ""}
                  value={playlistName}
                  onChange={(event) => {
                    setPlaylistName(event.target.value);
                  }}
                  sx={{ display: "block", my: "20px" }}
                />

                <TextField
                  variant="standard"
                  label="Description"
                  value={description}
                  onChange={(event) => {
                    setDescription(event.target.value);
                  }}
                  sx={{ display: "block", my: "20px" }}
                />

                <Typography variant="h6">Status</Typography>

                <RadioGroup
                  row
                  defaultValue="public"
                  name="radio-buttons-group"
                >
                  <FormControlLabel
                    value="public"
                    control={<Radio />}
                    label="Public"
                    onClick={() => {
                      setStatus("public");
                    }}
                  />
                  <FormControlLabel
                    value="private"
                    control={<Radio />}
                    label="Private"
                    onClick={() => {
                      setStatus("private");
                    }}
                  />
                </RadioGroup>

                <Button
                  variant="contained"
                  sx={{ mt: "30px" }}
                  onClick={buttonClickHandler}
                >
                  Save and Play with{" "}
                  <Avatar
                    src="https://img.icons8.com/plasticine/100/000000/spotify.png"
                    alt="Spotify"
                  />
                </Button>
              </FormControl>
            </CardContent>
          </Card>
        </Box>
      </Drawer>
    </>
  );
};
