import { Box, Stack, Typography } from "@mui/material";
import React, { useEffect } from "react";
import ProfileForm from "../../sections/settings/ProfileForm";
import { useDispatch } from "react-redux";
import { FetchUserProfile } from "../../redux/slices/app";

const Profile = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(FetchUserProfile());
  }, [dispatch]);
  return (
    <>
      <Stack direction="row" sx={{ width: "100%" }}>
        <Box
          sx={{
            overflowY: "scroll",
            height: "100vh",
            width: 320,
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? "#F8FAFF"
                : theme.palette.background,
            boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
          }}
        >
          <Stack p={4} spacing={5}>
            {/* Header */}
            <Stack direction="row" alignItems={"center"} spacing={3}>
              <Typography variant="h5">Profile</Typography>
            </Stack>
            {/* Profile Edit Form */}
            <ProfileForm />
          </Stack>
        </Box>
        {/* Right Panel */}
        <Box
          sx={{
            height: "100%",
            width: "calc(100vw - 420px )",
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? "#FFF"
                : theme.palette.background.paper,
            borderBottom: "6px solid #0162C4",
          }}
        ></Box>
      </Stack>
    </>
  );
};

export default Profile;
