import "./reset.css";
import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GameComponent } from "./GameComponent.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GameComponent />
  </StrictMode>
);
