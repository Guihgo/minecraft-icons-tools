import { resolve } from "node:path";

export const PUBLIC_DIR = resolve(process.cwd(), "public")
export const ASSETS_DIR = resolve(PUBLIC_DIR, "assets")
export const API_DIR = resolve(PUBLIC_DIR, "api")

export function getFilename(category: string, id: number, subId: number) {
    return `minecraft_${category}_${id}_${subId}.png`
}