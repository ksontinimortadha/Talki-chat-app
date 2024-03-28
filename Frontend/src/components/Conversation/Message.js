import { Box, Stack } from "@mui/material";
import React, { useEffect } from "react";
import {
  DocMsg,
  LinkMsg,
  MediaMsg,
  ReplyMsg,
  TextMsg,
  Timeline,
} from "./MsgTypes";
import { useDispatch, useSelector } from "react-redux";
import {
  FetchCurrentMessages,
  SetCurrentConversation,
} from "../../redux/slices/conversation";
import { socket } from "../../socket";

const Message = (menu) => {
  const dispatch = useDispatch();

  const { conversations, current_messages } = useSelector(
    (state) => state.conversation.direct_chat
  );
  const { room_id } = useSelector((state) => state.app);

  useEffect(() => {
    const current = conversations.find((el) => el?.id === room_id);

    socket.emit("get_messages", { conversation_id: current?.id }, (data) => {
      dispatch(FetchCurrentMessages({ messages: data }));
    });

    dispatch(SetCurrentConversation(current));
  }, []);
  return (
    <>
      <Box p={3}>
        <Stack spacing={3}>
          {current_messages.map((el, i) => {
            switch (el.type) {
              case "divider":
                // Timeline
                return <Timeline key={i} el={el} />;
              case "msg":
                switch (el.subtype) {
                  case "img":
                    // img msg
                    return <MediaMsg key={i} el={el} menu={menu} />;
                  case "doc":
                    // doc msg
                    return <DocMsg key={i} el={el} menu={menu} />;
                  case "link":
                    // link msg
                    return <LinkMsg key={i} el={el} menu={menu} />;
                  case "reply":
                    // reply msg
                    return <ReplyMsg key={i} el={el} menu={menu} />;

                  default:
                    // text msg
                    return <TextMsg key={i} el={el} menu={menu} />;
                }

              default:
                return <></>;
            }
          })}
        </Stack>
      </Box>
    </>
  );
};

export default Message;
