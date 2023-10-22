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
moment_1.default.updateLocale("es-mx", {
    week: {
        dow: 6,
        doy: 8 // First week of year must contain 1 January (7 + 6 - 1)
    }
});
const _f = 'YYYY-MM-DD';
class OperationsController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            database_1.default.getConnection(function (err, connection) {
                if (err)
                    throw err; // not connected!
                connection.beginTransaction(function (err) {
                    if (err) {
                        throw err; // No se pudo iniciar la transacción
                    }
                    //  console.log(moment().startOf('week').format('YYYY-MM-DD'), moment().add(1,'days').format('YYYY-MM-DD'));
                    connection.query(`SELECT *
          FROM operaciones ORDER BY operaciones.date DESC`, function (error, results, fields) {
                        if (error)
                            return connection.rollback(function () { throw error; }); // Ocurrió un error al ejecutar la consulta INSERT en la tabla 'operaciones'
                        //  console.log('Consulta 1', results);
                        let query = `SELECT o.id as id_operacion, itm.id AS item_id, itm.code, p.description as nombreProducto, p.precio_compra AS precio_compra, p.precio_lista AS precio_lista, itm.sCj, itm.sPz, itm.sTotalPz, itm.rCj, itm.rPz, itm.rTotalPz, itm.ventaPz, itm.saldo, ru.descripcion as zona, fc.cantidad AS mls 
          FROM operaciones o 
          INNER JOIN item_operacion itm ON o.id = itm.operacion
          LEFT JOIN rutas ru ON ru.no_ruta = o.repartidor 
          LEFT JOIN repartidores re ON re.ruta = ru.no_ruta 
          JOIN products p ON itm.code = p.code
          JOIN unidades_medida um ON p.um = um.id 
          LEFT JOIN factores_conversion fc ON um.id = fc.um`;
                        //  console.log(query);
                        connection.query(query, function (error, results2, fields) {
                            if (error) {
                                return connection.rollback(function () {
                                    throw error; // Ocurrió un error al ejecutar la primera consulta INSERT en la tabla 'item_operacion'
                                });
                            }
                            connection.commit(function (err) {
                                if (err) {
                                    return connection.rollback(function () {
                                        throw err; // No se pudo confirmar la transacción
                                    });
                                }
                                let operationsFormated = results;
                                let itemsFormated = results2;
                                // console.log(operationsFormated);
                                operationsFormated.forEach(o => {
                                    o.items = itemsFormated.filter(i => i.id_operacion === o.id);
                                    o.totalMl = o.items.map(s => s.mls * s.ventaPz).reduce((a, z) => {
                                        return a + z;
                                    }, 0);
                                });
                                res.json(operationsFormated);
                                connection.release(); // Liberar la conexión
                            });
                        });
                    });
                });
            });
        });
    }
    getTotales(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            database_1.default.getConnection(function (err, connection) {
                if (err)
                    throw err; // not connected! 
                const query = `SELECT SUM(o.cobro) as cobros, SUM(o.utilidad) as utilidad, SUM(o.comision) as comision, ((p.content * fc.cantidad) * i.ventaPz)/1000 AS klts
FROM
    repartidores re
        JOIN
    rutas ru ON re.ruta = ru.no_ruta
        JOIN
    operaciones o ON o.repartidor = re.ruta
        JOIN
    item_operacion i ON i.operacion = o.id
        INNER JOIN
    products p ON i.code = p.code
        JOIN
    unidades_medida um ON p.um = um.id
        LEFT JOIN
    factores_conversion fc ON um.id = fc.um WHERE DATE(date) = CURRENT_DATE()`;
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
    getResumeVentas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { weekDesfase } = req.query;
            const baseDate = (0, moment_1.default)().subtract((Number(weekDesfase) || 0), 'weeks');
            const start = baseDate.startOf('week').format(_f), end = baseDate.endOf('week').format(_f);
            // console.log(start, end)
            database_1.default.getConnection(function (err, connection) {
                if (err)
                    throw err;
                const query = `SELECT
      no_ruta,
      dte,
      cobro,
      SUM(klt) AS total_klt
  FROM (
      SELECT
          r.no_ruta,
          op.id AS operacion_id,
          op.cobro,
          itm.id AS item_id,
          DATE(op.date) AS dte,
          ((fc.cantidad * p.content) * itm.ventaPz) / 1000 AS klt
      FROM
          rutas r
      JOIN operaciones op ON op.repartidor = r.no_ruta
          JOIN item_operacion itm ON itm.operacion = op.id
          JOIN products p ON itm.code = p.code
          JOIN unidades_medida um ON um.id = p.um
          JOIN factores_conversion fc ON um.id = fc.um
      WHERE
          DATE(op.date) BETWEEN '${start}' AND '${end}'  
  ) AS subquery
  GROUP BY
      no_ruta,  dte
  ORDER BY
      dte, no_ruta ASC`;
                // console.log(query);
                connection.query(query, function (error, results, fields) {
                    var resR = results;
                    // console.log('RESP');
                    res.json(resR);
                    connection.release();
                    if (error)
                        throw error;
                });
            });
        });
    }
    getResumeCobros(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            database_1.default.getConnection(function (err, connection) {
                if (err)
                    throw err; // not connected!
                const query2 = `SELECT o.repartidor,
    DATE(o.date) AS DATE,
    SUM(o.cobro) AS cobro,
    SUM(o.utilidad) AS utilidad,
    SUM(o.comision) AS comisiones,
    SUM(o.costos) AS costos
        FROM
        operaciones o WHERE DATE(o.date) BETWEEN '${(0, moment_1.default)().startOf('week').format('YYYY-MM-DD')}' AND '${(0, moment_1.default)().add(1, 'days').format('YYYY-MM-DD')}' GROUP BY o.date, o.repartidor;`;
                // console.log('Query cobros: ', query2);
                connection.query(query2, function (error, results, fields) {
                    var resR = results;
                    // console.log(results);
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
                connection.query('INSERT INTO `operaciones` set ?', [obj], function (error, results, fields) {
                    //  console.log('Consulta');
                    res.json(results);
                    connection.release();
                    if (error)
                        throw error;
                });
            });
        });
    }
    createComplete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const obj = req.body;
            try {
                database_1.default.getConnection(function (err, connection) {
                    if (err) {
                        throw err;
                    }
                    connection.beginTransaction(function (err) {
                        if (err) {
                            throw err;
                        }
                        const { repartidor, cobro, utilidad, comision, costos, date, items } = obj;
                        connection.query(`INSERT INTO  \`operaciones\` ( \`repartidor\`, \`cobro\`, \`utilidad\`, \`comision\`, \`costos\`, \`date\`) VALUES (${repartidor}, ${cobro}, ${utilidad}, ${comision}, ${costos}, "${date}" );`, function (error, results, fields) {
                            if (error)
                                return connection.rollback(function () { throw error; });
                            const { insertId } = results; // Obtener el ID de la operación insertada
                            const itemsBody = items.map((i) => {
                                i.operacion = insertId;
                                return i;
                            });
                            let QUERY = 'INSERT INTO item_operacion (';
                            const keys2 = Object.keys(itemsBody[0]);
                            QUERY += keys2.map(k => `\`${k}\``).join(', ');
                            QUERY += ') VALUES ';
                            const values = itemsBody.map((ib) => JSON.stringify(Object.values(ib)).replace(/["\[\]]/g, function (match) {
                                switch (match) {
                                    case '"':
                                        return "'";
                                    case '[':
                                    case ']':
                                        return ' ';
                                }
                            }));
                            QUERY += values.map((v) => `(${v})`).join(', ');
                            //  console.log(QUERY);
                            connection.query(QUERY, function (error, results2, fields) {
                                if (error) {
                                    return connection.rollback(function () {
                                        throw error; // Ocurrió un error al ejecutar la primera consulta INSERT en la tabla 'item_operacion'
                                    });
                                }
                                // Confirmar la transacción
                                connection.commit(function (err) {
                                    if (err) {
                                        return connection.rollback(function () {
                                            throw err; // No se pudo confirmar la transacción
                                        });
                                    }
                                    //  console.log('Transacción completada', results);
                                    res.json({ data: insertId, message: 'Se creó correctamente el registro' });
                                    connection.release(); // Liberar la conexión
                                });
                            });
                        });
                    });
                });
            }
            catch (error) {
                // console.error('catch', error);
                res.status(500).json({ message: 'Error al crear la operación' });
            }
        });
    }
    delete(req, res) {
        var id = req.params.id;
        //  console.log('Id del operaciones a elliminar: ' + id);
        database_1.default.getConnection(function (err, connection) {
            if (err)
                throw err; // not connected!
            connection.query('DELETE FROM `operaciones` WHERE `id` = ?', id, function (error, results, fields) {
                //  console.log('Borra');
                res.json(results);
                connection.release();
                if (error)
                    throw error;
            });
        });
    }
    searchId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var id = req.params.id;
            //  console.log(id);
            database_1.default.getConnection(function (err, connection) {
                if (err) {
                    //  console.error(err);
                    res.status(500).json({ message: 'Error al crear la operación' });
                }
                ; // not connected!
                // Iniciar la transacción
                connection.beginTransaction(function (err) {
                    if (err) {
                        throw err; // No se pudo iniciar la transacción
                    }
                    let query = `SELECT 
        o.*,
        re.nombres AS repartidor,
        ru.descripcion
            FROM
        operaciones o
            INNER JOIN
        repartidores re ON o.repartidor = re.ruta
            JOIN
        rutas ru ON re.ruta = ru.no_ruta
        WHERE o.id = ${id};`;
                    //  console.log(query);
                    connection.query(query, function (error, results, fields) {
                        if (error)
                            return connection.rollback(function () { throw error; }); // Ocurrió un error al ejecutar la consulta INSERT en la tabla 'operaciones'
                        //  console.log('First results', results);
                        let query2 = `SELECT 
              i.*, p.*, re.ruta
                  FROM
              repartidores re
                  JOIN
              operaciones o ON o.repartidor = re.ruta
                  JOIN
              item_operacion i ON i.operacion = o.id 
                  INNER JOIN
              products p ON i.code = p.code
                  JOIN 
              unidades_medida um ON p.um = um.id 
                  LEFT JOIN 
              factores_conversion fc ON um.id = fc.um
              where o.id = ${id}`;
                        connection.query(query2, function (error, results2, fields) {
                            if (error) {
                                return connection.rollback(function () {
                                    throw error; // Ocurrió un error al ejecutar la primera consulta INSERT en la tabla 'item_operacion'
                                });
                            }
                            // Confirmar la transacción
                            connection.commit(function (err) {
                                if (err) {
                                    return connection.rollback(function () {
                                        throw err; // No se pudo confirmar la transacción
                                    });
                                }
                                //  console.log('Transacción completada', results2);
                                res.json({ results, results2 });
                                connection.release(); // Liberar la conexión
                            });
                        });
                    });
                });
            });
        });
    }
    dataReportRuta(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var { start, end, idRuta } = req.query;
            database_1.default.getConnection(function (err, connection) {
                if (err) {
                    res.status(500).json({ message: 'Error al crear la operación' });
                }
                ; // not connected!
                connection.beginTransaction(function (err) {
                    if (err) {
                        // throw err; // No se pudo iniciar la transacción
                        res.status(500).json({ message: 'No se pudo iniciar la transacción de generar el reporte' });
                    }
                    let query = `SELECT 
        p.description,
        re.nombres,
        re.ruta,
        ru.descripcion as zona,
        o.date,
        SUM(i.sTotalPz) AS sTotalPz,
        SUM(i.rTotalPz) AS rTotalPz,
        SUM(i.ventaPz) AS ventaPz,
        SUM(i.saldo) AS saldo,
          ((p.content * fc.cantidad) * SUM(i.ventaPz)) / 1000 AS klts,
          ((p.precio_lista - (p.precio_compra + p.comision )) * SUM(i.ventaPz )) as utilidad,
          (p.precio_lista - p.precio_compra) as margen,
          (p.precio_lista - p.precio_compra) * SUM( i.ventaPz ) as margenTotal,
          (p.comision * SUM( i.ventaPz )) as comision
        FROM 
        repartidores re
        JOIN rutas ru ON re.ruta = ru.no_ruta
        JOIN operaciones o  ON o.repartidor = re.ruta
        JOIN item_operacion i ON i.operacion = o.id
        INNER JOIN products p ON i.code = p.code
        JOIN unidades_medida um ON p.um = um.id
        LEFT JOIN factores_conversion fc ON um.id = fc.um
        WHERE  o.date BETWEEN '${start}' AND '${end}' ${idRuta ? ' AND o.repartidor = ' + idRuta : ''}
        GROUP BY i.code  
        ORDER BY p.grupo ASC;`;
                    console.log(start, end, query);
                    connection.query(query, function (error, results, fields) {
                        if (error)
                            return connection.rollback(function () {
                                res.status(500).json({ message: 'Error al terminar de generar el reporte en operaciones' });
                            }); // Ocurrió un error al ejecutar la consulta INSERT en la tabla 'operaciones'
                        connection.commit(function (err) {
                            if (err) {
                                return connection.rollback(function () {
                                    res.status(500).json({ message: 'Error al terminar de generar el reporte' });
                                });
                            }
                            res.json(results);
                            connection.release(); // Liberar la conexión
                        });
                        // });
                    });
                });
            });
        });
    }
    searchByRutaRange(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var { start, end, idRuta } = req.query;
            database_1.default.getConnection(function (err, connection) {
                if (err) {
                    //  console.error(err);
                    res.status(500).json({ message: 'Error al crear la operación' });
                }
                ; // not connected!
                // Iniciar la transacción
                connection.beginTransaction(function (err) {
                    if (err) {
                        // throw err; // No se pudo iniciar la transacción
                        res.status(500).json({ message: 'No se pudo iniciar la transacción de generar el reporte' });
                    }
                    let query = `SELECT 
        o.*,
        re.nombres AS repartidor,
        ru.descripcion,
        ru.no_ruta
            FROM
        operaciones o
            INNER JOIN
        repartidores re ON o.repartidor = re.ruta
            JOIN
        rutas ru ON re.ruta = ru.no_ruta`;
                    if (start || end || idRuta) {
                        query += ` WHERE `;
                        if (start && end) {
                            query += ` o.date BETWEEN '${start}' AND '${end}' `;
                            if (idRuta) {
                                query += ` AND `;
                            }
                        }
                        if (idRuta) {
                            query += ` ru.no_ruta = ${idRuta} `;
                        }
                    }
                    // .log(start, end, query);
                    //         o.date BETWEEN '${start} 'AND '${end}'
                    // o.date BETWEEN '${start}' AND '${end}'
                    connection.query(query, function (error, results, fields) {
                        if (error)
                            return connection.rollback(function () {
                                res.status(500).json({ message: 'Error al terminar de generar el reporte en operaciones' });
                            }); // Ocurrió un error al ejecutar la consulta INSERT en la tabla 'operaciones'
                        let query2 = `SELECT 
          i.*,
          p.*,
          re.ruta,
          ((p.content * fc.cantidad) * i.ventaPz)/1000 AS klts
              FROM
          repartidores re
              JOIN
          rutas ru ON re.ruta = ru.no_ruta
              JOIN
          operaciones o ON o.repartidor = re.ruta
              JOIN
          item_operacion i ON i.operacion = o.id
              INNER JOIN
          products p ON i.code = p.code
              JOIN
          unidades_medida um ON p.um = um.id
              LEFT JOIN
          factores_conversion fc ON um.id = fc.um`;
                        if (start || end || idRuta) {
                            query += ` WHERE `;
                            if (start && end) {
                                query += ` o.date BETWEEN '${start}' AND '${end}' `;
                                if (idRuta) {
                                    query += ` AND `;
                                }
                            }
                            if (idRuta) {
                                query += ` ru.no_ruta = ${idRuta} `;
                            }
                        }
                        // .log(query2);
                        connection.query(query2, function (error, results2, fields) {
                            if (error) {
                                return connection.rollback(function () {
                                    // throw error; // Ocurrió un error al ejecutar la primera consulta INSERT en la tabla 'item_operacion'
                                    res.status(500).json({ message: 'Error al terminar de generar el reporte por los items' });
                                });
                            }
                            connection.commit(function (err) {
                                if (err) {
                                    return connection.rollback(function () {
                                        res.status(500).json({ message: 'Error al terminar de generar el reporte' });
                                    });
                                }
                                // console.log('Transacción completada', results2);
                                let result = results.map((mn) => {
                                    return Object.assign(Object.assign({}, mn), { klts: results2
                                            .filter((itm) => itm.operacion === mn.id)
                                            .map((it) => it.klts)
                                            .reduce((a, z) => { return a + z; }, 0), items: results2.filter((itm) => itm.operacion === mn.id) });
                                });
                                res.json(result);
                                connection.release(); // Liberar la conexión
                            });
                        });
                    });
                });
            });
        });
    }
    searchByRutaRangeCount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var { start, end, idRuta } = req.query;
            database_1.default.getConnection(function (err, connection) {
                if (err) {
                    //  console.error(err);
                    res.status(500).json({ message: 'Error al crear la operación' });
                }
                ; // not connected!
                let query = `SELECT 
      COUNT (*) AS operaciones_hoy
          FROM
      operaciones o
          INNER JOIN
      repartidores re ON o.repartidor = re.ruta
          JOIN
      rutas ru ON re.ruta = ru.no_ruta`;
                if (start || end || idRuta) {
                    query += ` WHERE `;
                    if (start && end) {
                        query += ` o.date BETWEEN '${start}' AND '${end}' `;
                        if (idRuta) {
                            query += ` AND `;
                        }
                    }
                    if (idRuta) {
                        query += ` ru.no_ruta = ${idRuta} `;
                    }
                }
                //  console.log(start, end, query);
                connection.query(query, function (error, results, fields) {
                    if (error)
                        return connection.rollback(function () {
                            res.status(500).json({ message: 'Error al terminar de generar el reporte en operaciones' });
                        }); // Ocurrió un error al ejecutar la consulta INSERT en la tabla 'operaciones'
                    res.json(results);
                    connection.release();
                });
            });
        });
    }
    updateComplete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const obj = req.body;
                const id = req.params.id;
                database_1.default.getConnection(function (err1, connection) {
                    if (err1) {
                        throw err1;
                    }
                    connection.beginTransaction(function (err2) {
                        if (err2) {
                            throw err2;
                        }
                        const { repartidor, cobro, utilidad, comision, costos, date, items } = obj;
                        const query = `UPDATE operaciones SET cobro = ${cobro}, utilidad = ${utilidad}, comision = ${comision}, costos = ${costos} WHERE id = ${id}`;
                        // console.log(query);
                        connection.query(query, function (error, results, fields) {
                            if (error) {
                                // console.log('err1', error);
                                return connection.rollback(function () { throw error; }); // Ocurrió un error al ejecutar la consulta INSERT en la tabla 'operacion
                            }
                            // console.log('Results update op: ', results)
                            const itemsNewers = [...items];
                            // console.log('itemsNewers: ', itemsNewers)
                            const lmt = itemsNewers.findIndex(i => !i.id);
                            // console.log('lmt: ', lmt)
                            const itemsOlders = lmt === -1 ? itemsNewers : itemsNewers.splice(0, lmt);
                            // console.log('itemsOlders: ', itemsOlders)
                            const q1 = itemsOlders.map((i) => `\n-- Primera 
              \nUPDATE item_operacion 
              SET 
                sCj = ${i.sCj}, 
                sPz = ${i.sPz}, 
                sTotalPz = ${i.sTotalPz}, 
                rCj = ${i.rCj}, 
                rPz = ${i.rPz}, 
                rTotalPz = ${i.rTotalPz}, 
                saldo = ${i.saldo}, 
                ventaPz = ${i.ventaPz} 
              WHERE id = ${i.id};`);
                            // console.log('   foreacb')
                            q1.forEach((query) => __awaiter(this, void 0, void 0, function* () {
                                yield connection.query(query, function (error2, results2, fields) {
                                    if (error2) {
                                        return connection.rollback(function () { throw error2; });
                                    }
                                    // console.log('--->Confirmar la transacción', results2);
                                });
                            }));
                            // console.log('   foreacbsss')
                            if (lmt < 0) {
                                connection.commit(function (err) {
                                    if (err) {
                                        // console.log('Err3', err);
                                        return connection.rollback(function () {
                                            throw err; // No se pudo confirmar la transacción
                                        });
                                    }
                                    // console.log('Transacción completada solo con antiguas', results);
                                    res.json({ data: 'success', message: 'Se creó correctamente el registro' });
                                    connection.release(); // Liberar la conexión
                                });
                            }
                            else {
                                const itemsBody = itemsNewers.map((i) => {
                                    i.operacion = id;
                                    return i;
                                });
                                let QUERY = 'INSERT INTO item_operacion (';
                                const keys2 = Object.keys(itemsBody[0]);
                                QUERY += keys2.map(k => `\`${k}\``).join(', ');
                                QUERY += ') VALUES ';
                                const values = itemsBody.map((ib) => JSON.stringify(Object.values(ib)).replace(/["\[\]]/g, function (match) {
                                    switch (match) {
                                        case '"':
                                            return "'";
                                        case '[':
                                        case ']':
                                            return ' ';
                                    }
                                }));
                                QUERY += values.map((v) => `(${v})`).join(', ');
                                connection.query(QUERY, function (error4, results4, fields) {
                                    if (error4) {
                                        return connection.rollback(function () {
                                            throw error4; // Ocurrió un error al ejecutar la primera consulta INSERT en la tabla 'item_operacion'
                                        });
                                    }
                                    // Confirmar la transacción
                                    connection.commit(function (err) {
                                        if (err) {
                                            // console.log('Err3', err);
                                            return connection.rollback(function () {
                                                throw err; // No se pudo confirmar la transacción
                                            });
                                        }
                                        // console.log('Transacción completada', results);
                                        res.json({ data: 'success', message: 'Se creó correctamente el registro' });
                                        connection.release(); // Liberar la conexión
                                    });
                                });
                            }
                        });
                    });
                });
            }
            catch (error) {
                // console.error('catch error');
                res.status(500).json({ message: 'Error al crear la operación' });
            }
        });
    }
    update(req, res) {
        var id = req.params.id;
        database_1.default.getConnection(function (err, connection) {
            if (err)
                throw err; // not connected!
            connection.query('UPDATE `operaciones` SET ? WHERE `id` = ?', [req.body, req.params.id], function (error, results, fields) {
                if (error)
                    throw error;
                connection.query('SELECT * FROM `operaciones` where `id` = ?', id, function (error2, results2, fields2) {
                    var resR = results2;
                    //  console.log('editado:');
                    res.json(resR);
                    connection.release();
                });
            });
        });
    }
}
const operationsController = new OperationsController;
exports.default = operationsController;
// data: req.body['status'] ? 'Connected' : 'Updated'            
