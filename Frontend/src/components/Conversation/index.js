import React, { useEffect, useRef } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Box, Stack, useTheme } from "@mui/material";
import Message from "./Message";
import { useSelector } from "react-redux";

const Conversation = ({ toggleContact }) => {
  const theme = useTheme();
  const { current_messages } = useSelector(
    (state) => state.conversation.direct_chat
  );
  const messageListRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom of the message list when new messages are added
    messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
  }, [current_messages]);
  
  return (
    <Stack height={"100%"} maxHeight={"100vh"} width={"auto"}>
      {/*Chat header*/}
      <Header toggleContact={toggleContact} />
      {/*msg*/}
      <Box
        ref={messageListRef}
        width={"100%"}
        sx={{
          flexGrow: 1,
          height: "100%",
          overflow: "scroll",
          backgroundColor:
            theme.palette.mode === "light"
              ? "#F0F4FA"
              : theme.palette.background,
          boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
        }}
      >
        <Message menu={true} />
      </Box>
      {/*Chat footer*/}
      <Footer />
    </Stack>
  );
};

export default Conversation;
