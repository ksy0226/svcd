'use strict';

var rowIdx = 0; //출력 시작 인덱스
var dataCnt = 0; // 출력 종료 인덱스
var inCnt = 16; //한번에 화면에 조회되는 리스트 수


$(document).ready(function () {

    //목록 버튼 클릭 시
    $('#goList').on('click', function () {
        location.href = '/search/user_list';

    });
    
});

