import { Request, Response } from 'express';
import pool from '../database';

class ItemOperationController {
    public async list(req: Request, res: Response): Promise<void> {
        pool.getConnection(function (err, connection) {            
            if (err) throw err; // not connected!
            connection.query('SELECT * FROM `item_operacion`', function (error, results, fields) {
                var resR:JSON = results;         
                   
                res.json(resR);
                connection.release();
                if (error) throw error;
            });
        });

    }
    public async listByOperacion(req: Request, res: Response): Promise<void> {
     // .log(req);
        
        pool.getConnection(function (err, connection) {            
            if (err) throw err; // not connected!
            connection.query('SELECT * FROM `item_operacion` tmo WHERE tmo.operacion = ?',[req.params.id], function (error, results, fields) {
                var resR:JSON = results;         
                   
                res.json(resR);
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
            connection.query('INSERT INTO `item_operacion` set ?',[obj], function (error, results, fields) {
             //  console.log('Consulta');
                res.json(results);
                connection.release();
                if (error) throw error;
            });
        });

    }
    public delete(req: Request, res: Response) {
        var id = req.params.id;
     //  console.log('Id del item_operacion a elliminar: '+id); 
        pool.getConnection(function (err, connection) {            
            if (err) throw err; // not connected!
            connection.query('DELETE FROM `item_operacion` WHERE `id` = ?',id, function (error, results, fields)  {
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
            connection.query('SELECT * FROM `item_operacion` where `id` = ?',id, function (error, results, fields) {
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
            connection.query('UPDATE `item_operacion` SET ? WHERE `id` = ?',[req.body,req.params.id], function (error, results, fields) {
                if (error) throw error;
                connection.query('SELECT * FROM `item_operacion` where `id` = ?',id, function (error2, results2, fields2){
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
export default itemOperationController;

// data: req.body['status'] ? 'Connected' : 'Updated'            