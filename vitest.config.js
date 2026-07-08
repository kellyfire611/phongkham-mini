import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.test.js', 'tests/business/**/*.test.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      include: ['src/js/utils/**/*.js', 'src/js/business/**/*.js', 'src/js/services/**/*.js'],
      exclude: ['tests/e2e/**', 'dist/**', 'playwright-report/**', 'test-results/**'],
    },
  },
});
