import { faker } from "@faker-js/faker";
import { createSlice } from "@reduxjs/toolkit";

const user_id = window.localStorage.getItem("user_id");

const initialState = {
  direct_chat: {
    conversations: [],
    current_conversation: null,
    current_messages: [],
  },
  group_chat: {
    group_conversations: [],
    current_conversation: null,
    current_messages: [],
  },
};

const slice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    //direct_chat
    fetchDirectConversations(state, action) {
      const list = action.payload.conversations.map((el) => {
        const user = el.participants.find(
          (elm) => elm._id.toString() !== user_id
        );
        return {
          id: el._id,
          user_id: user?._id,
          name: `${user?.firstName} ${user?.lastName}`,
          online: user?.status === "Online",
          img: faker.image.avatar(),
          msg: el.messages,
          time: "9:36",
          unread: 0,
          pinned: false,
          about: user?.about,
        };
      });

      state.direct_chat.conversations = list;
    },
    updateDirectConversation(state, action) {
      const this_conversation = action.payload.conversation;
      state.direct_chat.conversations = state.direct_chat.conversations.map(
        (el) => {
          if (el?.id !== this_conversation._id) {
            return el;
          } else {
            const user = this_conversation.participants.find(
              (elm) => elm._id.toString() !== user_id
            );
            return {
              id: this_conversation._id._id,
              user_id: user?._id,
              name: `${user?.firstName} ${user?.lastName}`,
              online: user?.status === "Online",
              img: faker.image.avatar(),
              msg: faker.music.songName(),
              time: "9:36",
              unread: 0,
              pinned: false,
            };
          }
        }
      );
    },
    addDirectConversation(state, action) {
      const this_conversation = action.payload.conversation;
      const user = this_conversation.participants.find(
        (elm) => elm._id.toString() !== user_id
      );
      state.direct_chat.conversations = state.direct_chat.conversations.filter(
        (el) => el?.id !== this_conversation._id
      );
      state.direct_chat.conversations.push({
        id: this_conversation._id._id,
        user_id: user?._id,
        name: `${user?.firstName} ${user?.lastName}`,
        online: user?.status === "Online",
        img: faker.image.avatar(),
        msg: faker.music.songName(),
        time: "9:36",
        unread: 0,
        pinned: false,
      });
    },
    setCurrentConversation(state, action) {
      state.direct_chat.current_conversation = action.payload;
    },
    fetchCurrentMessages(state, action) {
      const messages = action.payload.messages;

      // Check if messages is an array before mapping
      if (!Array.isArray(messages)) {
        console.error("Messages is not an array:", messages);
        return;
      }

      const formatted_messages = messages.map((el) => ({
        id: el._id,
        type: "msg",
        subtype: el.type,
        message: el.text,
        incoming: el.to === user_id,
        outgoing: el.from === user_id,
      }));

      state.direct_chat.current_messages = formatted_messages;
    },
    addDirectMessage(state, action) {
      state.direct_chat.current_messages.push(action.payload.message);
    },

    //group_chat
    fetchGroupConversations(state, action) {
      const list = action.payload.group_conversations.map((el) => {
        return {
          id: el._id,
          title: el.title,
          msg:el.text,
          time: "",
          unread: 0,
          pinned: false,
        };
      });

      state.group_chat.group_conversations = list;
    },

    updateGroupConversation(state, action) {
      const this_conversation = action.payload.conversation;
      state.group_chat.conversations = state.group_chat.conversations.map(
        (group) => {
          if (group.id !== this_conversation._id) {
            return group;
          } else {
            return {
              ...group,
              msg: faker.music.songName(),
              time: "9:36",
            };
          }
        }
      );
    },

    addGroupConversation(state, action) {
      const this_conversation = action.payload.conversation;
      state.group_chat.conversations.push({
        id: this_conversation._id,
        name: this_conversation.title,
        img: this_conversation.image,
        msg: faker.music.songName(),
        time: "9:36",
        unread: 0,
        pinned: false,
      });
    },

    setCurrentGroupConversation(state, action) {
      state.group_chat.current_conversation = action.payload;
    },

    fetchCurrentGroupMessages(state, action) {
      const messages = action.payload.messages;

      // Check if messages is an array before mapping
      if (!Array.isArray(messages)) {
        console.error("Messages is not an array:", messages);
        return;
      }

      const formatted_messages = messages.map((el) => ({
        id: el._id,
        type: "msg",
        subtype: el.type,
        message: el.text,
        incoming: el.to === user_id,
        outgoing: el.from === user_id,
      }));

      state.group_chat.current_messages = formatted_messages;
    },

    addGroupMessage(state, action) {
      state.group_chat.current_messages.push(action.payload.message);
    },
  },
});

export default slice.reducer;

export const FetchDirectConversations = ({ conversations }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.fetchDirectConversations({ conversations }));
  };
};

export const AddDirectConversation = ({ conversation }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.addDirectConversation({ conversation }));
  };
};
export const UpdateDirectConversation = ({ conversation }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateDirectConversation({ conversation }));
  };
};

export const SetCurrentConversation = (current_conversation) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.setCurrentConversation(current_conversation));
  };
};

export const FetchCurrentMessages = (messages) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.fetchCurrentMessages(messages));
  };
};

export const AddDirectMessage = (message) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.addDirectMessage(message));
  };
};

//group_chat
export const FetchGroupConversations = ({ group_conversations }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.fetchGroupConversations({ group_conversations }));
  };
};

export const AddGroupConversation = ({ conversation }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.addGroupConversation({ conversation }));
  };
};

export const UpdateGroupConversation = ({ conversation }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateGroupConversation({ conversation }));
  };
};

export const SetCurrentGroupConversation = (currentConversation) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.setCurrentGroupConversation(currentConversation));
  };
};

export const FetchGroupMessages = (messages) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.fetchCurrentGroupMessages(messages));
  };
};

export const AddGroupMessage = (message) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.addGroupMessage(message));
  };
};
