'use strict';

$(document).ready(function() { 

    $('#saveBtn').on('click',function(){
        if(confirm("등록하시겠습니까?")){
            var myProcess = $("#myProcessSelect").val().toString();
            alert(myProcess);
            var filedata = {"myProcess" : myProcess};
            alert(filedata);
            
            
            //$('#form').submit();
        }
    })

});



/*
$('#public-methods').multiSelect();
$('#select-all').click(function(){
  $('#public-methods').multiSelect('select_all');
  return false;
});
$('#deselect-all').click(function(){
  $('#public-methods').multiSelect('deselect_all');
  return false;
});
$('#select-100').click(function(){
  $('#public-methods').multiSelect('select', ['elem_0', 'elem_1' ..., 'elem_99']);
  return false;
});
$('#deselect-100').click(function(){
  $('#public-methods').multiSelect('deselect', ['elem_0', 'elem_1' ..., 'elem_99']);
  return false;
});
$('#refresh').on('click', function(){
  $('#public-methods').multiSelect('refresh');
  return false;
});
$('#add-option').on('click', function(){
  $('#public-methods').multiSelect('addOption', { value: 42, text: 'test 42', index: 0 });
  return false;
});
*/




function higherCd(){
    //선택된 회사 인덱스 값
    var sIdx = $('#higher_cd option').index($('#higher_cd option:selected'));
    sIdx = sIdx -1; //'선택하세요' 인덱스값 1을 빼줌
    //선택값 매핑
    $('#higher_nm').val($('#higher_cd option:selected').text());
}

function comCd(){
    //선택된 회사 인덱스 값
    var sIdx = $('#company_cd option').index($('#company_cd option:selected'));
    sIdx = sIdx -1; //'선택하세요' 인덱스값 1을 빼줌
    //선택값 매핑
    $('#company_nm').val($('#company_cd option:selected').text());
}