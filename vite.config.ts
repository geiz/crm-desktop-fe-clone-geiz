import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => {
    return {
        base: '/',
        plugins: [react(), tsconfigPaths()],
        build: {
            outDir: 'dist',
            sourcemap: mode !== 'prod'
        },
        resolve: {
            alias: {
                assets: path.resolve(__dirname, 'src/assets'),
                components: path.resolve(__dirname, 'src/components'),
                constants: path.resolve(__dirname, 'src/config/constants'),
                hooks: path.resolve(__dirname, 'src/hooks'),
                pages: path.resolve(__dirname, 'src/pages'),
                routes: path.resolve(__dirname, 'src/routes'),
                providers: path.resolve(__dirname, 'src/providers'),
                services: path.resolve(__dirname, 'src/services'),
                store: path.resolve(__dirname, 'src/store'),
                utils: path.resolve(__dirname, 'src/utils'),
                types: path.resolve(__dirname, 'src/types')
            }
        }
    };
});
