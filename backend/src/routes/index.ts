import { Router, Request, Response } from 'express';

class IndexRoutes {
    public router: Router = Router();
    constructor() {
        this.config();
    }

    config(): void {
        this.router.get('', (req: Request, res: Response) => {
            console.log("IndexController")
            res.json({ 'status': 'connected' });
        });
    }
}

const indexRoutes = new IndexRoutes();
export default indexRoutes.router;
