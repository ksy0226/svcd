'use strict';

function higherCd(){
    //선택된 회사 인덱스 값
    var sIdx = $('#higher_cd option').index($('#higher_cd option:selected'));
    sIdx = sIdx -1; //'선택하세요' 인덱스값 1을 빼줌
    //선택값 매핑
    $('#higher_nm').val($('#higher_cd option:selected').text());
}

function comCd(){
    //선택된 회사 인덱스 값
    var sIdx = $('#com_cd option').index($('#com_cd option:selected'));
    sIdx = sIdx -1; //'선택하세요' 인덱스값 1을 빼줌
    //선택값 매핑
    $('#com_nm').val($('#com_cd option:selected').text());
}