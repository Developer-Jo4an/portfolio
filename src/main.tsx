import {createRoot} from "react-dom/client";
import {Provider} from "react-redux";
import {store} from "./stateManager/store.ts";
import App from "./components/app/App.tsx";
import {ModalProvider} from "./components/modalProvider/ModalProvider.tsx";
import "../src/styles/general.css"

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ModalProvider>
      <App/>
    </ModalProvider>
  </Provider>
);
