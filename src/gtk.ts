// gtk.ts - GTK bindings for Deno
import { lib,GTK_CONSTANTS,g_signal_connect } from "./framework/FFI_bindings.ts";
export{GTK_CONSTANTS}
// Widget base class
export abstract class Widget {
  protected handle: Deno.PointerValue;
  protected callbacks: Map<string, Deno.UnsafeCallback>;

  constructor(handle: Deno.PointerValue) {
    this.handle = handle;
    this.callbacks = new Map();
  }

  getHandle(): Deno.PointerValue {
    return this.handle;
  }

  show(): void {
    lib.symbols.gtk_widget_show_all(this.handle);
  }

  setSizeRequest(width: number, height: number): void {
    // If width or height is -1, it means "use default"
    lib.symbols.gtk_widget_set_size_request(
      this.handle,
      width,
      height
    );
  }


  protected connectSignal(
    signal: string,
    callback: (...args: any[]) => void,
    signature: { parameters: string[]; result: string }
  ): void {
    const cb = new Deno.UnsafeCallback(signature, callback);
    this.callbacks.set(signal, cb);

    const signalName = new TextEncoder().encode(signal + "\0");
    g_signal_connect(
      this.handle,
      Deno.UnsafePointer.of(signalName),
      cb.pointer,
      null,
      null,
      0
    );
  }
}

// Window class
export class Window extends Widget {
  constructor(title: string, width = 800, height = 600) {
    super(lib.symbols.gtk_window_new(GTK_CONSTANTS.GTK_WINDOW_TOPLEVEL));

    const titlePtr = new TextEncoder().encode(title + "\0");
    lib.symbols.gtk_window_set_title(this.handle, Deno.UnsafePointer.of(titlePtr));
    lib.symbols.gtk_window_set_default_size(this.handle, width, height);

    // Connect destroy signal
    this.connectSignal(
      "destroy",
      () => lib.symbols.gtk_main_quit(),
      { parameters: ["pointer"], result: "void" }
    );
  }

  add(widget: Widget): void {
    lib.symbols.gtk_container_add(this.handle, widget.getHandle());
  }
}

// Box (Layout Container) class
export class Box extends Widget {
  constructor(orientation: number, spacing: number) {
    super(lib.symbols.gtk_box_new(orientation, spacing));
  }

  packStart(widget: Widget, expand = true, fill = true, padding = 3): void {
    lib.symbols.gtk_box_pack_start(
      this.handle,
      widget.getHandle(),
      expand,
      fill,
      padding
    );
  }
}
// Grid class implementation
export class Grid extends Widget {
  constructor() {
    super(lib.symbols.gtk_grid_new());
  }

  // Set row spacing
  setRowSpacing(spacing: number): void {
    lib.symbols.gtk_grid_set_row_spacing(this.handle, spacing);
  }

  // Set column spacing
  setColumnSpacing(spacing: number): void {
    lib.symbols.gtk_grid_set_column_spacing(this.handle, spacing);
  }

  // Attach a widget to the grid
  attach(
    widget: Widget, 
    left: number, 
    top: number, 
    width = 1, 
    height = 1
  ): void {
    lib.symbols.gtk_grid_attach(
      this.handle, 
      widget.getHandle(), 
      left, 
      top, 
      width, 
      height
    );
  }
}

// Button class
export class Button extends Widget {
  constructor(label: string) {
    const labelPtr = new TextEncoder().encode(label + "\0");
    super(lib.symbols.gtk_button_new_with_label(Deno.UnsafePointer.of(labelPtr)));
  }

  setLabel(label: string): void {
    const labelPtr = new TextEncoder().encode(label + "\0");
    lib.symbols.gtk_button_set_label(this.handle, Deno.UnsafePointer.of(labelPtr));
  }

  onClick(callback: () => void): void {
    this.connectSignal(
      "clicked",
      callback,
      { parameters: ["pointer"], result: "void" }
    );
  }
}

// Label class
export class Label extends Widget {
  constructor(text: string) {
    const textPtr = new TextEncoder().encode(text + "\0");
    super(lib.symbols.gtk_label_new(Deno.UnsafePointer.of(textPtr)));
  }

  setText(text: string): void {
    const textPtr = new TextEncoder().encode(text + "\0");
    lib.symbols.gtk_label_set_text(this.handle, Deno.UnsafePointer.of(textPtr));
  }
}

// Entry (Text Input) class
export class Entry extends Widget {
  constructor() {
    super(lib.symbols.gtk_entry_new());
  }

  getText(): string {
    const ptr = lib.symbols.gtk_entry_get_text(this.handle);
    return new Deno.UnsafePointerView(ptr).getCString();
  }

  setText(text: string): void {
    const textPtr = new TextEncoder().encode(text + "\0");
    lib.symbols.gtk_entry_set_text(this.handle, Deno.UnsafePointer.of(textPtr));
  }

  onChanged(callback: () => void): void {
    this.connectSignal(
      "changed",
      callback,
      { parameters: ["pointer"], result: "void" }
    );
  }
}
export class CSSProvider {
  private provider: Deno.PointerValue;

