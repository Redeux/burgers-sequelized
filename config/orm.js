const dbConfig = process.env.CLEARDB_DATABASE_URL || require('./connection');
const mysql = require('mysql');

function Orm() {
  this.pool = mysql.createPool(dbConfig);
}

Orm.prototype.selectAll = function(table, callback) {
  this.pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query('SELECT * FROM ??', table, (err, rows) => {
      // release the connection on response
      connection.release();
      if (err) throw err;
      // If the response is an error return it
      // if (process.env.node_env === 'development') if (err) throw err;
      // on valid data return it
      return callback(rows);
    });
  });
};

Orm.prototype.insertOne = function(table, column, value, callback) {
  this.pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query('INSERT INTO ?? (??) VALUES (?)', [table, column, value], (err, row) => {
      // release the connection on response
      connection.release();
      if (err) throw err;
      // If the response is an return return it
      // if (process.env.node_env === 'development') if (err) throw err;
      // on valid data return it
      return callback(row);
    });
  });
};

Orm.prototype.updateOne = function(table, column, where, callback) {
  this.pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query('UPDATE ?? SET ? WHERE ?', [table, column, where], (err, row) => {
      // release the connection on response
      connection.release();
      if (err) throw err;
      // If the response is an error return it
      // if (process.env.node_env === 'development') if (err) throw err;
      // on valid data return it
      return callback(row);
    });
  });
};

module.exports = Orm;
