'use strict';

$(document).ready(function() { 
    $('#user_flag').val(myProcessObj.user_flag);

    
    $('#saveBtn').on('click',function(){
        if(checkValue()){
            if(confirm("등록하시겠습니까?")){
                $('#form').submit();
            }
        }
    })
    
});
