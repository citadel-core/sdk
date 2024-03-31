import { build, emptyDir } from "https://deno.land/x/dnt@0.40.0/mod.ts";

await emptyDir("./npm");

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  shims: {
    // see JS docs for overview and more options
    deno: "dev",
  },
  compilerOptions: {
    lib: ["ES2022", "DOM"],
  },
  package: {
    // package.json properties
    name: "@runcitadel/sdk-next",
    version: Deno.args[0],
    description: "Client for the Citadel API",
    license: "MIT",
    optionalDependencies: {
      vue: "^3.0.0",
    },
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

const packageJsonPath = "./npm/package.json";
const packageJson = JSON.parse(Deno.readTextFileSync(packageJsonPath));
delete packageJson.dependencies.vue;
if (Object.keys(packageJson.dependencies).length === 0) {
  delete packageJson.dependencies;
}
Deno.writeTextFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
