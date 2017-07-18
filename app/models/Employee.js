var mongoose = require('mongoose');

var employeeSchema = mongoose.Schema({
  id: {type:String, required:true},
  pw: {type:String, required:true}

});


var Employee = mongoose.model('employee',employeeSchema);
module.exports = Employee;
