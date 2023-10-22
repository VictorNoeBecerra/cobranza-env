import { Router } from 'express';
import unidadesMedidaController from '../controllers/unidadesMedidaController';

class UnidadesMedidaRouter{

    public router: Router = Router();

    constructor(){
        this.config();
    }

    config():void{
        this.router.get('/', unidadesMedidaController.list);         
        this.router.post('/', unidadesMedidaController.create);
        this.router.put('/:id', unidadesMedidaController.update);
        this.router.delete('/:id', unidadesMedidaController.delete);
        this.router.get('/:id', unidadesMedidaController.search);
    }
}

const unidadesMedidaRouter = new UnidadesMedidaRouter();
export default unidadesMedidaRouter.router;