import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";
// slices
import appReducer from "./slices/app";
import authReducer from "./slices/auth";
import conversationReducer from "./slices/conversation";
import audioCallReducer from "./slices/audiocall";

// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: "root",
  storage,
  keyPrefix: "redux-",
  //   whitelist: [],
  //   blacklist: [],
};

const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  audioCall: audioCallReducer,
  conversation: conversationReducer,
});

export { rootPersistConfig, rootReducer };
