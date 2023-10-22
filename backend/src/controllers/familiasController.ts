import { Request, Response } from 'express';
import pool from '../database';

class FamiliasController {
    public async list(req: Request, res: Response): Promise<void> {
        pool.getConnection(function (err, connection) {            
            if (err) throw err; // not connected!
            connection.query('SELECT * FROM `familias`', function (error, results, fields) {
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
            connection.query('INSERT INTO `familias` set ?',[obj], function (error, results, fields) {
             //  console.log('Consulta');
                res.json(results);
                connection.release();
                if (error) throw error;
            });
        });

    }
    public delete(req: Request, res: Response) {
        var id = req.params.id;
     //  console.log('Id del familias a elliminar: '+id); 
        pool.getConnection(function (err, connection) {            
            if (err) throw err; // not connected!
            connection.query('DELETE FROM `familias` WHERE `id` = ?',id, function (error, results, fields)  {
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
            connection.query('SELECT * FROM `familias` where `id` = ?',id, function (error, results, fields) {
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
            connection.query('UPDATE `familias` SET ? WHERE `id` = ?',[req.body,req.params.id], function (error, results, fields) {
                if (error) throw error;
                connection.query('SELECT * FROM `familias` where `id` = ?',id, function (error2, results2, fields2){
                    var resR = results2;         
                 //  console.log('editado:');
                    res.json(resR);
                    connection.release();
                });
            });
        });
    }
}
const familiasController = new FamiliasController;
export default familiasController;

// data: req.body['status'] ? 'Connected' : 'Updated'            