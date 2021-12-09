import { createSlice } from "@reduxjs/toolkit";

const playlistSlice = createSlice({
  name: "playlist",
  initialState: {
    songUris: [],
    playlistCreated: false
  },
  reducers: {
    addSongs(state, action) {
      state.songUris = action.payload.map((song) => song.uri);
    },
    removeSongs(state) {
      state.songUris = [];
    },
    addSong(state, action) {
      let temp = [...state.songUris.filter((uri) => uri !== action.payload.uri)];
      temp.push(action.payload.uri);
      state.songUris = [...temp]
    },
    removeSong(state, action) {
      state.songUris = [...state.songUris.filter((uri) => uri !== action.payload.uri)];
    },
    playlistSnackBar(state, action) {
      state.playlistCreated = action.payload.status;
    }
  },
});

export default playlistSlice.reducer;
export const PlaylistActions = playlistSlice.actions;

