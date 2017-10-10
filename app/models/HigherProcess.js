'use strict';

var mongoose = require('mongoose');

var higherProcessSchema = mongoose.Schema({
    higher_cd: { type: String, required: true },     //상위업무코드
    higher_nm: { type: String},                      //상위업무명
    description: { type: String },                   //설명
    company_cd: { type: String },                        //회사코드
    sabun: { type: String },                         //사번
    created_at: { type: Date, default: Date.now },    //생성일자 
    user_flag: { type: String }                      //사용여부(1:사용, 0:미사용)

});



var HigherProcess = mongoose.model('higherProcess', higherProcessSchema);
module.exports = HigherProcess;