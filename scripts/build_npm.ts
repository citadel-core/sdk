import { build, emptyDir } from "https://deno.land/x/dnt@0.32.0/mod.ts";

await emptyDir("./npm");

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  shims: {
    // see JS docs for overview and more options
    deno: "dev",
  },
  compilerOptions: {
    lib: ["es2021", "dom"],
  },
  package: {
    // package.json properties
    name: "@runcitadel/sdk-next",
    version: Deno.args[0],
    description: "Client for the Citadel API",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/citadel-core/sdk.git",
    },
    bugs: {
      url: "https://github.com/citadel-core/sdk/issues",
    },
  },
});

// post build steps
Deno.copyFileSync("LICENSE", "npm/LICENSE");
Deno.copyFileSync("README.md", "npm/README.md");
