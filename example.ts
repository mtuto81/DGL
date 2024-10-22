import {WebViewWindow,EventType,Event,WebViewWrapper } from "./mod.ts";
import { UIComponent } from "./src/core/ui_conponents.ts";

const window = new WebViewWindow("My Window", 800, 600);
await window.create();

await window.loadHTMLFile("./we.html");



window.run();
while (true) {
  const events = window.pollEvents();
  for (const event of events) {
    window.handleEvent(event);
    if (event.type === EventType.Quit) {
      window.destroy();
      Deno.exit(0);
    }
  }
  window.update();
}

