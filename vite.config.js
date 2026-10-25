import { defineConfig } from "vite";
import { resolve } from "node:path";
import { existsSync, readdirSync } from "node:fs";

const themesDirectory = resolve(import.meta.dirname, "src/themes");

const vencordDirectory = "/mnt/c/Users/mayaa/AppData/Roaming/Vencord/themes";

const isWatchMode = process.argv.includes("--watch");

const themes = Object.fromEntries(
  readdirSync(themesDirectory)
    .filter((file) => file.endsWith(".css"))
    .map((file) => [
      file.replace(/\.css$/, ""),
      resolve(themesDirectory, file),
    ]),
);

export default defineConfig({
  plugins: [
    {
      name: "vencord-theme-metadata",
      generateBundle(_, bundle) {
        for (const asset of Object.values(bundle)) {
          if (
            asset.type !== "asset" ||
            !asset.fileName.endsWith(".theme.css")
          ) {
            continue;
          }

          const css = String(asset.source);

          asset.source = css.replace(/^\/\*!/, "/**");
        }
      },
    },
  ],

  build: {
    /*
     * Vencord loads standalone CSS files.
     * Embed textures and local fonts as Base64 data URLs.
     */
    assetsInlineLimit: (filePath) => {
      const isThemeTexture =
        /[/\\]src[/\\]assets[/\\]textures[/\\](dots|hearts|paws)\.jpg$/.test(
          filePath,
        );

      const isThemeFont =
        /[/\\]src[/\\]assets[/\\]fonts[/\\][^/\\]+\.(ttf|otf|woff2?)$/i.test(
          filePath,
        );

      return isThemeTexture || isThemeFont ? true : undefined;
    },

    outDir:
      isWatchMode && existsSync(vencordDirectory) ? vencordDirectory : "dist",

    emptyOutDir: !isWatchMode,
    cssCodeSplit: true,
    minify: false,

    rollupOptions: {
      input: themes,

      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.names?.[0]?.endsWith(".css")) {
            return "[name].theme.css";
          }

          return "assets/[name][extname]";
        },
      },
    },
  },
});
