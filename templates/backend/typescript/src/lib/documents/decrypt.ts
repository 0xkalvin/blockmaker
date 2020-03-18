import crypto from 'crypto';

const decrypt = (encrytedPayload: any, key: string) : Promise<Object> => {
    return new Promise<Object>((resolve, reject) => {
        const algorithm = 'aes-256-ctr';
        // Get the initialization vector
        const iv = encrytedPayload.slice(0, 16);
        // Get the rest
        const encryptedData = encrytedPayload.slice(16);
        // Create a decipher
        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        // Actually decrypt it
        const decryptedData = Buffer.concat([decipher.update(encryptedData), decipher.final()]);

        resolve(decryptedData);
    })
};


export default decrypt;