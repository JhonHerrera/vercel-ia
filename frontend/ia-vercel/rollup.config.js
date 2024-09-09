import resolve from '@rollup/plugin-node-resolve';

const config = {
  // ...
  plugins: [
    resolve({
      // Other options...
      alias: {
        'monaco-editor/esm/vs/editor/contrib/hover/browser/hover': 'monaco-editor/esm/vs/editor/contrib/hover/browser/hoverController',
      },
    }),
  ],
};