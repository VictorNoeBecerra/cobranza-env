/* eslint-disable n/handle-callback-err */
import { Request, Response } from 'express'
import pool from '../database'

class GruposController {
  public async list (req: Request, res: Response): Promise<void> {
    pool.getConnection(function (err, connection) {
      connection.query('SELECT * FROM `grupos`', function (error, results, fields) {
        const resR: JSON = results
        res.json(resR)
        connection.release()
        if (error != null) throw error
      })
    })
  }

  public async create (req: Request, res: Response): Promise<void> {
    const obj = req.body
 //  console.log('Objeto que viene del body: ', obj)
    pool.getConnection(function (err, connection) {
      if (err) throw err // not connected!
      connection.query('INSERT INTO `grupos` set ?', [obj], function (error, results, fields) {
     //  console.log('Consulta')
        res.json(results)
        connection.release()
        if (error != null) throw error
      })
    })
  }

  public delete (req: Request, res: Response) {
    const id = req.params.id
 //  console.log('Id del grupos a elliminar: ' + id)
    pool.getConnection(function (err, connection) {
      if (err) throw err // not connected!
      connection.query('DELETE FROM `grupos` WHERE `id` = ?', id, function (error, results, fields) {
     //  console.log('Borra')
        res.json(results)
        connection.release()
        if (error != null) throw error
      })
    })
  }

  public search (req: Request, res: Response) {
    const id = req.params.id
    pool.getConnection(function (err, connection) {
      if (err) throw err // not connected!
      connection.query('SELECT * FROM `grupos` where `id` = ?', id, function (error, results, fields) {
        const resR = results
     //  console.log('busca')
        res.json(resR)
        connection.release()
        if (error != null) throw error
      })
    })
  }

  public update (req: Request, res: Response) {
    const id = req.params.id
    pool.getConnection(function (err, connection) {
      if (err) throw err // not connected!
      connection.query('UPDATE `grupos` SET ? WHERE `id` = ?', [req.body, req.params.id], function (error, results, fields) {
        if (error != null) throw error
        connection.query('SELECT * FROM `grupos` where `id` = ?', id, function (error2, results2, fields2) {
          const resR = results2
       //  console.log('editado:')
          res.json(resR)
          connection.release()
        })
      })
    })
  }
}
const gruposController = new GruposController()
export default gruposController

// data: req.body['status'] ? 'Connected' : 'Updated'
