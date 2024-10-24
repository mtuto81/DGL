import {WebViewWindow} from "./mod.ts";



async function main() {
  const window = new WebViewWindow("Calculator", 800, 600);
  await window.create();
  // Add components here
  await window.loadHTMLFile("./calculator.html");


    
window.run();
  
 
  }
  
  main();