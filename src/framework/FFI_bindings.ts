const GTKLIB = {
    windows: "libgtk-3-0.dll",
    linux: "libgtk-3-0.so.0",
    darwin: "libgtk-3-0dylib",
  }[Deno.build.os];
  
  
 export const lib = Deno.dlopen(GTKLIB, {
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
    //grid 
    gtk_grid_new: { parameters: [], result: "pointer" },
    gtk_grid_attach: { 
      parameters: ["pointer", "pointer", "i32", "i32", "i32", "i32"], 
      result: "void" 
    },
    gtk_grid_attach_next_to: {
      parameters: ["pointer", "pointer", "pointer", "i32", "i32", "i32"],
      result: "void"
    },
    gtk_grid_set_row_spacing: { 
      parameters: ["pointer", "u32"], 
      result: "void" 
    },
    gtk_grid_set_column_spacing: { 
      parameters: ["pointer", "u32"], 
      result: "void" 
    },
    //pop up menu
    gtk_menu_new: { parameters: [], result: "pointer" },
  gtk_menu_item_new_with_label: { parameters: ["pointer"], result: "pointer" },
  gtk_menu_shell_append: { parameters: ["pointer", "pointer"], result: "void" },
  gtk_menu_popup_at_pointer: { 
    parameters: ["pointer", "pointer"], 
    result: "void" 
  },
  gtk_menu_attach_to_widget: { 
    parameters: ["pointer", "pointer", "pointer"], 
    result: "void" 
  },
    //css 
    gtk_css_provider_new: { parameters: [], result: "pointer" },
    gtk_css_provider_load_from_data: {
      parameters: ["pointer", "pointer", "usize", "pointer"],
      result: "bool"
    },
    gtk_style_context_add_provider: {
      parameters: ["pointer", "pointer", "u32"],
      result: "void"
    },
   gtk_style_context_add_class:{parameters:["pointer","pointer"],result:"void"},
   gtk_style_context_remove_class:{parameters:["pointer","pointer"],result:"void"},
   gtk_widget_set_name:{parameters:["pointer","pointer"],result:"void"},
  
    // Label
    gtk_label_new: { parameters: ["pointer"], result: "pointer" },
    gtk_label_set_text: { parameters: ["pointer", "pointer"], result: "void" },
  
    // Entry (Text Input)
    gtk_entry_new: { parameters: [], result: "pointer" },
    gtk_entry_get_text: { parameters: ["pointer"], result: "pointer" },
    gtk_entry_set_text: { parameters: ["pointer", "pointer"], result: "void" },
    //set size_req
    gtk_widget_set_size_request: {
      parameters: ["pointer", "i32", "i32"],
      result: "void"
    },
    gtk_style_context_get_screen: { parameters: ["pointer"], result: "pointer" },
    gtk_widget_get_style_context: { parameters: ["pointer"], result: "pointer" },
    gtk_file_chooser_dialog_new: { 
      parameters: ["pointer", "pointer", "i32", "pointer", "pointer", "pointer"], 
      result: "pointer" 
    },
    gtk_file_chooser_set_action: { 
      parameters: ["pointer", "i32"], 
      result: "void" 
    },
    gtk_file_chooser_get_filename: { 
      parameters: ["pointer"], 
      result: "pointer" 
    },
    gtk_dialog_run: { 
      parameters: ["pointer"], 
      result: "i32" 
    },
    
    gtk_dialog_new_with_buttons: { 
      parameters: ["pointer", "pointer", "i32", "pointer"], 
      result: "pointer" 
    },
    gtk_dialog_add_button: { 
      parameters: ["pointer", "pointer", "i32"], 
      result: "pointer" 
    },
    gtk_dialog_get_content_area: { 
      parameters: ["pointer"], 
      result: "pointer" 
    },
    gtk_widget_destroy: { 
      parameters: ["pointer"], 
      result: "void" 
    },
    gtk_bin_get_child:{parameters:["pointer"],result:"pointer"}
  });
  
  // GTK Constants
  export const GTK_CONSTANTS = {
    GTK_WINDOW_TOPLEVEL: 0,
    GTK_ORIENTATION_HORIZONTAL: 0,
    GTK_ORIENTATION_VERTICAL: 1,
    GTK_STYLE_PROVIDER_PRIORITY_FALLBACK: 100,
    GTK_STYLE_PROVIDER_PRIORITY_THEME: 400,
    GTK_STYLE_PROVIDER_PRIORITY_SETTINGS: 600,
    GTK_STYLE_PROVIDER_PRIORITY_APPLICATION: 800,
    GTK_POS_LEFT: 0,
    GTK_POS_RIGHT: 1,
    GTK_POS_TOP: 2,
    GTK_POS_BOTTOM: 3,
    GTK_FILE_CHOOSER_ACTION_OPEN: 0,
  GTK_FILE_CHOOSER_ACTION_SAVE: 1,
  GTK_FILE_CHOOSER_ACTION_SELECT_FOLDER: 2,
  GTK_STOCK_OPEN: "gtk-open",
  GTK_STOCK_CANCEL: "gtk-cancel",
  GTK_STOCK_SAVE: "gtk-save",
  GTK_DIALOG_MODAL: 1 << 1,
  GTK_DIALOG_DESTROY_WITH_PARENT: 1 << 2,

  // Response types
  GTK_RESPONSE_NONE: -1,
  GTK_RESPONSE_REJECT: -2,
  GTK_RESPONSE_ACCEPT: -3,
  GTK_RESPONSE_DELETE_EVENT: -4,
  GTK_RESPONSE_OK: -5,
  GTK_RESPONSE_CANCEL: -6,
  GTK_RESPONSE_CLOSE: -7,
  GTK_RESPONSE_YES: -8,
  GTK_RESPONSE_NO: -9,
  GTK_RESPONSE_APPLY: -10,
  GTK_RESPONSE_HELP: -11
  };
  
  // Signal connection helper
  export const g_signal_connect = Deno.dlopen(
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
  