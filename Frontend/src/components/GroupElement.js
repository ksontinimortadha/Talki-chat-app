import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useDispatch } from "react-redux";
import { selectGroupConversation } from "../redux/slices/app";

const GroupElement = ({ id, title, time, msg }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const backgroundColor =
    theme.palette.mode === "light" ? "#fff" : theme.palette.background.paper;

  return (
    <Box
      onClick={() => {
        dispatch(selectGroupConversation({ room_id: id }));
      }}
      sx={{
        width: "100%",
        borderRadius: 1,
        backgroundColor,
      }}
      p={2}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="subtitle2">{title}</Typography>
        <Typography sx={{ fontWeight: 600 }} variant="caption">
          {time}
        </Typography>
      </Stack>
    </Box>
  );
};

export default GroupElement;
