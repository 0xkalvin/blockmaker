import multer from 'multer';

const multerStorage = multer.memoryStorage();
const filesParser = multer({ storage: multerStorage }).array('files');


export default filesParser
