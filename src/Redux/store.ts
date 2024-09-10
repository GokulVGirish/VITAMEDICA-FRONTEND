import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import userReducer from "./userSlice";
import adminReducer from "./adminSlice";
import doctorReducer from "./doctorSlice";
import { setDispatch } from "../Axios/userInstance";

import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { setDoctorDispatchFunction } from "../Axios/doctorInstance";

const rootReducer = combineReducers({
  user: userReducer,
  admin: adminReducer,
  doctor: doctorReducer,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
setDispatch(store.dispatch);

setDoctorDispatchFunction(store.dispatch)

export const persistor = persistStore(store);

export default store;


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
