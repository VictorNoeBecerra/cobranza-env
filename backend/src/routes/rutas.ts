import { Router } from 'express';
import rutasController from '../controllers/rutasController';

class RepartidoresRouter{

    public router: Router = Router();

    constructor(){
        this.config();
    }

    config():void{
        this.router.get('/', rutasController.list);         
        this.router.post('/', rutasController.create);
        this.router.put('/:id', rutasController.update);
        this.router.delete('/:id', rutasController.delete);
        this.router.get('/:id', rutasController.search);
    }
}

const rutasRouter = new RepartidoresRouter();
export default rutasRouter.router;