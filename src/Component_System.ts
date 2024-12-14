// gtk-component-system.ts
import { 
  Window, Box, Button, Label, Entry, Widget, 
  init, main, quit, CSSProvider,Grid,Dialog,Menu,MenuItem,
  GTK_CONSTANTS 
} from "./gtk.ts";

// Base Component Abstract Class
abstract class Component {
  protected widget: Widget | null = null;
  protected children: Component[] = [];
  protected parent: Component | null = null;

  constructor() {}

  // Abstract method to create specific widget
  protected abstract createWidget(): Widget;

  // Mount the widget and its children
  mount(): Widget {
    if (!this.widget) {
      this.widget = this.createWidget();
      this.mountChildren();
    }
    return this.widget;
  }

  // Mount child widgets
  protected mountChildren(): void {
    if (this.widget) {
      this.children.forEach(child => {
        const childWidget = child.mount();
        
        // Use appropriate container-specific method
        if (this.widget instanceof Window) {
          (this.widget as Window).add(childWidget);
        } else if (this.widget instanceof Box) {
          (this.widget as Box).packStart(childWidget);
        }
      });
    }
  }

  // Add a child component
  appendChild(child: Component): void {
    child.parent = this;
    this.children.push(child);
    
    // If already mounted, add child widget immediately
    if (this.widget && child.widget) {
      if (this.widget instanceof Window) {
        (this.widget as Window).add(child.widget);
      } else if (this.widget instanceof Box) {
        (this.widget as Box).packStart(child.widget);
      }
    }
  }

  // Remove a child component
  removeChild(child: Component): void {
    const index = this.children.indexOf(child);
    if (index !== -1) {
      this.children.splice(index, 1);
      child.parent = null;
      
      // Remove widget if possible
      if (this.widget && child.widget) {
        // Note: You might need to implement a generic remove method in gtk.ts
        // This is a placeholder for actual GTK widget removal
        console.warn("Widget removal not fully implemented");
      }
    }
  }

  // Show the widget
  show(): void {
    this.widget?.show();
  }

  // Destroy the widget and its children
  destroy(): void {
    // Destroy children first
    this.children.forEach(child => child.destroy());
    
    // Destroy the widget
    this.widget?.destroy();
    this.widget = null;
  }
  setName(name: string): void {
    if (this.widget && 'setName' in this.widget) {
      (this.widget as any).setName(name);
    }
  }

  addClass(className: string): void {
    if (this.widget && 'addClass' in this.widget) {
      (this.widget as any).addClass(className);
    }
  }

  removeClass(className: string): void {
    if (this.widget && 'removeClass' in this.widget) {
      (this.widget as any).removeClass(className);
    }
  }
}


// Window Component
class WindowComponent extends Component {
  private title: string;
  private width: number;
  private height: number;

  constructor(
    title: string, 
    width = 800, 
    height = 600
  ) {
    super();
    this.title = title;
    this.width = width;
    this.height = height;
  }

  protected createWidget(): Widget {
    const window = new Window(this.title, this.width, this.height);
    
    // Default close behavior
    window.connectSignal(
      "destroy", 
      () => quit(), 
      { parameters: [], result: "void" }
    );
    
    return window;
  }

  // Update window title dynamically
  setTitle(title: string): void {
    this.title = title;
    if (this.widget instanceof Window) {
      (this.widget as Window).setTitle(title);
    }
  }
}

// Box (Container) Component
export class BoxComponent extends Component {
  private orientation: "horizontal" | "vertical";
  private spacing: number;

  constructor(
    orientation: "horizontal" | "vertical" = "vertical", 
    spacing = 0
  ) {
    super();
    this.orientation = orientation;
    this.spacing = spacing;
  }

  protected createWidget(): Widget {
    const gtkOrientation = this.orientation === "vertical"
      ? GTK_CONSTANTS.GTK_ORIENTATION_VERTICAL
      : GTK_CONSTANTS.GTK_ORIENTATION_HORIZONTAL;
    
    return new Box(gtkOrientation, this.spacing);
  }
}
// Grid Component
export class GridComponent extends Component {
  private rowSpacing: number;
  private columnSpacing: number;

  constructor(
    rowSpacing = 0, 
    columnSpacing = 0
  ) {
    super();
    this.rowSpacing = rowSpacing;
    this.columnSpacing = columnSpacing;
  }

  protected createWidget(): Widget {
    const grid = new Grid();
    
    // Set spacing
    grid.setRowSpacing(this.rowSpacing);
    grid.setColumnSpacing(this.columnSpacing);
    
    console.log("Grid widget created:", grid);
    return grid;
  }
  
