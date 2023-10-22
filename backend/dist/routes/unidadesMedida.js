"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const unidadesMedidaController_1 = __importDefault(require("../controllers/unidadesMedidaController"));
class UnidadesMedidaRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', unidadesMedidaController_1.default.list);
        this.router.post('/', unidadesMedidaController_1.default.create);
        this.router.put('/:id', unidadesMedidaController_1.default.update);
        this.router.delete('/:id', unidadesMedidaController_1.default.delete);
        this.router.get('/:id', unidadesMedidaController_1.default.search);
    }
}
const unidadesMedidaRouter = new UnidadesMedidaRouter();
exports.default = unidadesMedidaRouter.router;
