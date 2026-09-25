import { defineNitroConfig } from 'nitro/config';
 
export default defineNitroConfig({
  runtimeConfig: {
    apiKey: 'no key',
  },
  routes: {
    "/api/departures": "./server/api/departures.ts",
    "/api/raw-departures": "./server/api/raw-departures.ts",
    "/api/journeys": "./server/api/journeys.ts",
	  "/api/ret-journeys": "./server/api/ret-journeys.ts",
    "/api/ret-movement": "./server/api/ret-movement.ts"
  }
});