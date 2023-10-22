import { Router } from 'express';
import gruposController from '../controllers/gruposController';

class GruposRoutes{

    public router: Router = Router();

    constructor(){
        this.config();
    }

    config():void{
        this.router.get('/', gruposController.list);         
        this.router.post('/', gruposController.create);
        this.router.put('/:id', gruposController.update);
        this.router.delete('/:id', gruposController.delete);
        this.router.get('/:id', gruposController.search);
    }
}

const gruposRoutes = new GruposRoutes();
export default gruposRoutes.router;