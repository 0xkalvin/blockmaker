import { S3 } from 'ibm-cos-sdk';

import jsonParser from '../lib/json_parser';
import { OBJECT_STORAGE_CREDENTIALS, BUCKET_NAME } from '../config';

import hash from '../lib/documents/hash';
import encrypt from '../lib/documents/encrypt';
import decrypt from '../lib/documents/decrypt';

const credentials = jsonParser(OBJECT_STORAGE_CREDENTIALS)

const config = {
    endpoint: credentials.endpoints,
    apiKeyId: credentials.apikey,
    serviceInstanceId: credentials.resource_instance_id,
};

const s3 = new S3(config);


const storeFile = async (buffer: Buffer, fileName: string): Promise<any> => {
    return new Promise<any>(async (resolve, reject) => {

        const fileNameFormatted: string = fileName.replace(/\s/g, "").toLowerCase();

        const { encryptedData, key } = await encrypt(buffer, fileName);

        const params = {
            Bucket: BUCKET_NAME,
            Key: JSON.stringify(Date.now()),
            Body: encryptedData,
            Metadata: {
                'name': fileNameFormatted.split('.')[0],
                'extension': fileNameFormatted.split('.')[1],
                'checksum': hash(buffer)
            }
        }
        s3.upload(params).promise()
            .then((data) => {
                resolve({
                    message: `File was stored at ${data.Location}`,
                    id: params.Key,
                    hash: params.Metadata.checksum,
                    key,
                    fileName: params.Metadata.name + '.' + params.Metadata.extension
                })
            })
            .catch(reject)
    })
}

const downloadFile = async (fileId: string, fileKey: string) => {
    return new Promise(async (resolve, reject) => {

        const params = {
            Bucket: BUCKET_NAME,
            Key: fileId
        };

        s3.getObject(params).promise()
            .then(async (data: any) => {

                const body: any = data.Body;

                const decryptedDocument = await decrypt(body, fileKey);
                const decryptedDocumentAsBuffer = Buffer.from(decryptedDocument);

                const fileName = data.Metadata.name + '.' + data.Metadata.extension;
                const checksum = hash(decryptedDocumentAsBuffer);

                if (checksum === data.Metadata.checksum) {
                    resolve({ fileName, file: decryptedDocumentAsBuffer });
                } else {
                    reject(new Error(`Invalid checksum for document ${fileId}`));
                }
            })
            .catch(reject)
    })
}

export default {
    storeFile,
    downloadFile,
}