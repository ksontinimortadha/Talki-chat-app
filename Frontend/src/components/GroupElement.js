import { Badge, Box, Stack, Typography, useTheme, styled } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { SelectConversation, selectGroupConversation } from "../redux/slices/app";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const GroupElement = ({ id, title, time }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { room_id } = useSelector((state) => state.app);
  const selectedChatId = room_id?.toString();

  const isSelected = selectedChatId && +selectedChatId === id;

  const backgroundColor =
    theme.palette.mode === "light" ? "#fff" : theme.palette.background.paper;
  const messageText = typeof msg === "string" ? msg : "";

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
