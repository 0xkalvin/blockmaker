
import { Response, Request, NextFunction } from 'express';

import httpError from '../../models/http_error';

const errorHandler = (err: httpError, req: Request, res: Response, next: NextFunction) => {
    console.error(err);

    const status = err.status || 500;
    const message = err.message || `Something went wrong`;

    return res.status(status).send({ error: message });
};

export default errorHandler;