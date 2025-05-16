import fs from 'fs-extra';

const CACHE_FILE = 'cache.json';
const CACHE_TTL = 60 * 1000;

export async function getCachedData() {
    if (!(await fs.pathExists(CACHE_FILE))) return null;
    const { data, timestamp } = await fs.readJson(CACHE_FILE);
    if (Date.now() - timestamp < CACHE_TTL) {
        return data;
    }
    return null;
}

export async function setCachedData(data) {
    await fs.writeJson(CACHE_FILE, { data, timestamp: Date.now() });
}