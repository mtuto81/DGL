import {Application,BoxComponent,ButtonComponent,GridComponent, LabelComponent,ContextMenuComponent,DialogComponent} from "../src/Component_System.ts";
    
   
const app = Application.getInstance();
app.init();

const window = app.createWindow("Context Menu Demo");

// Create a label with a context menu
const label = new LabelComponent("Right-click me!");

// Create a context menu
const contextMenu = new ContextMenuComponent()
  contextMenu.addItem("Option 1", () => {
    console.log("Option 1 selected");
  })
  contextMenu.addItem("Option 2", () => {
    console.log("Option 2 selected");
  })
  contextMenu.addItem("Option 3", () => {
    console.log("Option 3 selected");
  })
  contextMenu.attachTo(label);

// Create a box to hold the label
const box = new BoxComponent("vertical")
  



// Another example with a button
const button = new ButtonComponent("Button with Context Menu");

const buttonContextMenu = new ContextMenuComponent()
  buttonContextMenu.addItem("Edit", () => {
    console.log("Edit selected");
  })
  buttonContextMenu.addItem("Delete", () => {
    console.log("Delete selected");
  })
  buttonContextMenu.attachTo(button);

// More complex example with dynamic menu items
const dynamicContextMenu = new ContextMenuComponent()
 dynamicContextMenu.addItem("Refresh", () => {
    console.log("Refreshing...");
  })
  dynamicContextMenu.addItem("Properties", () => {
    // You could create a properties dialog here
    const propertiesDialog = new DialogComponent("Properties")
      propertiesDialog.addButton("Close", GTK_CONSTANTS.GTK_RESPONSE_CLOSE)
      propertiesDialog.setContent(
        new BoxComponent("vertical")
          .appendChild(new LabelComponent("Application Properties"))
          .appendChild(new LabelComponent("Version: 1.0.0"))
      );
    propertiesDialog.mount();
    propertiesDialog.show();
  });
  box.appendChild(button);
  box.appendChild(label)
  button.show()
  window.appendChild(box);
app.run();