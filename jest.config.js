/** Jest 配置：使用 jest-expo 预设，并映射 @/ 路径别名。 */
module.exports = {
  preset: 'jest-expo',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // 纯逻辑单元测试集中在 src/__tests__。
  testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
};
