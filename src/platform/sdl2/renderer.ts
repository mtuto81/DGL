import { SDLContext } from "./sdl_context.ts";
import { getSDL2ErrorMessage } from "../../utils/ffi_loader.ts";

export class SDL2Renderer {
  private rendererHandle: Deno.PointerValue | null = null;
  private sdlContext!: SDLContext;

  constructor(private windowHandle: Deno.PointerValue) {}

  async initialize(): Promise<void> {
    this.sdlContext = await SDLContext.getInstance();
  }

  async create(): Promise<boolean> {
    try {
      if (!this.sdlContext) {
        await this.initialize();
      }

      const sdl2 = this.sdlContext.getSDL2();
      this.rendererHandle = sdl2.symbols.SDL_CreateRenderer(
        this.windowHandle,
        -1,
        sdl2.SDL_RENDERER_ACCELERATED | sdl2.SDL_RENDERER_PRESENTVSYNC
      );

      if (this.rendererHandle === null) {
        throw new Error(`Failed to create renderer: ${getSDL2ErrorMessage()}`);
      }

      return true;
    } catch (error) {
      console.error("Error creating renderer:", error.message);
      return false;
    }
  }
  destroy(): void {
    if (this.rendererHandle) {
      const sdl2 = this.sdlContext.getSDL2();
      sdl2.symbols.SDL_DestroyRenderer(this.rendererHandle);
      this.rendererHandle = null;
    }
  }

  clear(): void {
    if (this.rendererHandle) {
      const sdl2 = this.sdlContext.getSDL2();
      sdl2.symbols.SDL_RenderClear(this.rendererHandle);
    }
  }

  present(): void {
    if (this.rendererHandle) {
      const sdl2 = this.sdlContext.getSDL2();
      sdl2.symbols.SDL_RenderPresent(this.rendererHandle);
    }
  }

  setDrawColor(r: number, g: number, b: number, a: number): void {
    if (this.rendererHandle) {
      const sdl2 = this.sdlContext.getSDL2();
      sdl2.symbols.SDL_SetRenderDrawColor(this.rendererHandle, r, g, b, a);
    }
  }

  drawRect(x: number, y: number, width: number, height: number): void {
    if (this.rendererHandle) {
      const sdl2 = this.sdlContext.getSDL2();
      
      const rectBuffer = new Uint8Array(16);
      const rectView = new Int32Array(rectBuffer.buffer);
      rectView[0] = x;
      rectView[1] = y;
      rectView[2] = width;
      rectView[3] = height;
  
      const rectPtr = Deno.UnsafePointer.of(rectBuffer);
  
      sdl2.symbols.SDL_RenderDrawRect(this.rendererHandle, rectPtr);
    }
  }

  fillRect(x: number, y: number, width: number, height: number): void {
    if (this.rendererHandle) {
      const sdl2 = this.sdlContext.getSDL2();
      
      // Create a new Uint8Array to represent the SDL_Rect structure
      const rectBuffer = new Uint8Array(16); // 4 int32 values, each 4 bytes
      const rectView = new Int32Array(rectBuffer.buffer);
      rectView[0] = x;
      rectView[1] = y;
      rectView[2] = width;
      rectView[3] = height;

      // Get a pointer to the rectBuffer
      const rectPtr = Deno.UnsafePointer.of(rectBuffer);
      sdl2.symbols.SDL_RenderFillRect(this.rendererHandle, rectPtr);
    }
  }

  drawText(text: string, x: number, y: number, fontSize: number): void {
    // Note: This is a placeholder. Actual text rendering requires
    // additional setup with SDL_ttf or a custom text rendering solution.
    console.log(`Drawing text "${text}" at (${x}, ${y}) with font size ${fontSize}`);
  }
}