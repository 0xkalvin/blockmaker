
import objectStorageService from '../../services/object_storage'

export default async function storeMultipleFilesInParallel (files: Array<any>) : Promise<any> {
    return await Promise.all(files.map(async (file, i) => {
        const metaData = await objectStorageService.storeFile(file.buffer, file.originalname);
        return {
            id: metaData.id,
            key: metaData.key,
            hash: metaData.hash,
            fileName: metaData.fileName
        };
    }))
}