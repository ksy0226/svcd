var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var IncidentSchema = new Schema({
    title : {
        type : String,
        validate : [
            isEmpty,
            "제목은 꼭 입력해주세요."
        ]
    },
    content : String,
    created_at : {
        type : Date,
        default : Date.now()
    }
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
IncidentSchema.plugin( autoIncrement.plugin , { model : "incident", field : "id" , startAt : 1 } );
module.exports = mongoose.model('incident' , IncidentSchema);