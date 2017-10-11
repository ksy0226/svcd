'use strict';

var mongoose = require('mongoose');

var oftenqaSchema = mongoose.Schema({
    higher_cd:      { type: String, required: true },
    higher_nm:      { type: String, required: true },
    title:          { type: String, required: true },
    content:        { type: String },
    reading_cnt:    { type: Number, default : 0 },
    company_cd:     { type: String },
    company_nm:     { type: String },
    sabun:          { type: String },
    user_nm:        { type: String },
    created_at:     { type: Date, default: Date.now },
});

var Oftenqa = mongoose.model('oftenqa', oftenqaSchema);
module.exports = Oftenqa;