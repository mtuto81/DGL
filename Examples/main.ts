// example.ts
import { 
  init, main,
  Window, Box, Button, Label, Entry,
  GTK_CONSTANTS 
} from "./gtk.ts";

// Initialize GTK
init();

// Create main window
const window = new Window("GTK Example");

// Create a vertical box layout
const box = new Box(GTK_CONSTANTS.GTK_ORIENTATION_VERTICAL, 10);
window.add(box);

// Add a label
const label = new Label("Enter your name:");
box.packStart(label, false, false, 5);

// Add a text entry
const entry = new Entry();
box.packStart(entry, false, false, 5);

// Add a button
const button = new Button("Say Hello");
button.onClick(() => {
  const name = entry.getText();
  label.setText(`Hello, ${name}!`);
});
box.packStart(button, false, false, 5);

// Show all widgets and start the main loop
window.show();
main();