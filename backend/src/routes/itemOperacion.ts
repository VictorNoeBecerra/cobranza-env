import { Router } from 'express';
import itemOperationController from '../controllers/itemOperationController';

class ItemOperationRouter{

    public router: Router = Router();

    constructor(){
        this.config();
    }

    config():void{
        this.router.get('/', itemOperationController.list);         
        this.router.get('/byOperacion/:id', itemOperationController.listByOperacion);         
        this.router.post('/', itemOperationController.create);
        this.router.put('/:id', itemOperationController.update);
        this.router.delete('/:id', itemOperationController.delete);
        this.router.get('/:id', itemOperationController.search);
    }
}

const itemOperationRouter = new ItemOperationRouter();
export default itemOperationRouter.router;