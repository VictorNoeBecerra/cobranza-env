import { Router } from 'express';
import factoresConversion from '../controllers/factoresConversion';

class FactoresConversionRoutes{

    public router: Router = Router();

    constructor(){
        this.config();
    }

    config():void{
        this.router.get('/', factoresConversion.list);         
        this.router.post('/', factoresConversion.create);
        this.router.put('/:id', factoresConversion.update);
        this.router.delete('/:id', factoresConversion.delete);
        this.router.get('/:id', factoresConversion.search);
    }
}

const factoresConversionRoutes = new FactoresConversionRoutes();
export default factoresConversionRoutes.router;