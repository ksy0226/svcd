'use strict';

var mongoose = require('mongoose');

var lowerProcessSchema = mongoose.Schema({
    lower_cd: { type: String, required: true, unique:true },         //하위업무코드
    lower_nm: { type: String },                         //하위업무명
    higher_cd: { type: String, required: true, unique:true },        //상위업무코드
    higher_nm: { type: String },                        //상위업무명
    description: { type: String },                      //설명
    need_hour: { type: String },                        //hour
    sabun: { type: String },                            //사번
    created_at: { type: Date, default: Date.now },      //생성일자 
    use_yn: { type: String, default: "사용" },          //사용여부
    company_cd: { type: String },                       //회사코드
    company_nm: { type: String },                       //회사명
    user_nm: { type: String, default: "관리자" },       //이름
});

var LowerProcess = mongoose.model('lowerProcess', lowerProcessSchema);
module.exports = LowerProcess;