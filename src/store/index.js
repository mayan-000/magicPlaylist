import { configureStore } from "@reduxjs/toolkit";
import playlistSlice from "./playlistSlice";
import spotifySlice from "./spotifySlice";

const store = configureStore({
  reducer : {
    spotify: spotifySlice,
    playlist: playlistSlice
  }
})

export default store;