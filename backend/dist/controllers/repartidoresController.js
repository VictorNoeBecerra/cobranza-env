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
const moment_1 = __importDefault(require("moment"));
moment_1.default.locale('es-mx');
class RepartidoresController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_1.default.getConnection(function (err, connection) {
                if (err)
                    throw err; // not connected!
                connection.query('SELECT * FROM repartidores re JOIN rutas ru ON ru.no_ruta = re.ruta', function (error, results, fields) {
                    var resR = results;
                    res.json(results);
                    connection.release();
                    if (error)
                        throw error;
                });
            });
        });
    }
    listAviables(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_1.default.getConnection(function (err, connection) {
                if (err)
                    throw err; // not connected!
                const query = `SELECT *
            FROM repartidores re
                JOIN rutas ru ON re.ruta = ru.no_ruta
            
            WHERE id NOT IN (
                SELECT re.id
                FROM operaciones o
                JOIN repartidores re ON o.repartidor = re.ruta
                JOIN rutas ru ON re.ruta = ru.no_ruta
                WHERE o.date > '${(0, moment_1.default)().format('YYYY-MM-DD')}'
                GROUP BY re.id
            );`;
                connection.query(query, function (error, results, fields) {
                    var resR = results;
                    res.json(results);
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
                connection.query('INSERT INTO `repartidores` set ?', [obj], function (error, results, fields) {
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
        //  console.log('Id del repartidores a elliminar: '+id); 
        database_1.default.getConnection(function (err, connection) {
            if (err)
                throw err; // not connected!
            connection.query('DELETE FROM `repartidores` WHERE `id` = ?', id, function (error, results, fields) {
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
            connection.query('SELECT * FROM `repartidores` re  JOIN `rutas` ru ON ru.no_ruta = re.ruta WHERE `id` = ?', id, function (error, results, fields) {
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
            connection.query('UPDATE `repartidores` SET ? WHERE `id` = ?', [req.body, req.params.id], function (error, results, fields) {
                if (error)
                    throw error;
                connection.query('SELECT * FROM `repartidores` where `id` = ?', id, function (error2, results2, fields2) {
                    var resR = results2;
                    //  console.log('editado:');
                    res.json(resR);
                    connection.release();
                });
            });
        });
    }
}
const repartidoresController = new RepartidoresController;
exports.default = repartidoresController;
// data: req.body['status'] ? 'Connected' : 'Updated'            
