

// src/platform/webview/webview.ts

import { Webview } from "@webview/webview";

export class WebViewWrapper {
  private webview: Webview;

  constructor(title: string, width: number, height: number, debug = false) {
    this.webview = new Webview(debug);
    this.webview.title = title;
    this.webview.size = { width, height };
  }

  setTitle(title: string): void {
    this.webview.title = title;
  }

  setSize(width: number, height: number): void {
    this.webview.size = { width, height };
  }

  navigate(url: string): void {
    this.webview.navigate(url);
  }

  init(js: string): void {
    this.webview.init(js);
  }

  eval(js: string): void {
    this.webview.eval(js);
  }

  bind(name: string, fn: (...args: unknown[]) => unknown): void {
    this.webview.bind(name, fn);
  }

  unbind(name: string): void {
    this.webview.unbind(name);
  }

  run(): void {
    this.webview.run();
  }

  terminate(): void {
    this.webview.destroy();
  }
}