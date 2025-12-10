  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react-swc';
  import path from 'path';

  export default defineConfig({
    plugins: [react()],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        'vaul': 'vaul',
        'sonner': 'sonner',
        'recharts': 'recharts',
        'react-resizable-panels': 'react-resizable-panels',
        'react-hook-form': 'react-hook-form',
        'react-day-picker': 'react-day-picker',
        'next-themes': 'next-themes',
        'lucide-react': 'lucide-react',
        'input-otp': 'input-otp',
        'figma:asset/be213fd3afb7194e83fe4ac6405c70d913f7a4df.png': path.resolve(__dirname, './src/assets/be213fd3afb7194e83fe4ac6405c70d913f7a4df.png'),
        'figma:asset/b7392069004a962a7faa4411e15b3a342808af78.png': path.resolve(__dirname, './src/assets/b7392069004a962a7faa4411e15b3a342808af78.png'),
        'figma:asset/972a6bc015fa5c98ddeb2bc3d5985f42623eb1bb.png': path.resolve(__dirname, './src/assets/972a6bc015fa5c98ddeb2bc3d5985f42623eb1bb.png'),
        'figma:asset/575120f8324783dbb6eac73158909b23747d4002.png': path.resolve(__dirname, './src/assets/575120f8324783dbb6eac73158909b23747d4002.png'),
        'embla-carousel-react': 'embla-carousel-react',
        'cmdk': 'cmdk',
        'class-variance-authority': 'class-variance-authority',
        '@radix-ui/react-tooltip': '@radix-ui/react-tooltip',
        '@radix-ui/react-toggle': '@radix-ui/react-toggle',
        '@radix-ui/react-toggle-group': '@radix-ui/react-toggle-group',
        '@radix-ui/react-tabs': '@radix-ui/react-tabs',
        '@radix-ui/react-switch': '@radix-ui/react-switch',
        '@radix-ui/react-slot': '@radix-ui/react-slot',
        '@radix-ui/react-slider': '@radix-ui/react-slider',
        '@radix-ui/react-separator': '@radix-ui/react-separator',
        '@radix-ui/react-select': '@radix-ui/react-select',
        '@radix-ui/react-scroll-area': '@radix-ui/react-scroll-area',
        '@radix-ui/react-radio-group': '@radix-ui/react-radio-group',
        '@radix-ui/react-progress': '@radix-ui/react-progress',
        '@radix-ui/react-popover': '@radix-ui/react-popover',
        '@radix-ui/react-navigation-menu': '@radix-ui/react-navigation-menu',
        '@radix-ui/react-menubar': '@radix-ui/react-menubar',
        '@radix-ui/react-label': '@radix-ui/react-label',
        '@radix-ui/react-hover-card': '@radix-ui/react-hover-card',
        '@radix-ui/react-dropdown-menu': '@radix-ui/react-dropdown-menu',
        '@radix-ui/react-dialog': '@radix-ui/react-dialog',
        '@radix-ui/react-context-menu': '@radix-ui/react-context-menu',
        '@radix-ui/react-collapsible': '@radix-ui/react-collapsible',
        '@radix-ui/react-checkbox': '@radix-ui/react-checkbox',
        '@radix-ui/react-avatar': '@radix-ui/react-avatar',
        '@radix-ui/react-aspect-ratio': '@radix-ui/react-aspect-ratio',
        '@radix-ui/react-alert-dialog': '@radix-ui/react-alert-dialog',
        '@radix-ui/react-accordion': '@radix-ui/react-accordion',
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      target: 'esnext',
      outDir: 'build',
    },
    server: {
      // Use a different port than Buyers2 to avoid conflicts
      port: 3001,
      open: true,
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
        }
      },
    },
  });