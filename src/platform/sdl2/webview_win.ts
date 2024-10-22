// src/platform/webview/window.ts

import { Window } from "../../core/window.ts";
import { Event, EventType } from "../../core/event.ts";
import { UIComponent } from "../../core/ui_conponents.ts";
import { WebViewWrapper } from "../../core/webview.ts";

export class WebViewWindow extends Window {
  private webview: WebViewWrapper | null = null;
  private components: UIComponent[] = [];

  async create(): Promise<boolean> {
    try {
      this.webview = new WebViewWrapper(this.title, this.width, this.height);
      
      // Load initial HTML content
      this.webview.navigate(`data:text/html,
        <html>
          <head>
            <style>
              /* Add your global styles here */
            </style>
          </head>
          <body>
            <div id="app"></div>
            <script>
              // Add any necessary JavaScript for your application
              function invokeDenoCallback(data) {
                window.denoCallback(JSON.stringify(data));
              }
            </script>
          </body>
        </html>
      `);

      // Bind methods for communication between Deno and WebView
      this.webview.bind("denoCallback", (data: string) => {
        console.log("Received from WebView:", data);
        const event = JSON.parse(data);
        this.handleEvent(new Event(event.type, event.data));
      });

      return true;
    } catch (error) {
      console.error("Error creating window:", error.message);
      return false;
    }
  }

  destroy(): void {
    if (this.webview) {
      this.webview.terminate();
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
      // Generate HTML/JS representation of components
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
}