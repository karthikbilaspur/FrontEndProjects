// New: Define an interface for better type checking if using TypeScript
// interface AppConfig {
// backendUrl: string;
// // Add other global configurations here
// // example: maxAiImageSize?: number;
// }

const configs = { // Renamed from 'config' to 'configs' to avoid naming conflict with the exported 'config' variable
  development: {
    backendUrl: "http://localhost:8080/api/v1/dalle",
    // New: Add a development-specific logging level or feature flags
    // logLevel: "debug",
  },
  production: {
    backendUrl: "https://devswag.onrender.com/api/v1/dalle",
    // New: Add a production-specific logging level or feature flags
    // logLevel: "info",
  },
  // New: Add a 'test' environment config if you have separate testing backend
  // test: {
  // backendUrl: "http://localhost:8081/api/v1/dalle",
  // },
};

// New: Determine the current environment
// Vite uses import.meta.env.MODE, Node.js uses process.env.NODE_ENV
const environment = import.meta.env.MODE || process.env.NODE_ENV || 'development';

// New: Export the configuration for the current environment
// Provide a fallback to 'development' if the environment is not explicitly set or recognized
const config = configs[environment] || configs.development;

export default config;

// New: You could also export the entire 'configs' object for scenarios
// where you might need to inspect configs for other environments programmatically.
// export { configs };