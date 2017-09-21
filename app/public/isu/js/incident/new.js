'use strict';


$(document).ready(function () {

    $('#higher_cd').on('change',function(){
        if($(this).val() == 'H008'){
            //$('input[name="incident[app_menu]"]').val();
            $('#app_menu').slideDown(350);
        }else{
            $('#app_menu').slideUp(350);
        }
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

