import "./full-alpha.css";
import React from "react";
import ReactDOM from "react-dom/client";
import {App} from "./App.tsx";
import "./tokens.css";
import "./styles.css";
import "./guided-workflow.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode><App/></React.StrictMode>
);
