import { createApp } from "./src/app.js";
import { connectDatabase } from "./src/config/database.js";
import { env } from "./src/config/env.js";

async function bootstrap() {
  await connectDatabase();

  const app = createApp();
  app.listen(env.port, () => {
    console.log(`SIGEPEJ API running on http://localhost:${env.port}`);
  });
}

bootstrap().catch((error) => {
  console.error("Backend startup failed:", error.message);
  process.exit(1);
});
