import fs from 'node:fs/promises';

export default async function readModel() {
    try {
        const path = new URL('../data/sucrose-model-v2.json',import.meta.url);
        const data = await fs.readFile(path,'utf-8');
        return await JSON.parse(data);
    } catch (error) {
        return error.message;
    }
}


