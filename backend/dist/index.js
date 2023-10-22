"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const grupos_1 = __importDefault(require("./routes/grupos"));
const factoresConversion_1 = __importDefault(require("./routes/factoresConversion"));
const familias_1 = __importDefault(require("./routes/familias"));
const itemOperacion_1 = __importDefault(require("./routes/itemOperacion"));
const index_1 = __importDefault(require("./routes/index"));
const operations_1 = __importDefault(require("./routes/operations"));
const products_1 = __importDefault(require("./routes/products"));
const repartidores_1 = __importDefault(require("./routes/repartidores"));
const unidadesMedida_1 = __importDefault(require("./routes/unidadesMedida"));
const rutas_1 = __importDefault(require("./routes/rutas"));
// import indexRoutes from './routes/indexRoutes';
// import relaysRoutes from './routes/relaysRoutes';
// import grupos from './routes/grupos';;
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.config();
        this.routes();
    }
    config() {
        this.app.set('port', process.env.PORT || 3000);
        this.app.use((0, morgan_1.default)('dev'));
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
    }
    routes() {
        this.app.use('/', index_1.default);
        this.app.use('/factores_conversion', factoresConversion_1.default);
        this.app.use('/familias', familias_1.default);
        this.app.use('/grupos', grupos_1.default);
        this.app.use('/item_operacion', itemOperacion_1.default);
        this.app.use('/operations', operations_1.default);
        this.app.use('/productos', products_1.default);
        this.app.use('/repartidores', repartidores_1.default);
        this.app.use('/rutas', rutas_1.default);
        this.app.use('/um', unidadesMedida_1.default);
    }
    start() {
        console.log('Starting');
        try {
            this.app.listen(this.app.get('port'), () => {
                console.log(`Listening on puerto marrano: `, this.app.get('port'));
            });
        }
        catch (error) {
            console.log('nose pudo', error);
        }
    }
}
const server = new Server();
server.start();
