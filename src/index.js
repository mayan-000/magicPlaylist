import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import Home from "./components/Home";
import Callback from "./components/Callback";
import reportWebVitals from "./reportWebVitals";
import store from "./store";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { Navigate, Outlet } from "react-router";
import Songs from "./components/Songs";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="similar" element={<Outlet />}>
              <Route index element={<><Navigate to="/" replace={true} /></>} />
              <Route path="songs/:id" element={<Songs />} />
            </Route>
            <Route path="callback" element={<Callback />} />
          </Route>
          <Route path="error" element={<>Nothing is here</>} />
          <Route path="*" element={<Navigate to={'error'} />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
