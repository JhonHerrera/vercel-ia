import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('monaco-graphql')) {
                        return 'monaco-graphql';
                    }
                },
            },
        },
    },
    optimizeDeps: {
        exclude: ['monaco-graphql'],
    },
})
