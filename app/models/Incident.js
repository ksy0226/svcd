var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var IncidentSchema = new Schema({
    seq : {type : Number, required:true}, //순서
    status : String, //진행상태
    taskL1 : String, //상위업무
    taskL2 : String, //하위업무
    title : { type : String, required:true, validate : [isEmpty, "제목은 꼭 입력해주세요."] }, //제목
    content : String, //내용
    req_finish_date : String, //완료요청일
    req_id : String, //요청자계정
    req_nm : String, //요청자명
    ans_id_l1 : String, //1차 담당자계정
    ans_nm_l1 : String, //1차 담당자명
    ans_id_l2 : String, //2차 담당자계정
    ans_nm_l2 : String, //2차 담당자명
    attach_file : [String], //첨부이미지
    delete_flag : { type : String, default : 'N' }, //삭제여부 
    created_at : { type : Date, default : Date.now() }
});

function isEmpty(value){
    var isValid = false;
    if(value){
        isValid = true;
    }
    return isValid;
}

IncidentSchema.virtual('getDate').get(function(){
    var date = new Date(this.created_at);
    return {
        year : date.getFullYear(),
        month : date.getMonth()+1,
        day : date.getDate()
    };
});

autoIncrement.initialize(mongoose.connection);
IncidentSchema.plugin( autoIncrement.plugin , { model : "incident", field : "seq" , startAt : 1 } );
module.exports = mongoose.model('incident' , IncidentSchema);