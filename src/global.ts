import { resolve } from "node:path";

export const PUBLIC_DIR = resolve(process.cwd(), "public")
export const ASSETS_DIR = resolve(PUBLIC_DIR, "assets")
export const API_DIR = resolve(PUBLIC_DIR, "api")