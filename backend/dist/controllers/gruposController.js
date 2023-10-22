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
class GruposController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            database_1.default.getConnection(function (err, connection) {
                connection.query('SELECT * FROM `grupos`', function (error, results, fields) {
                    const resR = results;
                    res.json(resR);
                    connection.release();
                    if (error != null)
                        throw error;
                });
            });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const obj = req.body;
            //  console.log('Objeto que viene del body: ', obj)
            database_1.default.getConnection(function (err, connection) {
                if (err)
                    throw err; // not connected!
                connection.query('INSERT INTO `grupos` set ?', [obj], function (error, results, fields) {
                    //  console.log('Consulta')
                    res.json(results);
                    connection.release();
                    if (error != null)
                        throw error;
                });
            });
        });
    }
    delete(req, res) {
        const id = req.params.id;
        //  console.log('Id del grupos a elliminar: ' + id)
        database_1.default.getConnection(function (err, connection) {
            if (err)
                throw err; // not connected!
            connection.query('DELETE FROM `grupos` WHERE `id` = ?', id, function (error, results, fields) {
                //  console.log('Borra')
                res.json(results);
                connection.release();
                if (error != null)
                    throw error;
            });
        });
    }
    search(req, res) {
        const id = req.params.id;
        database_1.default.getConnection(function (err, connection) {
            if (err)
                throw err; // not connected!
            connection.query('SELECT * FROM `grupos` where `id` = ?', id, function (error, results, fields) {
                const resR = results;
                //  console.log('busca')
                res.json(resR);
                connection.release();
                if (error != null)
                    throw error;
            });
        });
    }
    update(req, res) {
        const id = req.params.id;
        database_1.default.getConnection(function (err, connection) {
            if (err)
                throw err; // not connected!
            connection.query('UPDATE `grupos` SET ? WHERE `id` = ?', [req.body, req.params.id], function (error, results, fields) {
                if (error != null)
                    throw error;
                connection.query('SELECT * FROM `grupos` where `id` = ?', id, function (error2, results2, fields2) {
                    const resR = results2;
                    //  console.log('editado:')
                    res.json(resR);
                    connection.release();
                });
            });
        });
    }
}
const gruposController = new GruposController();
exports.default = gruposController;
// data: req.body['status'] ? 'Connected' : 'Updated'
