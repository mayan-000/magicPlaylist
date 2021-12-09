import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { Client } from "../../node_modules/spotify-sdk";
import { SpotifyActions } from "../store/spotifySlice";

const Callback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    let client = Client.instance;

    if (window.location.hash.search("#") !== -1) {
      client.token = window.location.hash.split("&")[0].split("=")[1];

      dispatch(
        SpotifyActions._login({
          accessToken: client.token,
          expiresAt: new Date().getTime() + 3600 * 1000,
        })
      );
    }

    navigate("../", { replace: true });
  }, [navigate, dispatch]);

  return <></>;
};

export default Callback;
