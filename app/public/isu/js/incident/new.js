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
    
});

function selectedHighProcess(obj){
    if($(obj).val() == 'H008'){
        $('#app_menu').slideDown(350);
        //$('#app_menu').attr('style','display:');
    }else{
        $('#app_menu').slideUp(350);            
    }
}


