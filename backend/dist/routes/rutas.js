"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rutasController_1 = __importDefault(require("../controllers/rutasController"));
class RepartidoresRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', rutasController_1.default.list);
        this.router.post('/', rutasController_1.default.create);
        this.router.put('/:id', rutasController_1.default.update);
        this.router.delete('/:id', rutasController_1.default.delete);
        this.router.get('/:id', rutasController_1.default.search);
    }
}
const rutasRouter = new RepartidoresRouter();
exports.default = rutasRouter.router;
