var mongoose = require('mongoose');
var bcrypt   = require("bcrypt-nodejs");
const logger = require('log4js').getLogger('app');

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
    
    user_flag        : { type : String, default : 9 },
    group_flag       : { type : String, default : 'out' },
    created_at       : { type : Date, default: Date.now },
    updated_at       : { type : Date }
});

usermanageSchema.pre("save", hashPassword);
usermanageSchema.pre("findOneAndUpdate", function hashPassword(next){
    var user = this._update;
    if(!user.newPassword){ //새 비밀번호가 없을 시 비밀번호는 변경하지 않음.
        var user = this._update;
        delete user.password;
        return next();
    } else {
        var user = this._update;
        user.password = bcrypt.hashSync(user.newPassword);
        return next();
    }
});

/**
 * 비밀번호 비교
 */
usermanageSchema.methods.authenticate = function (password) {
    var user = this;
    return bcrypt.compareSync(password,user.password);
};

/**
 * 비밀번호 해쉬 값
 */
usermanageSchema.methods.hash = function (password) {
    return bcrypt.hashSync(password);
};

/**
 * 비밀번호를 해쉬로 바꿈
 * @param {*} next 
 */
function hashPassword(next){
    var user = this;
    if(!user.isModified("password")){
        return next();
    } else {
        user.password = bcrypt.hashSync(user.password);
        return next();
    }
}

var Usermanage = mongoose.model('usermanage', usermanageSchema);
module.exports = Usermanage;