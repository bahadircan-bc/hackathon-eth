import React from "react";
import ReactDOM from "react-dom/client";
import LandingPage from "./components/LandingPage";
import StakerPage from "./components/StakerPage";
import Root from "./components/Root.jsx";
import PlinkoPage from "./components/PlinkoPage.jsx";
import "./App.css";

// import { MetaMaskProvider } from "@metamask/sdk-react";
import { MetaMaskUIProvider } from "@metamask/sdk-react-ui";

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
      <Route path="/plinko" element={<PlinkoPage />} />,
    </Route>,
  ])
);

root.render(
  // <React.StrictMode>
    <MetaMaskUIProvider
      debug={false}
      sdkOptions={{
        checkInstallationImmediately: false,
        dappMetadata: {
          name: "Demo React App",
          url: window.location.host,
        },
        extensionOnly: true,
      }}
    >
      <RouterProvider router={router} />
    </MetaMaskUIProvider>
  // </React.StrictMode>
);
