var mongoose = require('mongoose');

var companySchema = mongoose.Schema({
    company_cd: { type: String, required: true },      //회사코드
    company_nm: { type: String, required: true },      //회사명
    ceo_nm: { type: String },                      //대표자명
    zip_cd: { type: String },                      //우편번호
    addr: { type: String },                        //주소1
    addr2: { type: String },                       //주소2
    type: { type: String },                        //업종
    tel_no: { type: String },                      //전화번호
    fax_no: { type: String },                      //팩스번호
    bigo: { type: String },                        //비고
    //register: {type:mongoose.Schema.Types.ObjectId, ref:'user', required:true},
    register_id: { type: String },                 //생성자
    modifier_id: { type: String },                 //변경자
    created_at: { type: Date, default: Date.now }, //생성일자 
    updated_at: Date,                              //변경일자
    deleted_at: Date,                              //삭제일자
    use_yn: { type: String }                       //사용여부(Y:사용, N:미사용)

});



var Company = mongoose.model('company', companySchema);
module.exports = Company;


