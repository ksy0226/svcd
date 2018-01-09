'use strict';

$(document).ready(function () {

    //그룹사구분 세팅
    setGroupFlag();

    //유지보수 기간 체크 
    checkDate();
    
});

//그룹사구분 세팅
function setGroupFlag() {

    $('select[name="company[group_flag]"]').val($('#group_flag').val());

    if($('#user_flag').val() == '1'){
        $('#row_group_flag').slideDown(350);
        
    }else{
        $('#row_group_flag').slideUp(350);
               
    }
}

function checkDate(){
    if($('input[name="company[date_from]"]').val() =="undefined"){
        $('input[name="company[date_from]"]').val(""); 
    }
    if($('input[name="company[date_to]"]').val() =="undefined"){
        $('input[name="company[date_to]"]').val(""); 
    }
}
