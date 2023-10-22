import { Router } from 'express';
import operationesController from '../controllers/operationsController';

class OperationsRouter{

    public router: Router = Router();

    constructor(){
        this.config();
    }

    config():void{
        this.router.get('/', operationesController.list);         
        this.router.get('/totales', operationesController.getTotales);         
        this.router.get('/ventas', operationesController.getResumeVentas);         
        this.router.get('/cobros', operationesController.getResumeCobros);         

        this.router.post('/', operationesController.create);
        this.router.post('/complete', operationesController.createComplete);
        this.router.put('/:id', operationesController.update);
        this.router.put('/complete/:id', operationesController.updateComplete);

        this.router.delete('/:id', operationesController.delete);
        this.router.get('/ruta', operationesController.searchByRutaRange);
        this.router.get('/report', operationesController.dataReportRuta);
        this.router.get('/ruta/count', operationesController.searchByRutaRangeCount);
        this.router.get('/:id', operationesController.searchId);
    }
}

const operationsRouter = new OperationsRouter();
export default operationsRouter.router;