'use strict';

var mongoose = require('mongoose');

var ManagerTaskSchema = mongoose.Schema({
    company_cd: { type: String, required:true, unique:true },          //회사코드
    higher_cd : {type: String, required:true, unique:true},        //상위코드  
    higher_nm : {type: String},        //상위코드명
    lower_cd : {type: String, required:true, unique:true},        //상위코드  
    lower_nm : {type: String},        //상위코드명 
    sabun: { type: String },                         //사번  
    employee_nm :  { type: String }, 
    delete_flag : { type : String, default : 'N' }, //삭제여부  
    createdAt : { type : Date, default : Date.now() },
    updatedAt : { type : Date },
    deletedAt : { type : Date }  
});

module.exports = mongoose.model('managerTask', ManagerTaskSchema);