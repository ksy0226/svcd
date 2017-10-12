'use strict';

var mongoose = require('mongoose');

var oftenqnaSchema = mongoose.Schema({
    higher_cd:      { type: String, required: true },
    higher_nm:      { type: String, required: true },
    title:          { type: String, required: true },
    content:        { type: String },
    reading_cnt:    { type: Number, default : 0 },
    company_cd:     { type: String },
    company_nm:     { type: String },
    sabun:          { type: String },
    user_nm:        { type: String },
    attach_file : [{ 
        fieldname:      {type : String},
        originalname:   {type : String},
        encoding:       {type : String},
        mimetype:       {type : String},
        destination:    {type : String},
        filename:       {type : String},
        path:           {type : String},
        size:           {type : Number} }], 
    created_at:     { type: Date, default: Date.now },
    updated_at:     { type: Date }
});

var Oftenqna = mongoose.model('oftenqna', oftenqnaSchema);
module.exports = Oftenqna;