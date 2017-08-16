'use strict';
$(document).ready(function() { 
    alert("로딩 완료"); 
    alert('#{usermanage.userFlag}');
    
    $('#userFlag').val('#{usermanage.userFlag}');
    //$('#userFlag').val('2323');
    $('#groupFlag').val('#{usermanage.groupFlag}');   
});