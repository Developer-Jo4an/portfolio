import {createRoot} from "react-dom/client";
import {App} from "./App.tsx";
import "./styles/index.module.scss";

createRoot(document.getElementById("root")!).render(<App/>);
