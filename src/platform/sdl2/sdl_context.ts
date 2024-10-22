// src/platform/sdl2/sdl_context.ts

import { loadSDL2, getSDL2ErrorMessage } from "../../utils/ffi_loader.ts";

export class SDLContext {
  private static instance: SDLContext | null = null;
  private sdl2: Awaited<ReturnType<typeof loadSDL2>> | null = null;

  private constructor() {}

  static async getInstance(): Promise<SDLContext> {
    if (!SDLContext.instance) {
      SDLContext.instance = new SDLContext();
      await SDLContext.instance.initialize();
    }
    return SDLContext.instance;
  }

  private async initialize(): Promise<any> {
    this.sdl2 = await loadSDL2();
    const initResult = this.sdl2.symbols.SDL_Init(this.sdl2.SDL_INIT_VIDEO);
    if (initResult < 0) {
      throw new Error(`Failed to initialize SDL: ${getSDL2ErrorMessage()}`);
    }
  }

   getSDL2(): Awaited<ReturnType<typeof loadSDL2>> {
    if (!this.sdl2) {
      throw new Error("SDL2 not initialized");
    }
    return this.sdl2;
  }

  quit(): void {
    if (this.sdl2) {
      this.sdl2.symbols.SDL_Quit();
      this.sdl2 = null;
    }
  }
}