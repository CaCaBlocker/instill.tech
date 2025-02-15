const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jest-environment-jsdom",
  modulePathIgnorePatterns: ["<rootDir>/e2e/"],
  moduleNameMapper: {
    "^@/components/(.*)$": "<rootDir>/src/components/$1",
    "^@/utils/(.*)$": "<rootDir>/src/utils/$1",
    "^@/types/(.*)$": "<rootDir>/src/types/$1",
    "^@/hooks/(.*)$": "<rootDir>/src/hooks/$1",
    "^@/style/(.*)$": "<rootDir>/src/style/$1",
    "^@/lib/(.*)$": "<rootDir>/src/lib/$1",
    "^@/pages/(.*)$": "<rootDir>/src/pages/$1",
    "^@/contexts/(.*)$": "<rootDir>/src/contexts/$1",
    "react-markdown": "<rootDir>/src/lib/mocks/react-markdown.jsx",
    "remark-gfm": "<rootDir>/src/lib/mocks/remark-gfm.js",
    "rehype-raw": "<rootDir>/src/lib/mocks/rehype-raw.js",
    "next-mdx-remote": "<rootDir>/src/lib/mocks/next-mdx-remote.jsx",
    d3: "<rootDir>/node_modules/d3/dist/d3.min.js",
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
