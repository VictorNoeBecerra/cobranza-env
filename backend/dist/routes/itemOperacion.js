"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const itemOperationController_1 = __importDefault(require("../controllers/itemOperationController"));
class ItemOperationRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', itemOperationController_1.default.list);
        this.router.get('/byOperacion/:id', itemOperationController_1.default.listByOperacion);
        this.router.post('/', itemOperationController_1.default.create);
        this.router.put('/:id', itemOperationController_1.default.update);
        this.router.delete('/:id', itemOperationController_1.default.delete);
        this.router.get('/:id', itemOperationController_1.default.search);
    }
}
const itemOperationRouter = new ItemOperationRouter();
exports.default = itemOperationRouter.router;
