import {
  Avatar,
  Box,
  IconButton,
  Stack,
  Typography,
  useTheme,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Slide,
} from "@mui/material";
import {
  X,
  Phone,
  VideoCamera,
  CaretRight,
  Star,
  Bell,
  Prohibit,
  Trash,
} from "phosphor-react";
import React, { useState } from "react";
import AntSwitch from "./AntSwitch";
import { useSelector } from "react-redux";
import { socket } from "../socket";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const BlockDialog = ({ open, handleClose }) => {
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>Block this contact</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          Are you sure you want to block this Contact?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleClose}>Yes</Button>
      </DialogActions>
    </Dialog>
  );
};

const DeleteChatDialog = ({ open, handleClose }) => {
  const { current_conversation } = useSelector(
    (state) => state.conversation.direct_chat
  );
  const [conversationIdToDelete, setConversationIdToDelete] = useState(null);

  // Function to handle setting conversation ID to delete
  const handleSetConversationIdToDelete = (conversationId) => {
    setConversationIdToDelete(conversationId);
  };

  const handleDeleteChat = (conversationId) => {
    if (conversationId) {
      // Emit socket event to delete conversation
      socket.emit("delete_conversation", { conversationId });

      // Close the dialog
      handleClose();
    }
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>Delete this chat</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          Are you sure you want to delete this chat?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={() => handleDeleteChat(current_conversation.id)}
          color="primary"
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Contact = ({ toggleContact, updateSidebarType }) => {
  const theme = useTheme();
  const { current_conversation } = useSelector(
    (state) => state.conversation.direct_chat
  );

  const [openBlock, setOpenBlock] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const handleCloseBlock = () => {
    setOpenBlock(false);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };
  return (
    <Box sx={{ width: 320, height: "100vh" }}>
      <Stack sx={{ height: "100%" }}>
        {/*Header */}
        <Box
          sx={{
            boxShadow: "0px 0px 2px rgba(0,0,0,0.25)",
            width: "100%",
            backgroundColor:
              theme.palette.mode === "light"
                ? "#f8faff"
                : theme.palette.background,
          }}
        >
          <Stack
            sx={{ height: "100%", p: 2 }}
            direction="row"
            alignItems={"center"}
            justifyContent={"space-between"}
            spacing={3}
          >
            <Typography variant="subtitle2">Contact Info</Typography>
            <IconButton onClick={toggleContact}>
              <X />
            </IconButton>
          </Stack>
        </Box>
        {/* Body */}
        <Stack
          sx={{
            height: "100%",
            position: "relative",
            flexGrow: 1,
            overflow: "scroll",
          }}
          p={3}
          spacing={3}
        >
          <Stack alignItems="center" direction="row" spacing={2}>
            <Avatar alt={current_conversation?.name} />

            <Stack spacing={0.5}>
              <Typography variant="article" fontWeight={600}>
                {current_conversation?.name}
              </Typography>
            </Stack>
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent={"space-evenly"}
          >
            <Stack alignItems={"center"} spacing={1}>
              <IconButton>
                <Phone />
              </IconButton>

              <Typography variant="overline">Voice</Typography>
            </Stack>
            <Stack alignItems={"center"} spacing={1}>
              <IconButton>
                <VideoCamera />
              </IconButton>
              <Typography variant="overline">Video</Typography>
            </Stack>
          </Stack>

          {/* <Divider />
          <Stack spacing={0.5}>
            <Typography variant="article" fontWeight={600}>
              About
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {current_conversation?.about}
            </Typography>
          </Stack> */}

          <Divider />
          <Stack
            direction="row"
            alignItems="center"
            justifyContent={"space-between"}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Bell size={21} />
              <Typography variant="subtitle2">Mute Notifications</Typography>
            </Stack>

            <AntSwitch />
          </Stack>
          <Divider />
          {/*  <Typography variant="body2">1 group in common</Typography>
          <Stack direction="row" alignItems={"center"} spacing={2}>
            <Avatar src={faker.image.imageUrl()} alt={faker.name.fullName()} />
            <Stack direction="column" spacing={0.5}>
              <Typography variant="subtitle2">Camel’s Gang</Typography>
              <Typography variant="caption">
                Owl, Parrot, Rabbit , You
              </Typography>
            </Stack>
          </Stack>
          <Divider /> */}
          <Stack direction="row" alignItems={"center"} spacing={2}>
            <Button
              onClick={() => {
                setOpenBlock(true);
              }}
              fullWidth
              startIcon={<Prohibit />}
              variant="outlined"
            >
              Block
            </Button>
            <Button
              onClick={() => {
                setOpenDelete(true);
              }}
              fullWidth
              startIcon={<Trash />}
              variant="outlined"
            >
              Delete
            </Button>
          </Stack>
        </Stack>
      </Stack>
      {openBlock && (
        <BlockDialog open={openBlock} handleClose={handleCloseBlock} />
      )}
      {openDelete && (
        <DeleteChatDialog
          open={openDelete}
          handleClose={handleCloseDelete}
          conversationId
        />
      )}
    </Box>
  );
};

export default Contact;
