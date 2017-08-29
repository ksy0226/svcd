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


var Usermanage = mongoose.model('usermanage', usermanageSchema);
module.exports = Usermanage;
