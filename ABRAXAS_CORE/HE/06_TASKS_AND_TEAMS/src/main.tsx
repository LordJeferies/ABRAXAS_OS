import React from "react";
import ReactDOM from "react-dom/client";
import {HeOperationsService} from "../runtime/index.ts";
import {LocalStorageOperationsStore} from "../runtime/store.ts";
import {HeProvider, HeProductShell} from "../ui/index.ts";
import "../ui/he.css";

// In-browser composition root with durable local storage persistence
const store = new LocalStorageOperationsStore();
let idCounter = 1;
const service = new HeOperationsService(store, () => new Date().toISOString(), (p) => `${p}_${Date.now()}_${idCounter++}`);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HeProvider service={service}>
      <HeProductShell />
    </HeProvider>
  </React.StrictMode>
);