  attachChild(
    child: Component, 
    left: number, 
    top: number, 
    width = 1, 
    height = 1
  ): void {
    console.log("Attaching child to grid:", {
      child, 
      left, 
      top, 
      width, 
      height,
      gridWidget: this.widget
    });
  
    child.parent = this;
    this.children.push(child);
    
    // Explicitly mount the child widget
    const childWidget = child.mount();
    console.log("Child widget mounted:", childWidget);
    
    if (this.widget instanceof Grid) {
      (this.widget as Grid).attach(
        childWidget, 
        left, 
        top, 
        width, 
        height
      );
      console.log("Child attached to grid successfully");
    } else {
      console.warn("Grid not yet mounted. Child may not be displayed.");
    }
  }
}


// Button Component
export class ButtonComponent extends Component {
  private label: string;
  private onClick?: () => void;
  private width?: number;
  private height?:number;
  private expand: boolean;
  private fill: boolean;
  constructor(
    label: string, 
    options: {
      onClick?: () => void;
      width?: number;
      height?: number;
      expand?: boolean;
      fill?: boolean;
    } = {}
  ) {
    super();
    this.label = label;
    this.onClick = options.onClick;
    this.width = options.width;
    this.height = options.height;
    this.expand = options.expand ?? false;
    this.fill = options.fill ?? true;
  }

  protected createWidget(): Widget {
    const button = new Button(this.label);
    
    if (this.onClick) {
      button.onClick(this.onClick);
    }

    // If the parent is a Box, we can use pack options
    if (this.parent && this.parent.widget instanceof Box) {
      const box = this.parent.widget as Box;
      
      // Apply custom sizing if specified
      if (this.width !== undefined || this.height !== undefined) {
        button.setSizeRequest(
          this.width ?? -1, 
          this.height ?? -1
        );
      }
    }
    
    return button;
  }

  // Update button label dynamically
  setLabel(label: string): void {
    this.label = label;
    if (this.widget instanceof Button) {
      (this.widget as Button).setLabel(label);
    }
  }

  // Update click handler dynamically
  setClickHandler(handler: () => void): void {
    this.onClick = handler;
    if (this.widget instanceof Button) {
      (this.widget as Button).onClick(handler);
    }
  }

  // Set size request dynamically
  setSize(width?: number, height?: number): void {
    // Update stored dimensions
    this.width = width ?? -1;
    this.height = height ?? -1;
    if (this.widget instanceof Button) {
      this.widget.setSizeRequest(
        width ?? -1, 
        height ?? -1
      );
    }
  }
}

// Label Component
export class LabelComponent extends Component {
  private text: string;

  constructor(text: string) {
    super();
    this.text = text;
  }

  protected createWidget(): Widget {
    return new Label(this.text);
  }

  // Update label text dynamically
  setText(text: string): void {
    this.text = text;
    if (this.widget instanceof Label) {
      (this.widget as Label).setText(text);
    }
  }
}

// Entry (Text Input) Component
export class EntryComponent extends Component {
  private placeholder?: string;
  private onChange?: (text: string) => void;

  constructor(
    placeholder?: string, 
    onChange?: (text: string) => void
  ) {
    super();
    this.placeholder = placeholder;
    this.onChange = onChange;
  }

  protected createWidget(): Widget {
    const entry = new Entry();
    
    if (this.placeholder) {
      entry.setText(this.placeholder);
    }

    if (this.onChange) {
      entry.onChanged(() => {
        if (this.onChange) {
          this.onChange(entry.getText());
        }
      });
    }
    
    return entry;
  }

  // Get current text
  getText(): string {
    return this.widget instanceof Entry 
      ? (this.widget as Entry).getText() 
      : '';
  }

  // Set text dynamically
  setText(text: string): void {
    if (this.widget instanceof Entry) {
      (this.widget as Entry).setText(text);
    }
  }
}
export class DialogComponent extends Component {
  private title: string;
  private width?: number;
  private height?: number;
  private buttons: {
    label: string, 
    responseId: number, 
    callback?: (response: number) => void
  }[] = [];
  private contentComponent?: Component;
  private onResponse?: (response: number) => void;

  constructor(
    title: string, 
    options: {
      width?: number;
      height?: number;
      onResponse?: (response: number) => void;
    } = {}
  ) {
    super();
    this.title = title;
    this.width = options.width;
    this.height = options.height;
    this.onResponse = options.onResponse;
  }

