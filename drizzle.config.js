import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./configs/schema.js",
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_Gux5J2AQohER@ep-cool-moon-a80zlrb5-pooler.eastus2.azure.neon.tech/neondb?sslmode=require",
  },
});
