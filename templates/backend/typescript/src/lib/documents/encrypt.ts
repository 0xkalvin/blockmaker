import crypto from 'crypto';
import { v3 as uuidv3, v1 as uuidv1 } from 'uuid';


const generateUniqueKey = (fileName: string) : string => {
    const uuid = uuidv3(fileName, uuidv1());
    const key = crypto.createHash('sha256').update(String(uuid)).digest('base64').substr(0, 32);
    return key;
};

const encrypt = (buffer: Buffer, fileName: string) : Promise<any> => {
    return new Promise<any>(async(resolve, reject) => {
        // Which algorithm to use for encryption
        const algorithm = 'aes-256-ctr';
        // Generate an unique key
        const key = generateUniqueKey(fileName);
        // Create an initialization vector
        const iv = crypto.randomBytes(16);
        // Create a new cipher using the algorithm, key, and iv
        const cipher = crypto.createCipheriv(algorithm, key, iv);
        // Create the new (encrypted) buffer
        const encryptedData = Buffer.concat([iv, cipher.update(buffer), cipher.final()]);
        
        resolve({ encryptedData, key });
    })
};

export default encrypt;