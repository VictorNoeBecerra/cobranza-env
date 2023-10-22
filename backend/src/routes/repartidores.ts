import { Router } from 'express';
import repartidoresController from '../controllers/repartidoresController';

class RepartidoresRouter{

    public router: Router = Router();

    constructor(){
        this.config();
    }

    config():void{
        this.router.get('/', repartidoresController.list);         
        this.router.get('/aviables', repartidoresController.listAviables);         
        this.router.post('/', repartidoresController.create);
        this.router.put('/:id', repartidoresController.update);
        this.router.delete('/:id', repartidoresController.delete);
        this.router.get('/:id', repartidoresController.search);
    }
}

const repartidoresRouter = new RepartidoresRouter();
export default repartidoresRouter.router;