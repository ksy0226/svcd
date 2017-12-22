'use strict';

var mongoose = require('mongoose');

var IncidentGubunSchema = mongoose.Schema({
    higher_cd : {type: String, required:true, unique:true},        //상위코드
    gbn_cd: { type: String, required: true, unique:true },     //인시던트구분코드
    gbn_nm: { type: String },     //인시던트구분명
    gbn_desc: { type: String },     //인시던트구분명
    company_cd: { type: String },                        //회사코드
    sabun: { type: String },                         //사번    
    delete_flag : { type : String, default : 'N' }, //삭제여부  
    createdAt : { type: String },
    updatedAt : { type : Date },
    deletedAt : { type : Date }  
});

IncidentGubunSchema.pre("save", setCreateAt);

function setCreateAt(next){
    var schema = this;
    var date = new Date();
    schema.createdAt = date.toLocaleString();
    return next();
}


module.exports = mongoose.model('incidentGubun', IncidentGubunSchema);