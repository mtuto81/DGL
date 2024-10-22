// build.ts

import { ensureDir, copy, exists } from "https://deno.land/std/fs/mod.ts";
import { join } from "https://deno.land/std/path/mod.ts";

const appName = "MyDenoGUIApp";
const mainScript = "ex.ts";

async function promptForPath(prompt: string): Promise<string> {
  console.log(prompt);
  const buf = new Uint8Array(1024);
  const n = await Deno.stdin.read(buf);
  return new TextDecoder().decode(buf.subarray(0, n)).trim();
}

async function getSDLPath(): Promise<string> {
  const defaultPaths = {
    windows: "C:\\SDL2\\SDL2.dll",
    darwin: "/usr/local/lib/libSDL2.dylib",
    linux: "/usr/lib/x86_64-linux-gnu/libSDL2-2.0.so.0",
  };

  const defaultPath = defaultPaths[Deno.build.os as keyof typeof defaultPaths];
  
  if (await exists(defaultPath)) {
    return defaultPath;
  }

  console.log(`SDL2 library not found at the default location: ${defaultPath}`);
  return await promptForPath("Please enter the full path to your SDL2 library file:");
}

async function build() {
  // Step 1: Compile Deno Script
  const compileCmd = new Deno.Command("deno", {
    args: ["compile", "--output", appName, "--allow-ffi", "--allow-read", "--allow-write", mainScript],
  });
  const compileOutput = await compileCmd.output();
  if (!compileOutput.success) {
    console.error("Compilation failed:", new TextDecoder().decode(compileOutput.stderr));
    Deno.exit(1);
  }
  console.log(new TextDecoder().decode(compileOutput.stdout));

  // Step 2: Bundle SDL2 Library
  const sdlPath = await getSDLPath();
  const distDir = `./${appName}-dist`;
  await ensureDir(distDir);
  
  const sdlDestName = Deno.build.os === "windows" ? "SDL2.dll" : "libSDL2.so";
  const sdlDest = join(distDir, sdlDestName);
  
  await copy(sdlPath, sdlDest, { overwrite: true });

  // Step 3: Create Distribution Package
  const exeName = `${appName}${Deno.build.os === "windows" ? ".exe" : ""}`;
  await copy(exeName, join(distDir, exeName), { overwrite: true });

  console.log(`Build complete. Distribution package created in ${distDir}`);

  // Step 4: Provide instructions for running the compiled application
  console.log("\nTo run your application:");
  console.log(`1. Navigate to the ${distDir} directory`);
  console.log(`2. Run the following command:`);
  console.log(`   ${Deno.build.os === "windows" ? "" : "./"

}${exeName} --allow-ffi --unstable`);
}

build().catch(console.error);