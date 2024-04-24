import {
  Avatar,
  Box,
  Stack,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import React from "react";
import { useTheme } from "@mui/material/styles";
import { CaretDown, MagnifyingGlass, Phone, VideoCamera } from "phosphor-react";
import StyledBadge from "../StyledBadge";
import { useSelector } from "react-redux";


const Header = ({ toggleContact, toggleRoomId }) => {
  const theme = useTheme();
  const { current_conversations } = useSelector(
    (state) => state.conversation.group_chat
  );

  console.log("group convo", current_conversations);
  return (
    <Box
      p={2}
      sx={{
        height: 100,
        width: "100%",
        backgroundColor:
          theme.palette.mode === "light"
            ? "#f8faff"
            : theme.palette.background.default,
        boxShadow: "0px 0px 2px rgba(0,0,0,0.25)",
      }}
    >
      <Stack
        alignItems={"center"}
        direction={"row"}
        justifyContent={"space-between"}
        sx={{ width: "100%", height: "100%" }}
      >
        <Stack direction={"row"} spacing={2}>
          <Box onClick={toggleContact}>
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar alt={current_conversations?.title} />
            </StyledBadge>
          </Box>
          <Stack spacing={0.2}>
            <Typography variant="subtitle2">
              {current_conversations?.title}
            </Typography>
            <Typography variant="caption">Online</Typography>
          </Stack>
        </Stack>
        <Stack direction="row" alignItems={"center"} spacing={3}>
          <IconButton>
            <VideoCamera />
          </IconButton>
          <IconButton>
            <Phone />
          </IconButton>
          <IconButton>
            <MagnifyingGlass />
          </IconButton>
          <Divider orientation="vertical" flexItem />
          <IconButton>
            <CaretDown onClick={() => toggleRoomId(true)} />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Header;
