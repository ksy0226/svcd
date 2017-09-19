var mongoose = require('mongoose');

var usermanageSchema = mongoose.Schema({
    company_cd       : { type : String, required: true },
    company_nm       : { type : String, required: true },    
    email            : { type : String, required: true },
    user_id          : { type : String },
    password         : { type : String, required: true },
    employee_nm      : { type : String },
    dept_nm          : { type : String },
    jikchk_nm        : { type : String },
    position_nm      : { type : String },
    user_flag        : { type : String },
    del_flag         : { type : String },
    del_reson        : { type : String },
    birth_dt         : { type : String },
    birth_ck         : { type : String },
    dom_post_cd1     : { type : String },
    dom_post_cd2     : { type : String },
    dom_addr         : { type : String },
    dom_addr2        : { type : String },
    office_tel_no    : { type : String },
    hp_telno         : { type : String },
    img_path         : { type : String },
    alarm_minute     : { type : Number },
    register_id      : { type : String },
    register_date    : { type : Date, default: Date.now },
    modify_id        : { type : String },
    modify_date      : { type : Date },
    email_ref        : { type : String },
    email_send_yn    : { type : String },
    sabun            : { type : String },
    
    user_flag        : { type : String },
    group_flag       : { type : String },
    created_at       : { type : Date, default: Date.now },
    updated_at       : { type : Date }
});

var Usermanage = mongoose.model('usermanage', usermanageSchema);
module.exports = Usermanage;