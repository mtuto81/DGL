// gtk.ts - GTK bindings for Deno

const GTKLIB = "libgtk-3-0.dll";
  
  
  const lib = Deno.dlopen(GTKLIB, {
    // Initialization
    gtk_init: { parameters: ["pointer", "pointer"], result: "void" },
    gtk_main: { parameters: [], result: "void" },
    gtk_main_quit: { parameters: [], result: "void" },
  
    // Window
    gtk_window_new: { parameters: ["i32"], result: "pointer" },
    gtk_window_set_title: { parameters: ["pointer", "pointer"], result: "void" },
    gtk_window_set_default_size: { parameters: ["pointer", "i32", "i32"], result: "void" },
    gtk_container_add: { parameters: ["pointer", "pointer"], result: "void" },
    gtk_widget_show_all: { parameters: ["pointer"], result: "void" },
  
    // Buttons
    gtk_button_new_with_label: { parameters: ["pointer"], result: "pointer" },
    gtk_button_set_label: { parameters: ["pointer", "pointer"], result: "void" },
  
    // Box (Layout Container)
    gtk_box_new: { parameters: ["i32", "i32"], result: "pointer" },
    gtk_box_pack_start: { 
      parameters: ["pointer", "pointer", "bool", "bool", "u32"], 
      result: "void" 
    },
  
    // Label
    gtk_label_new: { parameters: ["pointer"], result: "pointer" },
    gtk_label_set_text: { parameters: ["pointer", "pointer"], result: "void" },
  
    // Entry (Text Input)
    gtk_entry_new: { parameters: [], result: "pointer" },
    gtk_entry_get_text: { parameters: ["pointer"], result: "pointer" },
    gtk_entry_set_text: { parameters: ["pointer", "pointer"], result: "void" },
  });
  
  // GTK Constants
  export const GTK_CONSTANTS = {
    GTK_WINDOW_TOPLEVEL: 0,
    GTK_ORIENTATION_HORIZONTAL: 0,
    GTK_ORIENTATION_VERTICAL: 1,
  };
  
  // Signal connection helper
  const g_signal_connect = Deno.dlopen(
    {
      windows: "libgobject-2.0-0.dll",
      linux: "libgobject-2.0.so.0",
      darwin: "libgobject-2.0.dylib",
    }[Deno.build.os],
    {
      g_signal_connect_data: {
        parameters: ["pointer", "pointer", "pointer", "pointer", "pointer", "i32"],
        result: "u64",
      },
    }
  ).symbols.g_signal_connect_data;
  
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
  
    packStart(widget: Widget, expand = true, fill = true, padding = 0): void {
      lib.symbols.gtk_box_pack_start(
        this.handle,
        widget.getHandle(),
        expand,
        fill,
        padding
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