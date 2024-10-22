// src/utils/ffi_loader.ts

import { dlopen, ForeignFunction } from "https://deno.land/x/ffi/mod.ts";

// Define the SDL2 library path for different platforms
const SDL2_PATHS = {
  windows: "SDL2.dll",
  darwin: "libSDL2.dylib",
  linux: "libSDL2.so",
};

// Define the SDL2 functions we'll be using
const SDL2_SYMBOLS = {
  SDL_Init: { parameters: ["u32"], result: "i32" },
  SDL_Quit: { parameters: [], result: "void" },
  SDL_CreateWindow: {parameters: ["pointer", "i32", "i32", "i32", "i32", "u32"], result: "pointer",},
  SDL_DestroyWindow: { parameters: ["pointer"], result: "void" },
  SDL_Delay: { parameters: ["u32"], result: "void" },
  SDL_PollEvent: { parameters: ["pointer"], result: "i32" },
  SDL_GetError: { parameters: [], result: "pointer" },
  SDL_CreateRenderer: { parameters: ["pointer", "i32", "u32"], result: "pointer" },
  SDL_DestroyRenderer: { parameters: ["pointer"], result: "void" },
  SDL_RenderClear: { parameters: ["pointer"], result: "i32" },
  SDL_RenderPresent: { parameters: ["pointer"], result: "void" },
  SDL_SetRenderDrawColor: { parameters: ["pointer", "u8", "u8", "u8", "u8"], result: "i32" },
  SDL_RenderDrawRect: { parameters: ["pointer", "pointer"], result: "i32" },
  SDL_RenderFillRect: { parameters: ["pointer", "pointer"], result: "i32" },
};

// Define SDL2 constants
const SDL2_CONSTANTS = {
  SDL_INIT_VIDEO: 0x00000020,
  SDL_WINDOWPOS_UNDEFINED: 0x1FFF0000,
  SDL_WINDOW_SHOWN: 0x00000004,
  SDL_RENDERER_ACCELERATED: 0x00000002,
  SDL_RENDERER_PRESENTVSYNC: 0x00000004,
  // Add more constants as needed
};

// Define the type for our loaded SDL2 library
type SDL2Library = {
  symbols: {
    [K in keyof typeof SDL2_SYMBOLS]: ForeignFunction;
  };
} & typeof SDL2_CONSTANTS;

let sdl2Library: SDL2Library | null = null;

export async function loadSDL2(): Promise<SDL2Library> {
  if (sdl2Library) {
    return sdl2Library;
  }

  const os = Deno.build.os;
  const libraryPath = SDL2_PATHS[os as keyof typeof SDL2_PATHS];

  if (!libraryPath) {
    throw new Error(`Unsupported operating system: ${os}`);
  }

  try {
    const library = await Deno.dlopen(libraryPath, SDL2_SYMBOLS);

    sdl2Library = {
      ...library,
      ...SDL2_CONSTANTS,
    };

    return sdl2Library;
  } catch (error) {
    throw new Error(`Failed to load SDL2 library: ${error.message}`);
  }
}

export function getSDL2ErrorMessage(): string {
  if (!sdl2Library) {
    return "SDL2 library not loaded";
  }

  const errorPtr = sdl2Library.symbols.SDL_GetError();
  const errorBuffer = new Uint8Array(1024); // Assume max error length of 1024
  Deno.copy(errorPtr, errorBuffer);
  
  const nullTerminatorIndex = errorBuffer.indexOf(0);
  const errorMessage = new TextDecoder().decode(errorBuffer.subarray(0, nullTerminatorIndex));
  
  return errorMessage;
}