'use strict';

var mongoose = require('mongoose');

var myProcessSchema = mongoose.Schema({
    company_cd: { type: String, required: true },       //회사코드
    company_nm: { type: String },                       //회사명    
    higher_cd: { type: String, required: true, unique:true },        //상위업무코드
    higher_nm: { type: String },                        //상위업무명
    lower_cd: { type: String, required: true, unique:true },         //하위업무코드
    lower_nm: { type: String },                         //하위업무명    
    email: { type: String, unique:true },                            //이메일
    employee_nm: { type: String },                      //이름
    created_at: { type: Date, default: Date.now },      //생성일자 
    user_flag: { type: String }                         //사용여부(1:사용, 0:미사용)
});


var MyProcess = mongoose.model('myProcess', myProcessSchema);
module.exports = MyProcess;