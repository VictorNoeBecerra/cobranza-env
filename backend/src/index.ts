    import express, {Application} from 'express';
import morgan from 'morgan';
import cors from 'cors';
import grupos from './routes/grupos';
import factoresConversion from './routes/factoresConversion';
import familias from './routes/familias';
import itemOperacion from './routes/itemOperacion';
import index from './routes/index';
import operations from './routes/operations';
import products from './routes/products';
import repartidores from './routes/repartidores';
import unidadesMedida from './routes/unidadesMedida';
import rutas from './routes/rutas';


// import indexRoutes from './routes/indexRoutes';
// import relaysRoutes from './routes/relaysRoutes';
// import grupos from './routes/grupos';;

class Server {     
    public app: Application;
    constructor(){
        this.app = express();
        this.config();
        this.routes();
    }

    config():void{
        this.app.set('port', process.env.PORT || 3000);
        this.app.use(morgan('dev'));
        this.app.use(cors({
            origin: '*',
            optionsSuccessStatus: 200 // For legacy browser support
        }));
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended:false}));
    }
    routes():void{
        this.app.use('/', index);
        this.app.use('/factores_conversion', factoresConversion );
        this.app.use('/familias', familias);
        this.app.use('/grupos', grupos);
        this.app.use('/item_operacion', itemOperacion);
        this.app.use('/operations', operations);
        this.app.use('/productos', products);
        this.app.use('/repartidores', repartidores);
        this.app.use('/rutas', rutas);
        this.app.use('/um', unidadesMedida);
        
    }
    start():void{
        
        console.log('Starting');
        try {
            this.app.listen(this.app.get('port'), ()=>{
                console.log(`Listening on puerto marrano: `, this.app.get('port'));         
            });            
        } catch (error) {
            console.log('nose pudo',error);
        }
    }
}

const server = new Server();
server.start();