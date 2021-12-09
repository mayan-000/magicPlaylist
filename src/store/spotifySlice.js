import { createSlice } from "@reduxjs/toolkit";
import { Client } from "../../node_modules/spotify-sdk";

const spotifySlice = createSlice({
  name: "spotify",
  initialState: {
    loggedIn: false,
    accessToken: "",
    expiresAt: "",
    link: { type: null, id: null },
    playlistCreated: false,
  },
  reducers: {
    _login(state, action) {
      state.loggedIn = true;
      state.accessToken = action.payload.accessToken;
      state.expiresAt = action.payload.expiresAt;
    },
    _playSong(state, action) {
      state.link = action.payload.link;
    },
  },
});

export function login() {
  const clientId = process.env.REACT_APP_CLIENT_ID;
  const secretId = null;
  const redirect_uri = "https://magic-playlist-spotify.web.app/callback/";

  
  let client = Client.instance;

  client.settings = {
    clientId,
    secretId,
    redirect_uri,
    scopes: [
      "user-follow-modify user-follow-read playlist-modify-private playlist-read-collaborative playlist-read-private playlist-modify-public",
    ],
  };

  client.login().then((url) => {
    window.location.href = url;
  });
}

export async function searchSong(searchParam) {
  let client = Client.instance;
  let endpoint = "https://api.spotify.com/v1/search?";
  let params = new URLSearchParams({
    q: searchParam,
    type: "track",
    limit: 10,
  });

  let data = await client.fetch(endpoint + params, "GET");

  return data;
}

export async function getSimilarSongs(id, genre) {
  let client = Client.instance;
  let endpoint = "https://api.spotify.com/v1/recommendations?";
  let query;
  if(id===null){
    query = new URLSearchParams({
      seed_genres: genre,
      limit: 40,
      min_popularity: 60,
    });
  }
  else{
    query = new URLSearchParams({
      seed_tracks: id,
      limit: 39,
      min_popularity: 60,
    });
  }

  let response = await client.fetch(endpoint + query, "GET");
  response = response.tracks;

  return response;
}

export async function getSong(id) {
  let client = Client.instance;
  let endpoint = `https://api.spotify.com/v1/tracks/${id}`;

  let response = await client.fetch(endpoint, "GET");

  return response;
}

export async function savePlaylist(name, description, _public, songs) {
  let client = Client.instance;
  let endpoint = "https://api.spotify.com/v1/me";
  let response = await client.fetch(endpoint, "GET");

  let id = response.id;

  endpoint = `https://api.spotify.com/v1/users/${id}/playlists`;

  response = await client.fetch(endpoint, "POST", {
    name,
    description,
    public: _public,
  });

  id = response.id;

  endpoint = `https://api.spotify.com/v1/playlists/${id}/tracks`;

  response = await client.fetch(endpoint, "POST", { uris: songs });

  window.open(`https://open.spotify.com/playlist/${id}`, "_blank");

  return id;
}



export default spotifySlice.reducer;
export const SpotifyActions = spotifySlice.actions;
