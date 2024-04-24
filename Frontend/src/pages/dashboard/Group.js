import {
  Box,
  IconButton,
  Stack,
  Typography,
  useTheme,
  Link,
  Divider,
} from "@mui/material";
import { MagnifyingGlass, Plus } from "phosphor-react";
import React, { useEffect, useState } from "react";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/search";
import GroupElement from "../../components/GroupElement";
import CreateGroup from "../../sections/main/CreateGroup";
import NoChat from "../../assets/Illustration/NoChat";
import { useDispatch, useSelector } from "react-redux";
import { FetchGroupConversations } from "../../redux/slices/conversation";
import { socket } from "../../socket";
import GroupConversation from "../../components/GroupConversation";
import Contact from "../../components/Contact";
import { SetRoomId } from "../../redux/slices/app";
import BottomNav from "../../layouts/dashboard/BottomNav";
import useResponsive from "../../hooks/useResponsive";
const user_id = localStorage.getItem("user_id");

const Group = () => {
  const isDesktop = useResponsive("up", "md");

  const { room_id, chat_type } = useSelector((state) => state.app);
  const [showContact, setShowContact] = useState(false);
  const [sidebarType] = useState("CONTACT");

  const toggleContact = () => {
    setShowContact(!showContact);
  };
  const theme = useTheme();
  const dispatch = useDispatch();

  const [openDialog, setOpenDialog] = useState(false);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const { group_conversations } = useSelector(
    (state) => state.conversation.group_chat
  );
  console.log("group convo", group_conversations);

  useEffect(() => {
    socket.emit("get_group_conversations", { user_id }, (data) => {
      dispatch(FetchGroupConversations({ group_conversations: data }));
    });
  }, [dispatch]);

  const toggleRoomId = (makeRoomIdNull = false) => {
    if (makeRoomIdNull) {
      dispatch(SetRoomId({ room_id: null }));
    }
  };
  return (
    <>
      <Stack direction="row" sx={{ width: "100%" }}>
        {/* Left */}
        <Box
          sx={{
            overflowY: "scroll",
            height: "100vh",
            width: 320,
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? "#F8FAFF"
                : theme.palette.background.default,
            boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
          }}
        >
          {!isDesktop && (
            // SideBar
            <BottomNav />
          )}
          <Stack p={3} spacing={2} sx={{ maxHeight: "100vh" }}>
            <Stack
              alignItems={"center"}
              justifyContent="space-between"
              direction="row"
            >
              <Typography variant="h5">Groups</Typography>
            </Stack>
            <Stack sx={{ width: "100%" }}>
              <Search>
                <SearchIconWrapper>
                  <MagnifyingGlass color="#709CE6" />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ "aria-label": "search" }}
                />
              </Search>
            </Stack>
            <Stack
              justifyContent={"space-between"}
              alignItems={"center"}
              direction={"row"}
            >
              <Typography variant="subtitle2" sx={{ color: "#3263C4" }}>
                Create New Group
              </Typography>
              <IconButton onClick={handleOpenDialog}>
                <Plus style={{ color: theme.palette.primary.main }} />
              </IconButton>
            </Stack>
            <Divider />
            <Stack
              spacing={3}
              sx={{ flexGrow: 1, overflowY: "scroll", height: "100%" }}
            >
              <Stack spacing={2.5}>
                <Typography variant="subtitle2" sx={{ color: "#676667" }}>
                  All Groups
                </Typography>
                {/*All Groups List */}
                {group_conversations.map((el, idx) => (
                  <GroupElement key={el.id} {...el} />
                ))}
              </Stack>
            </Stack>
          </Stack>
        </Box>
        {openDialog && (
          <CreateGroup open={openDialog} handleClose={handleCloseDialog} />
        )}
        {/* Right */}
        {chat_type === "group" && room_id !== null ? (
          <GroupConversation
            toggleContact={toggleContact}
            toggleRoomId={toggleRoomId}
          />
        ) : (
          <Stack
            spacing={2}
            sx={{
              height: "100%",
              width: "100%",
              backgroundColor:
                theme.palette.mode === "light"
                  ? "#f8faff"
                  : theme.palette.background.paper,
            }}
            alignItems="center"
            justifyContent={"center"}
          >
            <NoChat />
            <Typography variant="subtitle2">
              Select a conversation or start a{" "}
              <Link
                style={{
                  color: theme.palette.primary.main,
                  textDecoration: "none",
                }}
                to="/"
              >
                new one
              </Link>
            </Typography>
          </Stack>
        )}
        {showContact &&
          (() => {
            switch (sidebarType) {
              case "CONTACT":
                return <Contact toggleContact={toggleContact} />;

              default:
                break;
            }
          })()}
      </Stack>
    </>
  );
};

export default Group;
