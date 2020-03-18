import crypto from 'crypto';

const hash = (data: Buffer) => {
    return crypto.createHash('sha256').update(data).digest('hex');
};

export default hash;