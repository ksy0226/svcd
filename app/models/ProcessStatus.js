var mongoose = require('mongoose');

var processStatusSchema = mongoose.Schema({
  status_cd: {type:String, required:true, unique:true},
  status_nm: {type:String},
  delete_flag : { type : String, default : 'N' }, //삭제여부  
  createdAt : {type:String},
  updatedAt : { type : Date },
  deletedAt : { type : Date }  
});

function setCreateAt(next){
    var schema = this;
    var date = new Date();
    schema.createdAt = date.toLocaleString();
    return next();
}

module.exports = mongoose.model('processStatus',processStatusSchema);