  // Enhanced addButton method to support per-button callbacks
  addButton(
    label: string, 
    responseId: number, 
    callback?: (response: number) => void
  ): DialogComponent {
    this.buttons.push({ label, responseId, callback });
    return this;
  }

  // Set overall response handler
  setResponseHandler(
    handler: (response: number) => void
  ): DialogComponent {
    this.onResponse = handler;
    return this;
  }

  // Get content from the dialog (useful for retrieving user input)
  getContent(): Component | undefined {
    return this.contentComponent;
  }

  // Set content for the dialog
  setContent(component: Component): DialogComponent {
    this.contentComponent = component;
    return this;
  }

  protected createWidget(): Widget {
    const dialog = new Dialog(this.title);

    // Add buttons with custom response handling
    this.buttons.forEach(button => {
      const gtkButton = dialog.addButton(button.label, button.responseId);
      
      // Connect click handler to manage response
      gtkButton.onClick(() => {
        // Find the button configuration
        const buttonConfig = this.buttons.find(
          b => b.label === button.label
        );

        if (buttonConfig) {
          // Call button-specific callback if exists
          if (buttonConfig.callback) {
            buttonConfig.callback(button.responseId);
          }

          // Call global response handler if exists
          if (this.onResponse) {
            this.onResponse(button.responseId);
          }

          // Destroy the dialog
          dialog.destroy();
        }
      });
    });

    // Set content area if a content component exists
    if (this.contentComponent) {
      const contentWidget = this.contentComponent.mount();
      dialog.setContentArea(contentWidget);
    }

    // Set size if specified
    if (this.width !== undefined || this.height !== undefined) {
      dialog.setSizeRequest(
        this.width ?? -1, 
        this.height ?? -1
      );
    }

    return dialog;
  }

  // Show the dialog
  show(): void {
    if (this.widget) {
      this.widget.show();
    }
  }
}
export class ContextMenuComponent extends Component {
  private menuItems: {
    label: string, 
    onClick?: () => void
  }[] = [];

  // Add a menu item
  addItem(
    label: string, 
    onClick?: () => void
  ): ContextMenuComponent {
    this.menuItems.push({ label, onClick });
    return this;
  }

  protected createWidget(): Widget {
    const menu = new Menu();

    // Create and add menu items
    this.menuItems.forEach(itemConfig => {
      const menuItem = new MenuItem(itemConfig.label);
      
      if (itemConfig.onClick) {
        menuItem.onClick(itemConfig.onClick);
      }
      
      menu.addItem(menuItem);
    });

    return menu;
  }

  // Attach context menu to a widget
  attachTo(component: Component): ContextMenuComponent {
    if (component.widget) {
      // Connect right-click signal
      component.widget.connectSignal(
        "button-press-event", 
        (widget: Widget, event: any) => {
          // Check if right mouse button (button 3) is pressed
          if (event.button === 3) {
            this.show();
            return true; // Stop event propagation
          }
          return false;
        },
        { 
          parameters: ["pointer", "pointer"], 
          result: "bool" 
        }
      );
    }
    return this;
  }

  // Show the context menu
  show(): void {
    if (this.widget instanceof Menu) {
      (this.widget as Menu).popup();
    }
  }
}
// Application Singleton
export class Application {
  private static instance: Application | null = null;
  private rootWindow: WindowComponent | null = null;
  private cssProvider: CSSProvider;

  private constructor() {
    this.cssProvider = new CSSProvider();
  }

  // Singleton getInstance method
  static getInstance(): Application {
    if (!this.instance) {
      this.instance = new Application();
    }
    return this.instance;
  }

  // Initialize GTK
  init(): void {
    init();
  }

  // Create main window
  createWindow(
    title: string, 
    width = 800, 
    height = 600
  ): WindowComponent {
    this.rootWindow = new WindowComponent(title, width, height);
    return this.rootWindow;
  }
  

  // Load CSS from a string
  loadCSS(cssString: string,contextwidget:Widget): boolean {
    return this.cssProvider.loadFromString(cssString,contextwidget);
  }

  // Load CSS from a file
  loadCSSFile(filePath: string): boolean {
    return this.cssProvider.loadFromFile(filePath);
  }

  // Run the application
  run(): void {
    if (!this.rootWindow) {
      throw new Error("No window created. Call createWindow() first.");
    }

    this.rootWindow.mount();
    this.rootWindow.show();
    main();
  }

  // Quit the application
  quit(): void {
    quit();
  }
}

// Example usage
