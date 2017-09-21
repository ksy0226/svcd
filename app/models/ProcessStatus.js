var mongoose = require('mongoose');

var processStatusSchema = mongoose.Schema({
  status: {type:String, required:true, unique:true},
  status_nm: {type:String},
  delete_flag : { type : String, default : 'N' }, //삭제여부  
  createdAt : { type : Date, default : Date.now() },
  updatedAt : { type : Date },
  deletedAt : { type : Date }  
});

module.exports = mongoose.model('processStatus',processStatusSchema);

