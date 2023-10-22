import { Request, Response } from 'express';
import pool from '../database';
import moment from 'moment'
moment.locale('es-mx')

class RepartidoresController {
    public async list(req: Request, res: Response): Promise<void> {
        return pool.getConnection(function (err, connection) {            
            if (err) throw err; // not connected!
            connection.query('SELECT * FROM repartidores re JOIN rutas ru ON ru.no_ruta = re.ruta', function (error, results, fields) {
                var resR:JSON = results;        
                res.json(results);
                connection.release();
                if (error) throw error;
            });
        });

    }
    public async listAviables(req: Request, res: Response): Promise<void> {
        return pool.getConnection(function (err, connection) {            
            if (err) throw err; // not connected!
            const query = `SELECT *
            FROM repartidores re
                JOIN rutas ru ON re.ruta = ru.no_ruta
            
            WHERE id NOT IN (
                SELECT re.id
                FROM operaciones o
                JOIN repartidores re ON o.repartidor = re.ruta
                JOIN rutas ru ON re.ruta = ru.no_ruta
                WHERE o.date > '${moment().format('YYYY-MM-DD')}'
                GROUP BY re.id
            );`;
            connection.query(query, function (error, results, fields) {
                var resR:JSON = results;
                res.json(results);
                connection.release();
                if (error) throw error;
            });
        });

    }
    public async create(req: Request, res: Response): Promise<void> {
        var obj = req.body; 
     //  console.log('Objeto que viene del body: '+obj); 
        pool.getConnection(function (err, connection) {            
            if (err) throw err; // not connected!
            connection.query('INSERT INTO `repartidores` set ?',[obj], function (error, results, fields) {
             //  console.log('Consulta');
                res.json(results);
                connection.release();
                if (error) throw error;
            });
        });

    }
    public delete(req: Request, res: Response) {
        var id = req.params.id;
     //  console.log('Id del repartidores a elliminar: '+id); 
        pool.getConnection(function (err, connection) {            
            if (err) throw err; // not connected!
            connection.query('DELETE FROM `repartidores` WHERE `id` = ?',id, function (error, results, fields)  {
             //  console.log('Borra');
                res.json(results);
                connection.release();
                if (error) throw error;
            });
        });

    }
   
    public search(req: Request, res: Response) {
        var id = req.params.id;
        pool.getConnection(function (err, connection) {            
            if (err) throw err; // not connected!
            connection.query('SELECT * FROM `repartidores` re  JOIN `rutas` ru ON ru.no_ruta = re.ruta WHERE `id` = ?',id, function (error, results, fields) {
                var resR = results;         
             //  console.log('busca');
                res.json(resR);
                connection.release();
                if (error) throw error;
            });
        });
    }
    public update(req: Request, res: Response) {
        var id = req.params.id;
        pool.getConnection(function (err, connection) {            
            if (err) throw err; // not connected!
            connection.query('UPDATE `repartidores` SET ? WHERE `id` = ?',[req.body,req.params.id], function (error, results, fields) {
                if (error) throw error;
                connection.query('SELECT * FROM `repartidores` where `id` = ?',id, function (error2, results2, fields2){
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
export default repartidoresController;

// data: req.body['status'] ? 'Connected' : 'Updated'            