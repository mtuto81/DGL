import { GridComponent,GTK_CONSTANTS } from "../mod.ts";
import { Application, BoxComponent, ButtonComponent, LabelComponent,DialogComponent,EntryComponent} from "../src/Component_System.ts";

const app = Application.getInstance();
app.init();

const window = app.createWindow("Dialog Demo");

const dialogButton = new ButtonComponent("Open Dialog", {
  onClick: () => {
    const dialog = new DialogComponent("Confirmation", {
        height:22,
        width:76,
        onResponse: (response) => {
          switch(response) {
            case GTK_CONSTANTS.GTK_RESPONSE_OK:
              console.log("User confirmed action");
              break;
            case GTK_CONSTANTS.GTK_RESPONSE_CANCEL:
              console.log("User cancelled");
              break;
          }
        }
      })
      dialog.addButton("yes",GTK_CONSTANTS.GTK_RESPONSE_OK)
      
    
    dialog.mount();
    dialog.show();
  }
});

const box = new BoxComponent("vertical")
 box.appendChild(dialogButton);

window.appendChild(box);
app.run();