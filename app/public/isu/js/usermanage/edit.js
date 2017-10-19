'use strict';

$(document).ready(function () {
    $('#user_flag').val(usermanageObj.user_flag);
    $('#group_flag').val(usermanageObj.group_flag);
    $('#access_yn').val(usermanageObj.access_yn);
    $('#company_cd').val(usermanageObj.company_nm);
    $('#company_nm').val(usermanageObj.company_cd);
});

function companyCd() {
    //선택된 회사 인덱스 값
    var sIdx = $('#company_cd option').index($('#company_cd option:selected'));
    sIdx = sIdx - 1; //'선택하세요' 인덱스값 1을 빼줌
    //선택값 매핑
    $('#company_nm').val($('#company_cd option:selected').text());
    $('input[name="usermanage[dom_post_cd1]"]').val(companyObj[sIdx].zip_cd);
    $('input[name="usermanage[dom_addr]"]').val(companyObj[sIdx].addr);
    $('input[name="usermanage[dom_addr2]"]').val(companyObj[sIdx].addr2);
    $('input[name="usermanage[office_tel_no]"]').val(companyObj[sIdx].tel_no);
}