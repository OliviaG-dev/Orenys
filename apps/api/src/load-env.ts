import { config } from "dotenv";
import { resolve } from "node:path";

config({ path: resolve(process.cwd(), ".env"), override: false, quiet: true });
config({ path: resolve(process.cwd(), "../../.env"), override: false, quiet: true });
