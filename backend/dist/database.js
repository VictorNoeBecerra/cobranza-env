"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = __importDefault(require("mysql"));
const keys_1 = __importDefault(require("./keys"));
// import { prependOnceListener } from 'cluster';
// import { json } from 'body-parser';
var pool = mysql_1.default.createPool(keys_1.default.database);
// var game1 = {
//   'title':'Underground2',
//   'descripcion':'carreras',
//   'image':'Porno.img'
// }
pool.getConnection(function (err, connection) {
    if (err)
        throw err; // not connected!
    // Use the connection
    connection.query('SELECT NOW();', function (error, results, fields) {
        console.log(`Base De datos Conectada: `, results[0]['NOW()']);
        if (error)
            throw error;
    });
});
exports.default = pool;
/*
connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
        if (error) throw error;
        console.log('The solution is: ', results[0].solution);
      });
      */ 
