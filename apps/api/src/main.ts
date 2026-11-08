import { readEnv } from "./config/env";
import { createApp } from "./create-app";

async function bootstrap(): Promise<void> {
  const app = await createApp();
  const env = readEnv(process.env);
  await app.listen(env.port);
}

void bootstrap();
