// src/core/window.ts

import { Event } from "./event.ts";

export abstract class Window {
  protected title: string;
  protected width: number;
  protected height: number;

  constructor(title: string, width: number, height: number) {
    this.title = title;
    this.width = width;
    this.height = height;
  }

  abstract create(): boolean;
  abstract destroy(): void;
  abstract handleEvent(event: Event): void;
  abstract update(): void;

  getTitle(): string {
    return this.title;
  }

  getSize(): { width: number; height: number } {
    return { width: this.width, height: this.height };
  }

  setSize(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }
}