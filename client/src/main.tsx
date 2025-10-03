import { createRoot } from "react-dom/client";
import App from "./App";
import "./template-styles.scss";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
