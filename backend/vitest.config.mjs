import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["test/tests/**/*.test.js"],
    fileParallelism: false,
    testTimeout: 20000,
    hookTimeout: 30000,
  },
});


//run this to do vitest tests: (searchWord.test.js)
//   npx vitest run

//run this to do other tests:
//  npm test