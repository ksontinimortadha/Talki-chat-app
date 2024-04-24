import {
  Box,
  Divider,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { DotsThreeVertical, DownloadSimple, Image } from "phosphor-react";
import React, { useEffect, useState } from "react";
import { Message_options } from "../../data";
import { socket } from "../../socket";
import { useDispatch, useSelector } from "react-redux";
import {
  FetchCurrentMessages,
  SetCurrentConversation,
} from "../../redux/slices/conversation";

const DocMsg = ({ el, menu }) => {
  const theme = useTheme();
  return (
    <Stack direction="row" justifyContent={el.incoming ? "start" : "end"}>
      <Box
        p={1.5}
        sx={{
          backgroundColor: el.incoming
            ? theme.palette.background.default
            : theme.palette.primary.main,
          borderRadius: 1.5,
          width: "max-content",
        }}
      >
        <Stack spacing={2}>
          <Stack
            p={2}
            direction="row"
            spacing={3}
            alignItems="center"
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: 1,
            }}
          >
            <Image size={48} />
            <Typography variant="caption">Abstract.png</Typography>
            <IconButton>
              <DownloadSimple />
            </IconButton>
          </Stack>
          <Typography
            variant="body2"
            color={el.incoming ? theme.palette.text : "#fff"}
          >
            {el.message}
          </Typography>
        </Stack>
      </Box>
      {menu && <MessageOption />}
    </Stack>
  );
};

const LinkMsg = ({ el, menu }) => {
  const theme = useTheme();
  return (
    <Stack direction="row" justifyContent={el.incoming ? "start" : "end"}>
      <Box
        p={1.5}
        sx={{
          backgroundColor: el.incoming
            ? theme.palette.background.default
            : theme.palette.primary.main,
          borderRadius: 1.5,
          width: "max-content",
        }}
      >
        <Stack spacing={2}>
          <Stack
            p={2}
            spacing={3}
            direction="column"
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: 1,
            }}
          >
            <img
              src={el.preview}
              alt={el.message}
              style={{ maxHeight: 210, borderRadius: "10px" }}
            />
            <Stack spacing={2}>
              <Typography
                variant="subtitle2"
                color={el.incoming ? theme.palette.text : "white"}
              >
                Creating chat app
              </Typography>
              <Typography
                variant="subtitle2"
                color={theme.palette.primary.main}
                component={Link}
                to="//https://www.youtube.com"
              >
                www.youtube.com
              </Typography>
            </Stack>
            <Typography
              variant="body2"
              color={el.incoming ? theme.palette.text : "white"}
            >
              {el.message}
            </Typography>
          </Stack>
        </Stack>
      </Box>
      {menu && <MessageOption />}
    </Stack>
  );
};

const ReplyMsg = ({ el, menu }) => {
  const theme = useTheme();
  return (
    <Stack direction="row" justifyContent={el.incoming ? "start" : "end"}>
      <Box
        p={1.5}
        sx={{
          backgroundColor: el.incoming
            ? theme.palette.background.default
            : theme.palette.primary.main,
          borderRadius: 1.5,
          width: "max-content",
        }}
      >
        <Stack spacing={2}>
          <Stack
            p={2}
            direction="column"
            spacing={3}
            alignItems={3}
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: 1,
            }}
          >
            <Typography variant="body2" color={theme.palette.text}>
              {el.message}
            </Typography>
          </Stack>
          <Typography
            variant="caption"
            color={el.incoming ? theme.palette.text : "white"}
          >
            {el.reply}
          </Typography>
        </Stack>
      </Box>
      {menu && <MessageOption />}
    </Stack>
  );
};

const MediaMsg = ({ el, menu }) => {
  const theme = useTheme();
  return (
    <Stack direction="row" justifyContent={el.incoming ? "start" : "end"}>
      <Box
        p={1.5}
        sx={{
          backgroundColor: el.incoming
            ? theme.palette.background.default
            : theme.palette.primary.main,
          borderRadius: 1.5,
          width: "max-content",
        }}
      >
        <Stack spacing={1}>
          <img
            src={el.img}
            alt={el.message}
            style={{ maxHeight: 210, borderRadius: "10px" }}
          />
          <Typography
            variant="body2"
            color={el.incoming ? theme.palette.text : "white"}
          >
            {el.message}
          </Typography>
        </Stack>
      </Box>
      {menu && <MessageOption />}
    </Stack>
  );
};

const TextMsg = ({ id, el, menu }) => {
  const theme = useTheme();

  return (
    <Stack direction="row" justifyContent={el.incoming ? "start" : "end"}>
      <Box
        p={1.5}
        sx={{
          backgroundColor: el.incoming
            ? theme.palette.background.default
            : theme.palette.primary.main,
          borderRadius: 1.5,
          width: "max-content",
        }}
      >
        <Typography
          variant="body2"
          color={el.incoming ? theme.palette.text : "white"}
        >
          {el.message}
        </Typography>
      </Box>
      {/* dots */}
      {menu && <MessageOption messageId={el.id} />}
    </Stack>
  );
};

const Timeline = ({ el }) => {
  const theme = useTheme();
  return (
    <Stack direction="row" alignItems="center" justifyContent={"space-between"}>
      <Divider width="46%" />
      <Typography variant="caption" sx={{ color: theme.palette.text }}>
        {el.text}
      </Typography>
      <Divider width="46%" />
    </Stack>
  );
};

const MessageOption = ({ messageId }) => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [setMessageDeleted] = useState(false);
  const [test, setTest] = useState(false);
  const { conversations } = useSelector(
    (state) => state.conversation.direct_chat
  );
  const { room_id } = useSelector((state) => state.app);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    const current = conversations.find((el) => el?.id === room_id);

    socket.emit("get_messages", { conversation_id: current?.id }, (data) => {
      dispatch(FetchCurrentMessages({ messages: data }));

      dispatch(SetCurrentConversation(current));
    });
  }, [test, conversations, dispatch, room_id]);

  const handleDeleteMessage = () => {
    socket.emit("delete_message", messageId, (response) => {
      if (response && response.success) {
        console.log(`Message with ID ${messageId} has been deleted`);
        setMessageDeleted(true);
      } else {
        console.error(
          `Error deleting message with ID ${messageId}:`,
          response && response.error
        );
        // Handle error, show an error message, etc.
      }
    });

    handleClose(); // Close the menu after emitting
  };

  return (
    <>
      <DotsThreeVertical
        size={20}
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      />
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <Stack spacing={1} px={1}>
          {Message_options.map((option, index) => (
            <MenuItem key={index} onClick={handleClose}>
              {option.title === "Delete Message" ? (
                <Typography
                  sx={{ cursor: "pointer", color: "#ff0000" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteMessage();
                    setTest(!test);
                  }}
                >
                  {option.title}
                </Typography>
              ) : (
                <Typography sx={{ cursor: "pointer", color: "#fff" }}>
                  {option.title}
                </Typography>
              )}
            </MenuItem>
          ))}
        </Stack>
      </Menu>
    </>
  );
};

export { Timeline, TextMsg, MediaMsg, ReplyMsg, LinkMsg, DocMsg };
