"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const repartidoresController_1 = __importDefault(require("../controllers/repartidoresController"));
class RepartidoresRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', repartidoresController_1.default.list);
        this.router.get('/aviables', repartidoresController_1.default.listAviables);
        this.router.post('/', repartidoresController_1.default.create);
        this.router.put('/:id', repartidoresController_1.default.update);
        this.router.delete('/:id', repartidoresController_1.default.delete);
        this.router.get('/:id', repartidoresController_1.default.search);
    }
}
const repartidoresRouter = new RepartidoresRouter();
exports.default = repartidoresRouter.router;
