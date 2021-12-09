import React, { useEffect, useState } from "react";
import {
  CardContent,
  Box,
  Typography,
  TextField,
  Collapse,
  CardMedia,
  Divider,
  ImageList,
} from "@mui/material";
import { useSelector } from "react-redux";
import { login, searchSong } from "../store/spotifySlice";
import { useNavigate } from "react-router";
import SkeletonLoading from "./UI/SkeletonLoading";
import SearchSongsList from "./UI/SearchSongsList";
import SnackBar from "./UI/SnackBar";
import Image from "./UI/Image";

function SearchArea() {
  const [searchParam, setSearchParam] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [similarToSearch, setSimilarToSearch] = useState(null);
  const loggedIn = useSelector((state) => state.spotify.loggedIn);
  const expiresAt = useSelector((state) => state.spotify.expiresAt);
  const navigate = useNavigate();

  // send http to get songs
  useEffect(() => {
    let search = setTimeout(() => {
      if (searchParam === "") {
        setLoading(false);
        setSimilarToSearch(null);
      } else {
        setLoading(true);
        if (expiresAt <= new Date().getTime()) {
          setSnackBarOpen(true);
          setTimeout(() => {
            login();
            setSnackBarOpen(false);
          }, 2000);
        } else {
          searchSong(searchParam)
            .then((data) => {
              setSimilarToSearch(null);
              setSimilarToSearch(data.tracks.items);
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
  }, [searchParam, expiresAt]);

  const songClickNavigate = (song) => {
    navigate(`../similar/songs/${song.id}`);
  };

  const genreImageClickHandler = (element) => {
    navigate(`../similar/songs/genre-${element.title}`);
  };

  return (
    <>
      <SnackBar open={snackBarOpen} message={"Connecting..."} />
      <Box sx={{ width: "100%" }} raised={false}>
        <CardContent sx={{ textAlign: "center" }}>
          <Typography variant="h3" sx={{ fontWeight: "600" }}>
            Get inspired. Discover. Create.
          </Typography>
          <Typography variant="body1">
            Type your favourite song, artist and create the perfect playlist.
            Magic!
          </Typography>
          <Box
            sx={{
              mx: "auto",
              mt: "20px",
            }}
          ></Box>

          <Box
            sx={{
              mt: "20px",
              mx: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <TextField
              id="search-field"
              label={"Find Similar Songs"}
              variant="standard"
              sx={{ width: { xs: "90vw", md: "50vw" } }}
              value={searchParam}
              autoFocus={true}
              autoComplete={"off"}
              onChange={(event) => {
                setSearchParam(event.target.value);
              }}
            />

            <Collapse in={loading}>
              <Box>
                {loggedIn ? (
                  similarToSearch !== null ? (
                    <SearchSongsList
                      songs={similarToSearch}
                      songClickHandler={songClickNavigate}
                    />
                  ) : (
                    <SkeletonLoading />
                  )
                ) : (
                  <ConnectSpotify />
                )}
              </Box>
            </Collapse>
          </Box>
        </CardContent>
        <Divider />
        <CardContent sx={{ mx: "5vw", pb: 0, mt: "20px" }}>
          <Typography variant="h4" fontWeight={900} textAlign="center">
            Create by Genre/Mood
          </Typography>
        </CardContent>

        <CardContent sx={{pb: 0}}>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <ImageList cols={11} gap={2}>
              {genreList.map((element, index) => (
                <Image
                  element={{
                    url: element.img,
                    title: element.title,
                    id: element.id || null,
                  }}
                  key={index}
                  imgStyle={{
                    height: "200px",
                    width: "200px",
                  }}
                  listItemClickHandler={genreImageClickHandler}
                />
              ))}
            </ImageList>
          </Box>

          <Box sx={{ display: { xs: "block", sm: "none" } }}>
            <ImageList cols={2} gap={1}>
              {genreList.map((element, index) => (
                <Image
                  element={{
                    url: element.img,
                    title: element.title,
                    id: element.id || null,
                  }}
                  key={index}
                  imgStyle={{
                    height: "40vw",
                    width: "calc(50vw - 20px)",
                  }}
                  listItemClickHandler={genreImageClickHandler}
                />
              ))}
            </ImageList>
          </Box>

          <Typography variant="h5">Create Your Playlist 😉</Typography>
        </CardContent>
      </Box>
    </>
  );
}

const ConnectSpotify = () => {
  return (
    <>
      <Typography
        variant="h4"
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: "5px",
        }}
      >
        Connect
        <CardMedia
          component="img"
          height="50px"
          image="https://img.icons8.com/plasticine/100/000000/spotify.png"
          alt="Spotify"
        />
      </Typography>
    </>
  );
};

const genreList = [
  {
    img: "https://cdn.pixabay.com/photo/2015/05/07/11/02/guitar-756326_1280.jpg",
    title: "acoustic",
  },
  {
    img: "https://images.unsplash.com/photo-1528645602411-bbeb0d69a6de",
    title: "alternative",
  },
  {
    img: "https://images.unsplash.com/photo-1487369760466-250247fd9a04",
    title: "blues",
  },
  {
    img: "https://images.unsplash.com/photo-1534276866337-55723bdee569",
    title: "chill",
  },
  {
    img: "https://images.unsplash.com/photo-1545128485-c400e7702796",
    title: "club",
  },
  {
    img: "https://images.unsplash.com/photo-1507404684477-09c7f690976a",
    title: "country",
  },
  {
    img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7",
    title: "dance",
  },
  {
    img: "https://images.unsplash.com/photo-1484932586802-fee50c6a3172",
    title: "deep-house",
  },
  {
    img: "https://images.unsplash.com/photo-1614703555696-6ab0d28ebfef",
    title: "disco",
  },
  {
    img: "https://images.unsplash.com/photo-1512357770-d7d0cdd73321",
    title: "happy",
  },
  {
    img: "https://images.unsplash.com/photo-1601643157091-ce5c665179ab",
    title: "hip-hop",
  },
  {
    img: "https://images.unsplash.com/photo-1621276921502-c04982edd1ea",
    title: "indie",
  },
  {
    img: "https://images.unsplash.com/photo-1503853585905-d53f628e46ac",
    title: "jazz",
  },
  {
    img: "https://images.unsplash.com/photo-1473691955023-da1c49c95c78",
    title: "party",
  },
  {
    img: "https://images.unsplash.com/photo-1513883049090-d0b7439799bf",
    title: "piano",
  },
  {
    img: "https://images.unsplash.com/photo-1548778052-311f4bc2b502",
    title: "pop",
  },
  {
    img: "https://images.unsplash.com/photo-1513104487127-813ea879b8da",
    title: "r-n-b",
  },
  {
    img: "https://images.unsplash.com/photo-1483000805330-4eaf0a0d82da",
    title: "reggae",
  },
  {
    img: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee",
    title: "rock",
  },
  {
    img: "https://images.unsplash.com/photo-1522673999312-93aa76caeda6",
    title: "sad",
  },
  {
    img: "https://images.unsplash.com/photo-1461360228754-6e81c478b882",
    title: "soul",
  },
  {
    img: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61",
    title: "work-out",
  },
];

export default SearchArea;
