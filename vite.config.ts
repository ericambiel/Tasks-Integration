import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

// Loads environment variable globally in all tests.
import dotEnvSafe from 'dotenv-safe';

dotEnvSafe.config({
  allowEmptyValues: true,
});

export default defineConfig({
  test: {
    globals: true,
    testTimeout: 500000,
  },
  plugins: [tsconfigPaths()],
});
