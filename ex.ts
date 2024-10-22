import {WebViewWindow,EventType,WebViewWrapper } from "./mod.ts";
import { UIComponent } from "./src/core/ui_conponents.ts";



async function main() {
  const window = new WebViewWindow("My Window", 800, 600);
  await window.create();
  // Add components here
  await window.loadHTMLFile("https://claude.ai/chat/");


    
window.run();
  
 
  }
  
  main();