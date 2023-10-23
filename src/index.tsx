/* @refresh reload */
import { render } from "solid-js/web";

import "./index.styl";
import App from "./App";

render(() => <App />, document.body);

window.addEventListener("touchmove", (e: TouchEvent) => e.preventDefault(), {
  passive: false,
});
