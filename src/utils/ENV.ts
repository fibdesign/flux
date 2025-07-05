import parseEnv from "parse-dotenv";
import path from "node:path";
export const ENV = parseEnv(path.resolve(process.cwd(), '.env'));