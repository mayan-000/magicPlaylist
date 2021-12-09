import { Avatar, IconButton, Snackbar } from "@mui/material";

export default function SnackBar(props){
  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      sx={{mb: "80px"}}
      open={props.open}
      autoHideDuration={props.time || 2000}
      message={props.message}
      action={
        <IconButton aria-label="close" color="inherit" sx={{ p: 0.5 }}>
          <Avatar
            src="https://img.icons8.com/plasticine/100/000000/spotify.png"
            alt="Spotify"
          />
        </IconButton>
      }
    />
  );
};