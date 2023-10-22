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
class ItemOperationController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            database_1.default.getConnection(function (err, connection) {
                if (err)
                    throw err; // not connected!
                connection.query('SELECT * FROM `item_operacion`', function (error, results, fields) {
                    var resR = results;
                    res.json(resR);
                    connection.release();
                    if (error)
                        throw error;
                });
            });
        });
    }
    listByOperacion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // .log(req);
            database_1.default.getConnection(function (err, connection) {
                if (err)
                    throw err; // not connected!
                connection.query('SELECT * FROM `item_operacion` tmo WHERE tmo.operacion = ?', [req.params.id], function (error, results, fields) {
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
            //  console.log('Objeto que viene del body: '+obj); 
            database_1.default.getConnection(function (err, connection) {
                if (err)
                    throw err; // not connected!
                connection.query('INSERT INTO `item_operacion` set ?', [obj], function (error, results, fields) {
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
        //  console.log('Id del item_operacion a elliminar: '+id); 
        database_1.default.getConnection(function (err, connection) {
            if (err)
                throw err; // not connected!
            connection.query('DELETE FROM `item_operacion` WHERE `id` = ?', id, function (error, results, fields) {
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
            connection.query('SELECT * FROM `item_operacion` where `id` = ?', id, function (error, results, fields) {
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
            connection.query('UPDATE `item_operacion` SET ? WHERE `id` = ?', [req.body, req.params.id], function (error, results, fields) {
                if (error)
                    throw error;
                connection.query('SELECT * FROM `item_operacion` where `id` = ?', id, function (error2, results2, fields2) {
                    var resR = results2;
                    //  console.log('editado:');
                    res.json(resR);
                    connection.release();
                });
            });
        });
    }
}
const itemOperationController = new ItemOperationController;
exports.default = itemOperationController;
// data: req.body['status'] ? 'Connected' : 'Updated'            
