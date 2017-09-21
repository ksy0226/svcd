var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var IncidentSchema = new Schema({
    register_num            : {type : Number, require : true},                                                                                                                      
    status                  : {type : String},  //진행상태(processStatus 모델)  
    status_nm               : {type : String},  //진행상태명            
    process_speed           : {type : String},  //긴급구분                                                                   
    course_flag             : {type : String},                                                                           
    title                   : {type : String, required:true, validate : [isEmpty, "제목은 꼭 입력해주세요."] }, //제목                                                             ."] }},
    content                 : {type : String},  //내용                                                                       
    request_company_cd      : {type : String},  //요청자 회사코드
    request_company_nm      : {type : String},  //요청자 회사명                                                              
    request_sabun           : {type : String},  //요청자 사번 
    request_nm              : {type : String},  //요청자 명                                                               
    request_complete_date   : {type : String},                    
    register_company_cd     : {type : String},  //등록자 회사코드  
    register_company_nm     : {type : String},  //등록자 회사명                                                              
    register_sabun          : {type : String},  //등록자 사번 
    register_nm             : {type : String},  //등록자 사번                                                                
    register_date           : {type : String},  //등록일                                                                     
    register_yyyy           : {type : String},  //등록년                                                                     
    register_mm             : {type : String},  //등록월
    real_register_mm        : {type : String},  //실제요청자
    real_contact            : {type : String},  //실제요청자 연락처   
    app_menu                : {type : String},  //문의 메뉴 경로                                                                          
    register_dd             : {type : String},  //등록일                                                                     
    receipt_content         : {type : String},  //등록내용                                                                         
    manager_company_cd      : {type : String},  //담당자 회사코드
    manager_company_nm      : {type : String},  //담당자 회사명                                                                          
    manager_sabun           : {type : String},  //담당자 사번
    manager_nm              : {type : String},  //담당자 명                                                                       
    receipt_date            : {type : Date},    //접수일                                                                          
    business_level          : {type : String},  //난이도                                                                        
    complete_reserve_date   : {type : Date},    //완료예정일                                                                       
    solution_flag           : {type : String},  //해결여부                                                                           
    complete_content        : {type : String},  //완료 코멘트                                                                     
    add_complete_content    : {type : String},  //추가 완료 코멘트                                                                         
    program_id              : {type : String},                                                                           
    delay_reason            : {type : String},  //지연사유                                                                           
    need_minute             : {type : Number},  //작업시간                                                                         
    complete_date           : {type : Date},    //완요일                                                                       
    valuation               : {type : Number},                                                                           
    reading_cnt             : {type : Number},                                                                           
    complete_open_flag      : {type : String, default : 'N'},  //완료후공개여부                                                                     
    higher_cd               : {type : String},  //상위업무 코드                                                              
    lower_cd                : {type : String},  //하위업무 코드('BC , 하드웨어 관련 오류','L044','공장/설비관리 부문','L045',
    customer_flag           : {type : String},                                                                           
    add_solution_content    : {type : String},                                                                           
    process_gubun           : {type : String},                                                                           
    valuation_content       : {type : String},                                                                           
    approval_gbn            : {type : String},                                                                           
    modify_yn               : {type : String, default : 'N'},                                                                           
    sharing_content         : {type : String},  //내부공유사항                                                              
    delete_flag : { type : String, default : 'N' }, //삭제여부
    attach_file : [{    fieldname: {type : String},
                            originalname: {type : String},
                            encoding: {type : String},
                            mimetype: {type : String},
                            destination: {type : String},
                            filename: {type : String},
                            path: {type : String},
                            size: {type : Number}  }], //첨부이미지
    createdAt : { type : Date, default : Date.now() },
    updatedAt : { type : Date },
    deletedAt : { type : Date }
});

function isEmpty(value){
    var isValid = false;
    if(value){
        isValid = true;
    }
    return isValid;
}

IncidentSchema.virtual('getDate').get(function(){
    var date = new Date(this.createdAt);
    return {
        year : date.getFullYear(),
        month : date.getMonth()+1,
        day : date.getDate()
    };
});

autoIncrement.initialize(mongoose.connection);
IncidentSchema.plugin( autoIncrement.plugin , { model : "incident", field : "register_num" , startAt : 1 } );
module.exports = mongoose.model('incident' , IncidentSchema);