module.exports = {
  moduleFileExtensions: [ 'js', 'vue' ],
  transform: {
    "^.+\\.js$": "<rootDir>/node_modules/babel-jest",
    ".*\\.(vue)$": "<rootDir>/node_modules/vue-jest"
  },
  setupFilesAfterEnv: [ "<rootDir>test/setupTests.js" ],
  moduleNameMapper: {
    "@WORKERS/(.*\\.worker\\.js)$": "<rootDir>/mocks/workers/$1",
    "@WORKERS/(.*)$": "<rootDir>/src/workers/$1",
    "@SRC/(.*)$": "<rootDir>/src/$1",
  },
};