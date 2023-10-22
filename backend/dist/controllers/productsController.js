"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database"));
class ProductsProduct {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            database_1.default.getConnection(function (err, connection) {
                if (err)
                    throw err; // not connected!
                connection.query('SELECT p.*, um.codigo as uM, g.description as grupod, f.codigo as familia, f.descripcion as tipo FROM products p INNER JOIN unidades_medida um ON p.um = um.id INNER JOIN grupos g ON p.grupo = g.id LEFT JOIN familias f ON g.familia = f.id', function (error, results, fields) {
                    var resR = results;
                    // console.log(resR);
                    res.json(resR);
                    connection.release();
                    if (error)
                        throw error;
                });
            });
        });
    }
    getTopProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            database_1.default.getConnection(function (err, connection) {
                if (err)
                    throw err; // not connected!
                const query = `SELECT  p.*,  sum(itm.ventaPz) AS vendido   FROM products p JOIN item_operacion itm ON p.code = itm.code group by p.code ORDER BY vendido DESC LIMIT 10;`;
                connection.query(query, function (error, results, fields) {
                    var resR = results;
                    res.json(resR);
                    connection.release();
                    if (error)
                        throw error;
                });
            });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var obj = req.body;
            //  console.log('Objeto que viene del body: ' + obj);
            database_1.default.getConnection(function (err, connection) {
                if (err)
                    throw err; // not connected!
                connection.query('INSERT INTO `products` set ?', [obj], function (error, results, fields) {
                    //  console.log('Consulta');
                    res.json(results);
                    connection.release();
                    if (error)
                        throw error;
                });
            });
        });
    }
    delete(req, res) {
        var id = req.params.id;
        //  console.log('Id del products a elliminar: ' + id);
        database_1.default.getConnection(function (err, connection) {
            if (err)
                throw err; // not connected!
            connection.query('DELETE FROM `products` WHERE `code` = ?', id, function (error, results, fields) {
                //  console.log('Borra');
                res.json(results);
                connection.release();
                if (error)
                    throw error;
            });
        });
    }
    search(req, res) {
        var id = req.params.id;
        database_1.default.getConnection(function (err, connection) {
            if (err)
                throw err; // not connected!
            connection.query('SELECT * FROM `products` where `code` = ?', id, function (error, results, fields) {
                var resR = results;
                //  console.log('busca');
                res.json(resR);
                connection.release();
                if (error)
                    throw error;
            });
        });
    }
    update(req, res) {
        var id = req.params.id;
        database_1.default.getConnection(function (err, connection) {
            if (err)
                throw err; // not connected!
            connection.query('UPDATE `products` SET ? WHERE `code` = ?', [req.body, req.params.id], function (error, results, fields) {
                if (error)
                    throw error;
                connection.query('SELECT * FROM `products` where `code` = ?', id, function (error2, results2, fields2) {
                    var resR = results2;
                    //  console.log('editado:');
                    res.json(resR);
                    connection.release();
                });
            });
        });
    }
}
const productsProduct = new ProductsProduct;
exports.default = productsProduct;
// data: req.body['status'] ? 'Connected' : 'Updated'            
