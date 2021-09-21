module.exports = {
  verbose: true,
  moduleFileExtensions: [
      "ts"
  ],
  moduleDirectories: ["src"],
  setupTestFrameworkScriptFile: "./test/test-setup.ts",
  rootDir: "apps",
  testRegex: ".spec.ts$",
  transform: {
      "^.+\\.(t|j)s$": "ts-jest"
  },
  "testEnviroment": "node"
};