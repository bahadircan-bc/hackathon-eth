import React from "react";
import ReactDOM from "react-dom/client";
import LandingPage from "./components/LandingPage";
import StakerPage from "./components/StakerPage";
import Root from "./components/Root.jsx";
import "./App.css";

import {
  BrowserRouter,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Router,
} from "react-router-dom";

// We import bootstrap here, but you can remove if you want
import "bootstrap/dist/css/bootstrap.css";

// This is the entry point of your application, but it just renders the Dapp
// react component. All of the logic is contained in it.

const root = ReactDOM.createRoot(document.getElementById("root"));

const router = createBrowserRouter(
  createRoutesFromElements([
    <Route path="/" element={<Root />}>
      <Route path="/" element={<LandingPage />} />,
      <Route path="/staker" element={<StakerPage />} />,
    </Route>,
  ])
);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
