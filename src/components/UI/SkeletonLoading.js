import { Skeleton, Stack } from "@mui/material";

export default function SkeletonLoading() {
  return (
    <Stack>
      <Skeleton
        variant="rectangular"
        width={"50vw"}
        height={"50px"}
        sx={{ mt: "2px" }}
        animation="wave"
      />
      <Skeleton
        variant="rectangular"
        width={"50vw"}
        height={"50px"}
        sx={{ mt: "2px" }}
        animation="wave"
      />
      <Skeleton
        variant="rectangular"
        width={"50vw"}
        height={"50px"}
        sx={{ mt: "2px" }}
        animation="wave"
      />
    </Stack>
  );
}
