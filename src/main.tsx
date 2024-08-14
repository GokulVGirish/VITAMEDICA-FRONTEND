import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import store,{persistor} from "./Redux/store.ts";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { PersistGate } from "redux-persist/integration/react";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <PersistGate persistor={persistor}>
    <Provider store={store}>
      <GoogleOAuthProvider clientId="1049570365665-mbfdl3eh0p1ivdn1m36fot59jqphq52e.apps.googleusercontent.com">
     
          <App />
      
      </GoogleOAuthProvider>
    </Provider>
  </PersistGate>
);
