import {
  Avatar,
  Box,
  Divider,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { Keyboard, PencilCircle } from "phosphor-react";
import React, { useEffect, useState } from "react";
import Shortcuts from "../../sections/settings/Shortcuts";
import ThemeDialog from "../../sections/settings/ThemeDialog";
import { FetchUserProfile } from "../../redux/slices/app";
import { useDispatch, useSelector } from "react-redux";

const Settings = () => {
  const theme = useTheme();

  const [openShortcuts, setOpenShortcuts] = useState(false);
  const handleOpenShortcuts = () => {
    setOpenShortcuts(true);
  };

  const handleCloseShortcuts = () => {
    setOpenShortcuts(false);
  };
  const [openTheme, setOpenTheme] = useState(false);

  const handleOpenTheme = () => {
    setOpenTheme(true);
  };

  const handleCloseTheme = () => {
    setOpenTheme(false);
  };
  const list = [
    {
      key: 3,
      icon: <PencilCircle size={20} />,
      title: "Theme",
      onclick: handleOpenTheme,
    },
    {
      key: 6,
      icon: <Keyboard size={20} />,
      title: "Keyboard Shortcuts",
      onclick: handleOpenShortcuts,
    },
  ];
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(FetchUserProfile());
  }, [dispatch]);
  const { user } = useSelector((state) => state.app);

  return (
    <>
      <Stack direction={"row"} sx={{ width: "100%" }}>
        {/*left panel */}
        <Box
          sx={{
            overflowY: "scroll",
            height: "100vh",
            width: 320,
            backgroundColor:
              theme.palette.mode === "light"
                ? "#f8faff"
                : theme.palette.background,
            boxShadow: "0px 0px 2px (0,0,0,0.25)",
          }}
        >
          <Stack p={4} spacing={5}>
            {/*header */}
            <Stack direction={"row"} alignItems={"center"} spacing={3}>
              <Typography variant="h6">Settings</Typography>
            </Stack>
            {/*profile */}
            <Stack direction={"row"} spacing={3}>
              <Avatar
                sx={{ width: 56, height: 56 }}
                src={user.img}
                alt={user.firstName}
              />
              <Stack spacing={0}>
                <Typography variant="article">
                  {user.firstName} {user.lastName}
                </Typography>
                {/* <Typography variant="body2">{faker.random.words()}</Typography> */}
              </Stack>
            </Stack>
            {/*list of options */}
            <Stack spacing={4}>
              {list.map(({ key, icon, title, onclick }) => (
                <>
                  <Stack
                    spacing={2}
                    sx={{ cursor: "pointer" }}
                    onClick={onclick}
                  >
                    <Stack direction={"row"} spacing={2} alignItems={"center"}>
                      {icon}
                      <Typography variant="body2"> {title} </Typography>
                    </Stack>
                    {key !== 7 && <Divider />}
                  </Stack>
                </>
              ))}
            </Stack>
          </Stack>
        </Box>
        {/*right panel */}
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
        >
          {openTheme && (
            <ThemeDialog open={openTheme} handleClose={handleCloseTheme} />
          )}
          {openShortcuts && (
            <Shortcuts
              open={openShortcuts}
              handleClose={handleCloseShortcuts}
            />
          )}
        </Box>
      </Stack>
    </>
  );
};

export default Settings;
