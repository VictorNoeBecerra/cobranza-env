"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const factoresConversion_1 = __importDefault(require("../controllers/factoresConversion"));
class FactoresConversionRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', factoresConversion_1.default.list);
        this.router.post('/', factoresConversion_1.default.create);
        this.router.put('/:id', factoresConversion_1.default.update);
        this.router.delete('/:id', factoresConversion_1.default.delete);
        this.router.get('/:id', factoresConversion_1.default.search);
    }
}
const factoresConversionRoutes = new FactoresConversionRoutes();
exports.default = factoresConversionRoutes.router;
