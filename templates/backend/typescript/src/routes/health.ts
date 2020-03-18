import { Router, Response, Request, NextFunction } from 'express';

const router: Router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ message: `Up and kicking`})
});

export default router;