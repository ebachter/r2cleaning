import {defineConfig} from 'drizzle-kit';

const envVars = process.env;
const dbUrl = envVars.DB_URL;
console.log('>>>', dbUrl);

export default defineConfig({
  dialect: 'mysql',
  schema: './src/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: dbUrl,
  },
});
