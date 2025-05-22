// Note: This configuration is a fallback as '@next/jest' could not be installed.
// For optimal Next.js integration, '@next/jest' is recommended.

module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    // Handle CSS imports (and SCSS, SASS, LESS if used)
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // Handle image imports
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
  transform: {
    // Use babel-jest to transpile tests with the next/babel preset
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',
  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,
  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.d.ts', // Exclude type definition files
    '!src/**/layout.js', // Exclude layout files from coverage
    '!src/**/page.js', // Exclude page files from coverage
    '!src/app/api/**', // Exclude API routes
    '!src/i18n/**', // Exclude i18n files
    '!src/app/questions.js', // Exclude questions data file
    '!**/node_modules/**',
    '!<rootDir>/.next/**',
    '!<rootDir>/coverage/**',
    '!<rootDir>/jest.config.js',
    '!<rootDir>/jest.setup.js',
    '!<rootDir>/babel.config.js', // Exclude babel config
    '!<rootDir>/postcss.config.js', // Exclude postcss config
    '!<rootDir>/tailwind.config.js', // Exclude tailwind config
  ],
};
