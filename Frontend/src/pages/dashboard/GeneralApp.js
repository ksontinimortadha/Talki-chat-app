import React, { useState } from "react";
import Chats from "./Chats";
import { Box, Link, Stack, Typography, useTheme } from "@mui/material";
import Conversation from "../../components/Conversation";
import Contact from "../../components/Contact";
import SharedMessages from "../../components/SharedMessages";
import StarredMessages from "../../components/StarredMessages";
import { useSelector } from "react-redux";
import NoChat from "../../assets/Illustration/NoChat";
import { useSearchParams } from "react-router-dom";

const GeneralApp = () => {
  const theme = useTheme();
  const { room_id, chat_type } = useSelector((state) => state.app);

  const [showContact, setShowContact] = useState(false);
  const [sidebarType, setSidebarType] = useState("CONTACT");
  const toggleContact = () => {
    setShowContact(!showContact);
  };

  const updateSidebarType = (newType) => {
    setSidebarType(newType);
  };

  return (
    <Stack direction={"row"} sx={{ width: "100%" }}>
      {/*Chats*/}
      <Chats />
      <Box
        sx={{
          height: "100%",
          width: showContact ? "calc(100vw - 740px)" : "calc(100vw - 420px)",
          backgroundColor:
            theme.palette.mode === "light"
              ? "#f0f4fa"
              : theme.palette.background.paper,
        }}
      >
        {chat_type === "individual" && room_id !== null ? (
          <Conversation toggleContact={toggleContact} />
        ) : (
          <Stack
            spacing={2}
            sx={{ height: "100%", width: "100%" }}
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
      </Box>

      {showContact &&
        (() => {
          switch (sidebarType) {
            case "CONTACT":
              return (
                <Contact
                  toggleContact={toggleContact}
                  updateSidebarType={updateSidebarType}
                />
              );

            case "STARRED":
              return <StarredMessages updateSidebarType={updateSidebarType} />;

            case "SHARED":
              return <SharedMessages updateSidebarType={updateSidebarType} />;

            default:
              break;
          }
        })()}
    </Stack>
  );
};

export default GeneralApp;
