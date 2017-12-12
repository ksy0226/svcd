'use strict';

var mongoose = require('mongoose');

var processGubunSchema = mongoose.Schema({
    process_cd: { type: String, required: true },     //처리코드
    process_nm: { type: String },                     //처리코드명
    higher_cd: { type: String },                      //상위코드
    higher_nm: { type: String },                      //상위코드명
    description: { type: String },                    //설명
    user_id: { type: String },
    user_nm: { type: String, default: "관리자" },
    question_type: { type: String },                  //문의유형
    created_at: { type: Date, default: Date.now },    //생성일자 
    use_yn: { type: String, default: "사용" }         //사용여부

});

var ProcessGubunSchema = mongoose.model('processGubun', processGubunSchema);
module.exports = ProcessGubunSchema;