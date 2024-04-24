import {
  Avatar,
  Box,
  Divider,
  FormControlLabel,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { Gear } from "phosphor-react";
import React, { useState } from "react";
import { Nav_Buttons, Profile_Menu } from "../../data";
import useSettings from "../../hooks/useSettings";
import AntSwitch from "../../components/AntSwitch";
import Logo from "../../assets/Images/logo.ico";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { LogoutUser } from "../../redux/slices/auth";

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

const getMenuPath = (index) => {
  switch (index) {
    case 0:
      return "/profile";
    case 1:
      return "/settings";
    case 2:
      return "/auth/login";

    default:
      break;
  }
};

const Sidebar = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(0);
  const { onToggleMode } = useSettings();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const labelText = theme.palette.mode === "light" ? "Light Mode" : "Dark Mode";
  return (
    <Box
      p={2}
      sx={{
        backgroundColor: theme.palette.background.paper,
        boxShadow: "0px 0px 2px rgba(0,0,0,0.25)",
        height: "100vh",
        width: 100,
      }}
    >
      <Stack
        direction="column"
        alignItems="center"
        justifyContent="space-between"
        sx={{ height: "100%" }}
        spacing={3}
      >
        <Stack alignItems={"center"} spacing={4}>
          <Box
            sx={{
              backgroundColor: theme.palette.primary.main,
              height: 64,
              width: 64,
              borderRadius: 1.5,
            }}
          >
            <img src={Logo} style={{ padding: "10px" }} alt="Tikichat"></img>
          </Box>
          <Stack
            sx={{ width: "max-content" }}
            direction="column"
            alignItems="center"
            spacing={3}
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
            <Divider sx={{ width: "48px" }} />
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
        </Stack>
        <Stack spacing={4} sx={{ alignItems: "center" }}>
          {/* SWITCH  */}
          <FormControlLabel
            control={
              <div>
                <Typography
                  variant="body2"
                  sx={{ textAlign: "center", margin: "2px" }}
                >
                  {labelText}
                </Typography>
                <AntSwitch
                  defaultChecked={theme.palette.mode === "light"}
                  onChange={onToggleMode}
                />
              </div>
            }
            labelPlacement="top" // This places the label on top of the switch
          />
          <Avatar
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          />
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <Stack spacing={1} px={1}>
              {Profile_Menu.map((el, idx) => (
                <MenuItem
                  key={idx}
                  onClick={() => {
                    handleClick();
                  }}
                >
                  <Stack
                    onClick={() => {
                      if (idx === 2) {
                        dispatch(LogoutUser());
                      } else {
                        navigate(getMenuPath(idx));
                      }
                    }}
                    sx={{ width: 100 }}
                    direction="row"
                    alignItems={"center"}
                    justifyContent="space-between"
                  >
                    <span>{el.title}</span>
                    {el.icon}
                  </Stack>
                </MenuItem>
              ))}
            </Stack>
          </Menu>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Sidebar;
