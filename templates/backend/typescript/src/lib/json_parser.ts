import path from 'path';
import fs from 'fs';

export default function jsonParser (jsonName: string){
    const jsonPath: string = path.resolve(__dirname, '..', 'config', jsonName);
    const jsonParsed: any = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    return jsonParsed;
}