  constructor() {
    this.provider = lib.symbols.gtk_css_provider_new();
  }

  // Load CSS from a string

  loadFromString(cssString: string, widget?: Widget): boolean {
    const encoder = new TextEncoder();
    const cssData = encoder.encode(cssString + "\0");
    
    const result = lib.symbols.gtk_css_provider_load_from_data(
      this.provider, 
      Deno.UnsafePointer.of(cssData), 
      cssData.length, 
      null
    );

    // If a widget is provided, use its style context
    if (result && widget) {
      const styleContext = lib.symbols.gtk_widget_get_style_context(widget.getHandle());
      
      lib.symbols.gtk_style_context_add_provider(
        styleContext,
        this.provider,
        600 // GTK_STYLE_PROVIDER_PRIORITY_APPLICATION
      );
    }

    return result;
  }

  loadFromFile(filePath: string, widget?: Widget): boolean {
    try {
      const cssContent = Deno.readTextFileSync(filePath);
      return this.loadFromString(cssContent, widget);
    } catch (error) {
      console.error("Error loading CSS file:", error);
      return false;
    }
  }
}

export class Dialog extends Widget {
  constructor(
    title: string, 
    parent: Window | null = null, 
    flags = GTK_CONSTANTS.GTK_DIALOG_MODAL
  ) {
    const titlePtr = new TextEncoder().encode(title + "\0");
    super(lib.symbols.gtk_dialog_new_with_buttons(
      Deno.UnsafePointer.of(titlePtr),
      parent ? parent.getHandle() : null,
      flags,
      null,
      null
    ));
  }

  // Add buttons to the dialog
  addButton(
    label: string, 
    responseId: number
  ): Button {
    const labelPtr = new TextEncoder().encode(label + "\0");
    const buttonHandle = lib.symbols.gtk_dialog_add_button(
      this.handle, 
      Deno.UnsafePointer.of(labelPtr), 
      responseId
    );
    return new Button(label);
  }

  // Set dialog content area
  setContentArea(widget: Widget): void {
    const contentArea = lib.symbols.gtk_dialog_get_content_area(this.handle);
    lib.symbols.gtk_container_add(contentArea, widget.getHandle());
  }

  // Run the dialog and return response
  run(): number {
    return lib.symbols.gtk_dialog_run(this.handle);
  }
}
export class MenuItem extends Widget {
  constructor(label: string) {
    const labelPtr = new TextEncoder().encode(label + "\0");
    super(lib.symbols.gtk_menu_item_new_with_label(Deno.UnsafePointer.of(labelPtr)));
  }

  // Set label dynamically
  setLabel(label: string): void {
    const labelPtr = new TextEncoder().encode(label + "\0");
    // Note: There might be a specific GTK function for this, 
    // but we'll use a generic approach
    const labelWidget = lib.symbols.gtk_bin_get_child(this.handle);
    if (labelWidget) {
      lib.symbols.gtk_label_set_text(labelWidget, Deno.UnsafePointer.of(labelPtr));
    }
  }

  // Add click handler
  onClick(callback: () => void): void {
    this.connectSignal(
      "activate",
      callback,
      { parameters: ["pointer"], result: "void" }
    );
  }
}

export class Menu extends Widget {
  constructor() {
    super(lib.symbols.gtk_menu_new());
  }

  // Add a menu item
  addItem(item: MenuItem): void {
    lib.symbols.gtk_menu_shell_append(this.handle, item.getHandle());
    item.show(); // Ensure the item is visible
  }

  // Popup the menu at the current pointer position
  popup(triggerWidget?: Widget): void {
    if (triggerWidget) {
      lib.symbols.gtk_menu_attach_to_widget(
        this.handle, 
        triggerWidget.getHandle(), 
        null
      );
    }
    
    lib.symbols.gtk_menu_popup_at_pointer(this.handle, null);
  }
}

// Extend Widget class with CSS methods
export class StyledWidget extends Widget {
  // Add a name to the widget for CSS selection
  setName(name: string): void {
    const namePtr = new TextEncoder().encode(name + "\0");
    lib.symbols.gtk_widget_set_name(this.handle, Deno.UnsafePointer.of(namePtr));
  }

  // Add a CSS class to the widget
  addClass(className: string): void {
    const classPtr = new TextEncoder().encode(className + "\0");
    lib.symbols.gtk_style_context_add_class(
      lib.symbols.gtk_widget_get_style_context(this.handle),
      Deno.UnsafePointer.of(classPtr)
    );
  }

  // Remove a CSS class from the widget
  removeClass(className: string): void {
    const classPtr = new TextEncoder().encode(className + "\0");
    lib.symbols.gtk_style_context_remove_class(
      lib.symbols.gtk_widget_get_style_context(this.handle),
      Deno.UnsafePointer.of(classPtr)
    );
  }
}
// Initialize GTK
export function init(): void {
  lib.symbols.gtk_init(null, null);
}

// Start the main event loop
export function main(): void {
  lib.symbols.gtk_main();
}

// Quit the main event loop
export function quit(): void {
  lib.symbols.gtk_main_quit();
}