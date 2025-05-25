import "./reset.css";
import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GameComponent } from "./GameComponent.tsx";
import { BrowserRouter } from "react-router-dom";
import { Route } from "react-router";
import { Routes } from "react-router";
import Entry from "./Entry.tsx";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Entry />} />
        <Route path="/game" element={<GameComponent />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
