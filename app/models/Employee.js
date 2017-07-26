var mongoose = require('mongoose');

var employeeSchema = mongoose.Schema({
  email: {type:String, required:true},
  pwd: {type:String, required:true}
});


var Employee = mongoose.model('employee',employeeSchema);
module.exports = Employee;
