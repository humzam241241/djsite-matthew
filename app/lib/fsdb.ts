import { promises as fs } from "fs";
import path from "path";

const root = process.cwd();

/**
 * Read a JSON file and parse its contents
 * @param p Path to the JSON file, relative to the project root
 * @returns Parsed JSON content
 */
export async function readJson<T>(p: string): Promise<T> {
  const file = path.join(root, p);
  return JSON.parse(await fs.readFile(file, "utf-8")) as T;
}

/**
 * Write data to a JSON file
 * @param p Path to the JSON file, relative to the project root
 * @param data Data to write to the file
 */
export async function writeJson<T>(p: string, data: T) {
  const file = path.join(root, p);
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf-8");
}
