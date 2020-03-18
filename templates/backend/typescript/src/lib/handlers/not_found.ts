
import { Response, Request, NextFunction } from 'express';

const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
    return res.status(404).send({ error: `${req.path} was not found` });
};


export default notFoundHandler;