// gtkJsonComponents.ts

import { Window, Box, Button, Label, Entry, Widget, init, main, GTK_CONSTANTS } from "./gtk.ts";

// Types for our JSON component system
type ComponentType = "window" | "box" | "button" | "label" | "entry";

interface BaseProps {
  id?: string;
  type: ComponentType;
}

interface WindowProps extends BaseProps {
  type: "window";
  title: string;
  width?: number;
  height?: number;
  children?: ComponentDefinition[];
}

interface BoxProps extends BaseProps {
  type: "box";
  orientation: "horizontal" | "vertical";
  spacing: number;
  children?: ComponentDefinition[];
}

interface ButtonProps extends BaseProps {
  type: "button";
  label: string;
  onClick?: string;
}

interface LabelProps extends BaseProps {
  type: "label";
  text: string;
}

interface EntryProps extends BaseProps {
  type: "entry";
  placeholder?: string;
  onChange?: string;
}

type ComponentDefinition = WindowProps | BoxProps | ButtonProps | LabelProps | EntryProps;

class ComponentRenderer {
  private components: Map<string, Widget>;
  private eventHandlers: Map<string, (...args: any[]) => void>;

  constructor() {
    this.components = new Map();
    this.eventHandlers = new Map();
  }

  registerEventHandler(id: string, handler: (...args: any[]) => void) {
    this.eventHandlers.set(id, handler);
  }

  private getEventHandler(handlerId: string): ((...args: any[]) => void) | undefined {
    return this.eventHandlers.get(handlerId);
  }

  private createWindow(props: WindowProps): Window {
    const window = new Window(props.title, props.width, props.height);
    if (props.id) {
      this.components.set(props.id, window);
    }
    
    if (props.children && props.children.length > 0) {
      const child = this.renderComponent(props.children[0]);
      if (child) {
        window.add(child);
      }
    }
    
    return window;
  }

  private createBox(props: BoxProps): Box {
    const orientation = props.orientation === "vertical" 
      ? GTK_CONSTANTS.GTK_ORIENTATION_VERTICAL 
      : GTK_CONSTANTS.GTK_ORIENTATION_HORIZONTAL;
    
    const box = new Box(orientation, props.spacing);
    if (props.id) {
      this.components.set(props.id, box);
    }

    if (props.children) {
      for (const childDef of props.children) {
        const child = this.renderComponent(childDef);
        if (child) {
          box.packStart(child);
        }
      }
    }

    return box;
  }

  private createButton(props: ButtonProps): Button {
    const button = new Button(props.label);
    if (props.id) {
      this.components.set(props.id, button);
    }

    if (props.onClick) {
      const handler = this.getEventHandler(props.onClick);
      if (handler) {
        button.onClick(handler);
      }
    }

    return button;
  }

  private createLabel(props: LabelProps): Label {
    const label = new Label(props.text);
    if (props.id) {
      this.components.set(props.id, label);
    }
    return label;
  }

  private createEntry(props: EntryProps): Entry {
    const entry = new Entry();
    if (props.id) {
      this.components.set(props.id, entry);
    }
    
    if (props.placeholder) {
      entry.setText(props.placeholder);
    }

    if (props.onChange) {
      const handler = this.getEventHandler(props.onChange);
      if (handler) {
        entry.onChanged(handler);
      }
    }

    return entry;
  }

  renderComponent(definition: ComponentDefinition): Widget | null {
    switch (definition.type) {
      case "window":
        return this.createWindow(definition);
      case "box":
        return this.createBox(definition);
      case "button":
        return this.createButton(definition);
      case "label":
        return this.createLabel(definition);
      case "entry":
        return this.createEntry(definition);
      default:
        console.error("Unknown component type:", definition);
        return null;
    }
  }

  getComponent(id: string): Widget | undefined {
    return this.components.get(id);
  }

  render(definition: ComponentDefinition): void {
    init();
    const rootComponent = this.renderComponent(definition);
    if (rootComponent) {
      rootComponent.show();
    }
    main();
  }
}

export { ComponentRenderer };