var mongoose = require('mongoose');

var usermanageSchema = mongoose.Schema({
    compannyNm: { type: String, required: true },
    userId: { type: String, required: true },
    password: { type: String, required: true },
    userNm: { type: String },
    deptNm: { type: String },
    jikwe: { type: String },
    jikchk: { type: String },
    email: { type: String },
    birthdayDt: { type: String },
    birthdayCk: { type: String },
    post: { type: String },
    address: { type: String },
    callNo: { type: String },
    hpNo: { type: String },
    userFlag: { type: String },
    groupFlag: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date
});

usermanageSchema.methods.getCreatedDate = function () {
    var date = this.createdAt;
    return date.getFullYear() + "-" + get2digits(date.getMonth() + 1) + "-" + get2digits(date.getDate());
};

usermanageSchema.methods.getCreatedTime = function () {
    var date = this.createdAt;
    return get2digits(date.getHours()) + ":" + get2digits(date.getMinutes()) + ":" + get2digits(date.getSeconds());
};
function get2digits(num) {
    return ("0" + num).slice(-2);
}
var Usermanage = mongoose.model('usermanage', usermanageSchema);
module.exports = Usermanage;
