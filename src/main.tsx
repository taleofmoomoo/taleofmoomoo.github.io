import "./reset.css";
import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Entry from "./Entry.tsx";
import Portal from "./Portal.tsx";
import GameComponent from "./GameComponent.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Entry />} />
        <Route path="/game" element={<GameComponent />} />
        <Route path="/portal" element={<Portal />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
