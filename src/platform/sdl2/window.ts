// src/platform/sdl2/window.ts

import { Window } from "../../core/window.ts";
import { Event, EventType } from "../../core/event.ts";
import { SDLContext } from "./sdl_context.ts";
import { getSDL2ErrorMessage } from "../../utils/ffi_loader.ts";
import { SDL2Renderer } from "./renderer.ts";
import { UIComponent } from "../../core/ui_conponents.ts";

// src/platform/window.ts
import { Webview } from "@webview/webview";

export class WebViewWindow extends Window {
  private webview: Webview | null = null;
  private components: UIComponent[] = [];

  async create(): Promise<boolean> {
    try {
      this.webview = new Webview();
      this.webview.title = this.title;
      this.webview.size = { width: this.width, height: this.height };

      // Bind method for communication between WebView and Deno
      this.webview.bind("denoCallback", (data: string) => {
        const event = JSON.parse(data);
        this.handleEvent(new Event(event.type, event.data));
      });

      return true;
    } catch (error) {
      console.error("Error creating window:", error.message);
      return false;
    }
  }

  // Method to set inline HTML
  setHTML(html: string): void {
    if (this.webview) {
      this.webview.navigate(`data:text/html,${encodeURIComponent(html)}`);
    }
  }

  // Method to load HTML from a file
  async loadHTMLFile(filePath: string): Promise<void> {
    try {
      const html = await Deno.readTextFile(filePath);
      this.setHTML(html);
    } catch (error) {
      console.error("Error loading HTML file:", error.message);
    }
  }

  destroy(): void {
    if (this.webview) {
      this.webview.destroy();
      this.webview = null;
    }
  }

  addComponent(component: UIComponent): void {
    this.components.push(component);
    this.updateWebViewContent();
  }

  handleEvent(event: Event): void {
    switch (event.type) {
      case EventType.Quit:
        this.destroy();
        break;
      case EventType.Click:
          
      default:
        // Propagate the event to all components
        for (const component of this.components) {
          component.handleEvent(event);
        }
    }
    // Update WebView content after handling events
    this.updateWebViewContent();
  }

  update(): void {
    this.updateWebViewContent();
  }

  private updateWebViewContent(): void {
    if (this.webview) {
      const componentsHtml = this.components.map(c => c.toHTML()).join("");
      const componentsJs = this.components.map(c => c.toJS()).join("\n");
      
      this.webview.eval(`
        document.getElementById('app').innerHTML = '${componentsHtml}';
        ${componentsJs}
      `);
    }
  }

  run(): void {
    if (this.webview) {
      this.webview.run();
    }
  }

  // This method is no longer needed as WebView handles its own event loop
  pollEvents(): Event[] {
    return [];
  }
}
  // ... (rest of the class implementation remains the same)
