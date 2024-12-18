import React, { useEffect, useState } from "react";
import {
  Box,
  Badge,
  Stack,
  Avatar,
  Typography,
  IconButton,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { Chat, Spinner, UserCircleMinus, UserCirclePlus } from "phosphor-react";
import { socket } from "../socket";
const user_id = localStorage.getItem("user_id");

const StyledChatBox = styled(Box)(({ theme }) => ({
  "&:hover": {
    cursor: "pointer",
  },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const UserElement = ({ img, firstName, lastName, online, _id }) => {
  const theme = useTheme();
  const name = `${firstName} ${lastName}`;
  const [iconClicked, setIconClicked] = useState(false);

  useEffect(() => {
    // Retrieve iconClicked value from localStorage on component mount
    const storedIconClicked = localStorage.getItem(`iconClicked_${_id}`);
    if (storedIconClicked) {
      setIconClicked(JSON.parse(storedIconClicked));
    }
  }, [_id]);

  const handleSendRequest = () => {
    if (!socket) {
      console.error("Socket is not initialized");
      return;
    }

    socket.emit("friend_request", { to: _id, from: user_id });
    setIconClicked(true);
    localStorage.setItem(`iconClicked_${_id}`, JSON.stringify(true)); // Store iconClicked value in localStorage
  };

  return (
    <StyledChatBox
      sx={{
        width: "100%",
        borderRadius: 1,
        backgroundColor: theme.palette.background.paper,
      }}
      p={2}
    >
      <Stack
        direction="row"
        alignItems={"center"}
        justifyContent="space-between"
      >
        <Stack direction="row" alignItems={"center"} spacing={2}>
          {online ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar alt={name} src={img} />
            </StyledBadge>
          ) : (
            <Avatar alt={name} src={img} />
          )}
          <Stack spacing={0.3}>
            <Typography variant="subtitle2">{name}</Typography>
          </Stack>
        </Stack>
        <Stack direction={"row"} spacing={2} alignItems={"center"}>
          <IconButton onClick={handleSendRequest}>
            {iconClicked ? <Spinner /> : <UserCirclePlus />}
          </IconButton>
        </Stack>
      </Stack>
    </StyledChatBox>
  );
};


const FriendRequestElement = ({ img, firstName, lastName, online, id }) => {
  const theme = useTheme();
  const name = `${firstName} ${lastName}`;

  return (
    <StyledChatBox
      sx={{
        width: "100%",
        borderRadius: 1,
        backgroundColor: theme.palette.background.paper,
      }}
      p={2}
    >
      <Stack
        direction="row"
        alignItems={"center"}
        justifyContent="space-between"
      >
        <Stack direction="row" alignItems={"center"} spacing={2}>
          {online ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar alt={name} src={img} />
            </StyledBadge>
          ) : (
            <Avatar alt={name} src={img} />
          )}
          <Stack spacing={0.3}>
            <Typography variant="subtitle2">{name}</Typography>
          </Stack>
        </Stack>
        <Stack direction={"row"} spacing={2} alignItems={"center"}>
          <IconButton
            onClick={() => {
              socket.emit("accept_request", { request_id: id });
            }}
          >
            <UserCirclePlus />
          </IconButton>
          <IconButton
            onClick={() => {
              socket.emit("refuse_request", { request_id: id });
            }}
          >
            <UserCircleMinus />
          </IconButton>
        </Stack>
      </Stack>
    </StyledChatBox>
  );
};

// FriendElement
const FriendElement = ({ img, firstName, lastName, online, _id }) => {
  const theme = useTheme();
  const name = `${firstName} ${lastName}`;

  return (
    <StyledChatBox
      sx={{
        width: "100%",
        borderRadius: 1,
        backgroundColor: theme.palette.background.paper,
      }}
      p={2}
    >
      <Stack
        direction="row"
        alignItems={"center"}
        justifyContent="space-between"
      >
        <Stack direction="row" alignItems={"center"} spacing={2}>
          {" "}
          {online ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar alt={name} src={img} />
            </StyledBadge>
          ) : (
            <Avatar alt={name} src={img} />
          )}
          <Stack spacing={0.3}>
            <Typography variant="subtitle2">{name}</Typography>
          </Stack>
        </Stack>
        <Stack direction={"row"} spacing={2} alignItems={"center"}>
          <IconButton
            onClick={() => {
              // start a new conversation
              socket.emit("start_conversation", {
                to: _id,
                from: user_id,
              });
            }}
          >
            <Chat />
          </IconButton>
          <IconButton
            onClick={() => {
              // start a new conversation
              socket.emit("delete_friend", {
                sender_id: user_id, // Correct sender_id
                receiver_id: _id,
              });
            }}
          >
            {" "}
            <UserCircleMinus />
          </IconButton>
        </Stack>
      </Stack>
    </StyledChatBox>
  );
};

export { UserElement, FriendRequestElement, FriendElement };
