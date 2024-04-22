import { Stack } from "@mui/material";
import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import { useDispatch, useSelector } from "react-redux";
import { connectSocket, socket } from "../../socket";
import {
  FetchUserProfile,
  SelectConversation,
  showSnackbar,
} from "../../redux/slices/app";
import {
  AddDirectConversation,
  AddDirectMessage,
  UpdateDirectConversation,
} from "../../redux/slices/conversation";
import useResponsive from "../../hooks/useResponsive";

const DashboardLayout = () => {
  const isDesktop = useResponsive("up", "md");

  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { conversations, current_conversation } = useSelector(
    (state) => state.conversation.direct_chat
  );
  const user_id = window.localStorage.getItem("user_id");

  useEffect(() => {
    dispatch(FetchUserProfile());
  }, []);

  useEffect(() => {
    // Connect to Socket.IO if socket doesn't exist
    if (!socket) {
      connectSocket(user_id);
    }

    const handleNewFriendRequest = (data) => {
      dispatch(
        showSnackbar({
          severity: "success",
          message: data.message,
        })
      );
    };

    const handleRequestAccepted = (data) => {
      dispatch(
        showSnackbar({
          severity: "success",
          message: data.message,
        })
      );
    };

    const handleRequestSent = (data) => {
      dispatch(
        showSnackbar({
          severity: "success",
          message: data.message,
        })
      );
    };

    const handleNewMessage = (data) => {
      const message = data.message;
      console.log(current_conversation, data);
      if (current_conversation?.id === data.conversation_id) {
        dispatch(
          AddDirectMessage({
            id: message._id,
            type: "msg",
            subtype: message.type,
            message: message.text,
            incoming: message.to === user_id,
            outgoing: message.from === user_id,
          })
        );
      }
    };

    const handleStartChat = (data) => {
      console.log(data);
      const existing_conversation = conversations.find(
        (el) => el?.id === data._id
      );
      if (existing_conversation) {
        dispatch(UpdateDirectConversation({ conversation: data }));
      } else {
        dispatch(AddDirectConversation({ conversation: data }));
      }
      dispatch(SelectConversation({ room_id: data._id }));
    };

    socket.on("new_friend_request", handleNewFriendRequest);
    socket.on("request_accepted", handleRequestAccepted);
    socket.on("request_sent", handleRequestSent);
    socket.on("new_message", handleNewMessage);
    socket.on("start_chat", handleStartChat);

    return () => {
      socket.off("new_friend_request", handleNewFriendRequest);
      socket.off("request_accepted", handleRequestAccepted);
      socket.off("request_sent", handleRequestSent);
      socket.off("new_message", handleNewMessage);
      socket.off("start_chat", handleStartChat);
    };
  }, [isLoggedIn, user_id, dispatch, conversations, current_conversation]);

  if (!isLoggedIn) {
    return <Navigate to={"/auth/login"} />;
  }
  return (
    <Stack direction="row">
      {isDesktop && (
        // SideBar
        <SideBar />
      )}
      <Outlet />
    </Stack>
  );
};

export default DashboardLayout;
