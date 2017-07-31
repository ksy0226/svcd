var mongoose = require('mongoose');
const CompanyModel = require('../models/Company');
require('../util/date');


var companySchema = mongoose.Schema({
    com_cd: { type: String, required: true },     //회사코드
    com_nm: { type: String, required: true },     //회사명
    ceo_nm: { type: String },                     //대표자명
    zip_cd: { type: String },                     //우편번호
    addr: { type: String },                       //주소
    type: { type: String },                       //업종
    telno: { type: String },                      //전화번호
    faxno: { type: String },                      //팩스번호
    bigo: { type: String },                       //비고
    //register: {type:mongoose.Schema.Types.ObjectId, ref:'user', required:true},
    register_id: { type: String },                //생성자
    modifier_id: { type: String },                //변경자
    createdAt: { type: Date, default: Date.now }, //생성일자 
    updatedAt: Date,                              //변경일자
    deletedAt: Date,                              //삭제일자
    useYN: { type: String }                       //사용여부(Y:사용, N:미사용)

});



var Company = mongoose.model('company', companySchema);
module.exports = Company;


