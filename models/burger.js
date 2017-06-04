const Orm = require('../config/orm.js');

const dbQuery = new Orm();

exports.all = (callback) => {
  // callback : function

  dbQuery.selectAll('burgers', result => callback(result));
};

exports.make = (name, callback) => {
  // name : string
  // callback : function

  dbQuery.insertOne('burgers', 'burger_name', name, result => callback(result));
};

exports.devour = (burgerId, callback) => {
  // burgerId : integer
  // callback : function

  dbQuery.updateOne('burgers', {
    devoured: 1,
  }, {
    id: burgerId,
  }, (result) => {
    return callback(result);
  });
};
