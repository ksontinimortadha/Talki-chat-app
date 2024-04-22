import {
  Box,
  IconButton,
  Stack,
  Typography,
  InputBase,
  Button,
  Divider,
} from "@mui/material";
import {
  ArchiveBox,
  CircleDashed,
  MagnifyingGlass,
  User,
} from "phosphor-react";
import { styled, alpha, useTheme } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import ChatElement from "../../components/ChatElement";
import Friends from "../../sections/main/Friends";
import { socket } from "../../socket";
import { useDispatch, useSelector } from "react-redux";
import { FetchDirectConversations } from "../../redux/slices/conversation";
import useResponsive from "../../hooks/useResponsive";
import Sidebar from "../../layouts/dashboard/SideBar";
import BottomNav from "../../layouts/dashboard/BottomNav";

const user_id = window.localStorage.getItem("user_id");

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: 20,
  backgroundColor: alpha(theme.palette.background.paper, 1),
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: "100%",
  },
}));

const Chats = () => {
  const isDesktop = useResponsive("up", "md");
  const [OpenDialog, setOpenDialog] = useState(false);
  const theme = useTheme();
  const dispatch = useDispatch();

  const { conversations } = useSelector(
    (state) => state.conversation.direct_chat
  );

  useEffect(() => {
    socket.emit("get_direct_conversations", { user_id }, (data) => {
      dispatch(FetchDirectConversations({ conversations: data }));
    });
  }, [dispatch]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <Box
        sx={{
          position: "relative",
          width: isDesktop ? 320 : "100vw",
          backgroundColor:
            theme.palette.mode === "light"
              ? "#f8faff"
              : theme.palette.background.default,
          boxShadow: "0px 0px 2px rgba(0,0,0,0.25)",
        }}
      >
        {!isDesktop && (
          // SideBar
          <BottomNav />
        )}
        <Stack p={3} spacing={2} sx={{ height: "100vh" }}>
          <Stack
            direction="row"
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography variant="h5">Chats</Typography>
            <Stack direction={"row"} alignItems={"center"} spacing={1}>
              <IconButton
                onClick={() => {
                  handleOpenDialog();
                }}
              >
                <User />
              </IconButton>
            </Stack>
          </Stack>
          <Stack sx={{ width: "100%" }}>
            <Search>
              <SearchIconWrapper>
                <MagnifyingGlass color="#709ce6" />
              </SearchIconWrapper>
              <StyledInputBase placeholder="Search..." />
            </Search>
          </Stack>
          <Stack spacing={1}>
            <Stack direction="row" alignItems={"center"} spacing={1.5}>
              <ArchiveBox size={24} />
              <Button>Archive</Button>
            </Stack>
            <Divider />
          </Stack>
          <Stack
            direction="column"
            sx={{ flexGrow: 1, overflowY: "scroll", height: "100%" }}
          >
            <Stack spacing={2.5}>
              {/* All Chat List */}
              <Typography variant="subtitle2" sx={{ color: "#676667" }}>
                All Chats
              </Typography>
              {conversations
                .filter((el) => !el.pinned)
                .map((el, idx) => {
                  return <ChatElement key={el.id} {...el} />;
                })}
            </Stack>
          </Stack>
        </Stack>
      </Box>
      {OpenDialog && (
        <Friends open={OpenDialog} handleClose={handleCloseDialog} />
      )}
    </>
  );
};

export default Chats;
