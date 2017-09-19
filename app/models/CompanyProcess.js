'use strict';

var mongoose = require('mongoose');

var CompanyProcessSchema = mongoose.Schema({
    company_cd: { type: String, required: true },     //회사
    higher_cd : {type: String, required:true},        //상위코드
    higher_nm : {type: String},        //상위코드
    createdAt: { type: Date, default: Date.now },    //생성일자 
    user_flag: { type: String }                      //사용여부(1:사용, 0:미사용)
});

module.exports = mongoose.model('companyProcess', CompanyProcessSchema);