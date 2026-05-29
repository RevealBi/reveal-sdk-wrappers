/// <reference types='vitest' />
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import * as path from 'path';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

// This config builds one format per invocation, selected by `mode`:
//   - default (ES): for npm installs. lit + reveal-sdk are external so the
//     published package stays lean and avoids duplicate copies of lit.
//   - `umd`: a near-standalone bundle for <script> tag usage. lit is bundled
//     in (consumers don't load it separately), but reveal-sdk stays external
//     because the host page loads the Reveal SDK itself (global `Reveal`).
// `nx build wrappers` runs the ES pass then the UMD pass into the same dist
// (see project.json), so the ES pass cleans the dir and the UMD pass appends.
export default defineConfig(({ mode }) => {
  const isUmd = mode === 'umd';

  return {
    root: __dirname,
    cacheDir: '../../node_modules/.vite/packages/wrappers',

    plugins: [
      nxViteTsPaths(),
      // Type declarations only need to be generated once, in the ES pass.
      ...(isUmd
        ? []
        : [
            dts({
              entryRoot: 'src',
              tsconfigPath: path.join(__dirname, 'tsconfig.lib.json'),
            }),
          ]),
    ],

    // Configuration for building your library.
    // See: https://vitejs.dev/guide/build.html#library-mode
    build: {
      outDir: '../../dist/packages/wrappers',
      // Only the ES pass clears the output; the UMD pass appends to it.
      emptyOutDir: !isUmd,
      reportCompressedSize: true,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
      lib: {
        entry: 'src/index.ts',
        name: 'RevealSdkWrappers',
        fileName: (format) => (format === 'umd' ? `index.${format}.js` : 'index.js'),
        formats: isUmd ? ['umd'] : ['es'],
      },
      rollupOptions: {
        // Keep reveal-sdk external in both builds. Keep lit external for the
        // ES build only; the UMD build bundles lit for standalone usage.
        external: isUmd
          ? [/^reveal-sdk($|\/)/]
          : [/^reveal-sdk($|\/)/, /^lit($|\/)/],
        output: {
          // Global variable names for externals in the UMD build. The Reveal
          // SDK's UMD bundle exposes itself as the global `Reveal`.
          globals: {
            'reveal-sdk': 'Reveal',
          },
        },
      },
    },
  };
});
