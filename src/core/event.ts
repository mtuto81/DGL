// src/core/event.ts

export enum EventType {
    Quit,
    MouseMove,
    MouseButton,
    KeyDown,
    KeyUp,
    // Add more event types as needed
  }
  
  export class Event {
    type: EventType;
    data: Record<string, unknown>;
  
    constructor(type: EventType, data: Record<string, unknown> = {}) {
      this.type = type;
      this.data = data;
    }
  }
  
  export interface EventHandler {
    handleEvent(event: Event): void;
  }
  
  export class EventDispatcher {
    private handlers: EventHandler[] = [];
  
    addHandler(handler: EventHandler): void {
      this.handlers.push(handler);
    }
  
    removeHandler(handler: EventHandler): void {
      const index = this.handlers.indexOf(handler);
      if (index !== -1) {
        this.handlers.splice(index, 1);
      }
    }
  
    dispatchEvent(event: Event): void {
      for (const handler of this.handlers) {
        handler.handleEvent(event);
      }
    }
  }