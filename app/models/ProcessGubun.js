'use strict';

var mongoose = require('mongoose');

var processGubunSchema = mongoose.Schema({
    process_cd: { type: String, required: true },     //처리코드
    process_nm: { type: String },     //처리코드명
    higher_cd: { type: String},                      //상위코드
    higher_nm: { type: String},                      //상위코드명
    description: { type: String},                      //설명
    sabun: { type: String },                         //사번
    question_type:{ type: String },                  //문의유형
    created_at: { type: Date, default: Date.now },    //생성일자 
    user_flag: { type: String }                      //사용여부(1:사용, 0:미사용)

});

var ProcessGubunSchema = mongoose.model('processGubun', processGubunSchema);
module.exports = ProcessGubunSchema;