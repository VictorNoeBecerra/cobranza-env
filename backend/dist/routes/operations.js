"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const operationsController_1 = __importDefault(require("../controllers/operationsController"));
class OperationsRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', operationsController_1.default.list);
        this.router.get('/totales', operationsController_1.default.getTotales);
        this.router.get('/ventas', operationsController_1.default.getResumeVentas);
        this.router.get('/cobros', operationsController_1.default.getResumeCobros);
        this.router.post('/', operationsController_1.default.create);
        this.router.post('/complete', operationsController_1.default.createComplete);
        this.router.put('/:id', operationsController_1.default.update);
        this.router.put('/complete/:id', operationsController_1.default.updateComplete);
        this.router.delete('/:id', operationsController_1.default.delete);
        this.router.get('/ruta', operationsController_1.default.searchByRutaRange);
        this.router.get('/report', operationsController_1.default.dataReportRuta);
        this.router.get('/ruta/count', operationsController_1.default.searchByRutaRangeCount);
        this.router.get('/:id', operationsController_1.default.searchId);
    }
}
const operationsRouter = new OperationsRouter();
exports.default = operationsRouter.router;
