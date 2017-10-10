'use strict';


$(document).ready(function () {

    //$('input[name="incident[app_menu]"]').val();

    $('#higher_cd').on('change',function(){
        selectedHighProcess(this)
    });

    $('.summernote').summernote({
        height: 170, // set editor height
        minHeight: null, // set minimum height of editor
        maxHeight: null, // set maximum height of editor
        focus: false // set focus to editable area after initializing summernote
    });

    $('.inline-editor').summernote({
        airMode: true
    });

    $('#datepicker-rcd').datepicker({
        autoclose: true,
        todayHighlight: true,
        format: "yyyy/mm/dd"
    });

    $('#saveBtn').on('click',function(){
        if(checkValue()){
            if(confirm("등록하시겠습니까?")){
                $('#form').submit();
            }
        }
    })
    
});

function selectedHighProcess(obj){
    if($(obj).val() == 'H008'){
        $('#app_menu').slideDown(350);
        //$('#app_menu').attr('style','display:');
    }else{
        $('#app_menu').slideUp(350);            
    }
}

//필수값 체크
function checkValue(){
    if($('#higher_cd').val() == ''){
        alert("요청업무를 선택하세요.");
        $('#higher_cd').focus();
        return false;
    }

    if($('input[name="incident[real_register_mm]"]').val() == ''){
        alert("요청자를 입력하세요.");
        $('input[name="incident[real_register_mm]"]').focus();
        return false;
    }

    if($('input[name="incident[title]"]').val() == ''){
        alert("제목을 입력하세요.");
        $('input[name="incident[title]"]').focus();
        return false;
    }

    return true;
}


