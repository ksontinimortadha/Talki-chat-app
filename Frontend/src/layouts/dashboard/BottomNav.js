import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { Box, Divider, IconButton, Stack } from "@mui/material";
import { Nav_Buttons } from "../../data";
import { useNavigate } from "react-router-dom";
import { Gear } from "phosphor-react";

const getPath = (index) => {
  switch (index) {
    case 0:
      return "/app";

    case 1:
      return "/group";

    case 2:
      return "/settings";

    default:
      break;
  }
};
const BottomNav = () => {
  const theme = useTheme();

    const navigate = useNavigate();
    const [selected, setSelected] = useState(0);

  return (
    <Box
      sx={{
        zIndex: 10,
        position: "absolute",
        bottom: 0,
        width: "100vw",

        backgroundColor: theme.palette.background.paper,
        boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
      }}
    >
      <Stack
        sx={{ width: "100%" }}
        direction="row"
        alignItems={"center"}
        justifyContent="space-between"
        spacing={2}
        p={2}
      >
        {Nav_Buttons.map((el, i) =>
          el.index === selected ? (
            <Box
              key={i}
              p={1}
              sx={{
                backgroundColor: theme.palette.primary.main,
                borderRadius: 1.5,
              }}
            >
              <IconButton
                sx={{ width: "max-content", color: "white" }}
                key={el.index}
              >
                {el.icon}
              </IconButton>
            </Box>
          ) : (
            <IconButton
              onClick={() => {
                setSelected(el.index);
                navigate(getPath(el.index));
              }}
              sx={{
                width: "max-content",
                color:
                  theme.palette.mode === "light"
                    ? "black"
                    : theme.palette.text.primary,
              }}
              key={el.index}
            >
              {el.icon}
            </IconButton>
          )
        )}
        <Divider
          orientation="vertical"
          variant="middle"
          flexItem
          sx={{ width: "48px" }}
        />
        {selected === 2 ? (
          <Box
            p={1}
            sx={{
              backgroundColor: theme.palette.primary.main,
              borderRadius: 1.5,
            }}
          >
            <IconButton sx={{ width: "max-content", color: "white" }}>
              <Gear />
            </IconButton>
          </Box>
        ) : (
          <IconButton
            sx={{
              width: "max-content",
              color:
                theme.palette.mode === "light"
                  ? "black"
                  : theme.palette.text.primary,
            }}
            onClick={() => {
              setSelected(2);
              navigate(getPath(2));
            }}
          >
            <Gear />
          </IconButton>
        )}
      </Stack>
    </Box>
  );
};

export default BottomNav;
