import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useDispatch } from "react-redux";
import { SelectConversation } from "../redux/slices/app";

const ChatElement = ({ id, name, img, msg, time, unread, online }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  /*   const { room_id } = useSelector((state) => state.app); */
  /*   const selectedChatId = room_id?.toString();

    let isSelected = +selectedChatId === id;

    if (!selectedChatId) {
      isSelected = false;
    } */

  // Convert msg to string if it's not already
  /*   const messageText = typeof msg === "string" ? msg : ""; */
  return (
    <Box
      onClick={() => {
        dispatch(SelectConversation({ room_id: id }));
      }}
      sx={{
        width: "100%",
        borderRadius: 1,
        backgroundColor:
          theme.palette.mode === "light"
            ? "#fff"
            : theme.palette.background.paper,
      }}
      p={2}
    >
      <Stack
        direction="row"
        alignItems={"center"}
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={2}>
          <Stack spacing={0.3}>
            <Typography variant="subtitle2">{name}</Typography>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ChatElement;
