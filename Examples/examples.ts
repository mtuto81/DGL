// example.ts
import { ComponentRenderer } from "../mod.ts";

// Create a renderer instance
const renderer = new ComponentRenderer();

// Register event handlers
renderer.registerEventHandler("handleSubmit", () => {
  const entry = renderer.getComponent("nameInput") as Entry;
  const label = renderer.getComponent("greetingLabel") as Label;
  if (entry && label) {
    const name = entry.getText();
    label.setText(`Hello, ${name}!`);
  }
});

// Define the UI using JSON
const ui = {
  type: "window",
  title: "organum",
  width: 300,
  height: 200,
  children: [{
    type: "box",
    orientation: "vertical",
    spacing: 10,
    children: [
      {
        type: "label",
        id: "greetingLabel",
        text: "Enter your name:"
      },
      {
        type: "entry",
        id: "nameInput",
        placeholder: "Your name"
      },
      {
        type: "button",
        label: "Submit",
        onClick: "handleSubmit"
      }
    ]
  }]
};

// Render the UI
renderer.render(ui);