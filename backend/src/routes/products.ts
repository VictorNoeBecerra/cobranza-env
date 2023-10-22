import { Router } from 'express';
import productsController from '../controllers/productsController';

class ProductsRouter{

    public router: Router = Router();

    constructor(){
        this.config();
    }

    config():void{
        this.router.get('/', productsController.list);         
        this.router.get('/top', productsController.getTopProducts);         
        this.router.post('/', productsController.create);
        this.router.put('/:id', productsController.update);
        this.router.delete('/:id', productsController.delete);
        this.router.get('/:id', productsController.search);
    }
}

const productsRouter = new ProductsRouter();
export default productsRouter.router;