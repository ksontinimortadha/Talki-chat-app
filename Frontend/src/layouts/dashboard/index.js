import { Stack } from "@mui/material";
import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import { useDispatch, useSelector } from "react-redux";
import { connectSocket, socket } from "../../socket";
import { SelectConversation, showSnackbar } from "../../redux/slices/app";
import { AddDirectConversation, UpdateDirectConversation } from "../../redux/slices/conversation";

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);

  const user_id = window.localStorage.getItem("user_id");

  useEffect(() => {
      // Connect to Socket.IO if socket doesn't exist
      if (!socket) {
        connectSocket(user_id);
      }

      // Event listener for new friend requests
      socket.on("new_friend_request", (data) => {
        dispatch(
          showSnackbar({
            severity: "success",
            message: data.message,
          })
        );
      });

      // Event listener for accepted friend requests
      socket.on("request_accepted", (data) => {
        dispatch(
          showSnackbar({
            severity: "success",
            message: data.message,
          })
        );
      });

      // Event listener for sent friend requests
      socket.on("request_sent", (data) => {
        dispatch(
          showSnackbar({
            severity: "success",
            message: data.message,
          })
        );
      });
      
       socket.on("start_chat", (data) => {
         console.log(data);
         // add / update to conversation list
         const existing_conversation = conversations.find(
           (el) => el?.id === data._id
         );
         if (existing_conversation) {
           // update direct conversation
           dispatch(UpdateDirectConversation({ conversation: data }));
         } else {
           // add direct conversation
           dispatch(AddDirectConversation({ conversation: data }));
         }
         dispatch(SelectConversation({ room_id: data._id }));
       });
    

    // Cleanup the event listeners when the component unmounts
    return () => {
      socket?.off("new_friend_request");
      socket?.off("request_accepted");
      socket?.off("request_sent");
      socket?.off("start_chat");
    };
  }, [isLoggedIn, user_id, dispatch, socket]);

  if (!isLoggedIn) {
    return <Navigate to={"/auth/login"} />;
  }
  return (
    <Stack direction="row">
      <SideBar />
      <Outlet />
    </Stack>
  );
};

export default DashboardLayout;
