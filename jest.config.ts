import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  // [...]
  // Replace `ts-jest` with the preset you want to use
  // from the above list
  // moduleDirectories: ['node_modules', 'src'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  // testMatch: ["**/**/*.test.ts"],
  // verbose: true,
  // forceExit: true,
  // setupFilesAfterEnv: ["<rootDir>/src/__tests__/helpers/setup.ts"]
  // setupFiles: ["./src/cores/configs/configs.ts"]
};

export default jestConfig;
