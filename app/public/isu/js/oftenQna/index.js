'use strict';

var rowIdx = 0; //출력 시작 인덱스
var dataCnt = 0; // 출력 종료 인덱스
var inCnt = 15; //한번에 화면에 조회되는 리스트 수

$(document).ready(function () {
    //엔터키 이벤트 시
    $('#searchText').keypress(function (e) {
        if (e.keyCode == 13) {
            $('#searchText').val($('#searchText').val());
            research();
        }
    });

    //최초 조회
    getDataList();

    //조회버튼 클릭 시
    $('#searchBtn').on('click', function () {
        research();
    });

    //상위업무 변경 시
    $('#higher_nm').on('change', function () {
        research();
    });

    //정렬방식 변경 시
    $('#order_by').on('change', function () {
        research();
    });

});

//다시 조회
function research() {
    dataCnt = 0;
    rowIdx = 0;

    //내용삭제
    $("#more_list").empty();
    getDataList();
}

function getDataList() {
    var reqParam = 'searchType=' + $('#searchType').val() + '&higher_nm=' + $('#higher_nm').val() + '&searchText=' + $('#searchText').val();

    $.ajax({
        type: "GET",
        async: true,
        url: "/search/list",
        dataType: "json", // xml, html, script, json 미지정시 자동판단
        timeout: 30000, //제한 시간
        cache: false,
        data: reqParam, // $($('form')).serialize()
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        error: function (request, status, error) {
            $('#ajax_indicator').css("display", "none");
            alert("error : " + error);
        },
        beforeSend: function () {
            $('#ajax_indicator').css("display", "");
        },
        success: function (dataObj) {
            $('#ajax_indicator').css("display", "none");
            setDataList(dataObj).sort($('#order_by').val());
        }
    });
}

//내용 매핑
function setDataList(dataObj) {
    //조회 내용 추가
    if (rowIdx < dataObj.length) {

        if ((rowIdx + inCnt) < dataObj.length) {
            dataCnt = rowIdx + inCnt;
        } else {
            dataCnt = dataObj.length;
        }

        for (var i = rowIdx; i < dataCnt; i++) {
            var register_dateVal = dataObj[i].register_date;
            register_dateVal = register_dateVal.substring(0, 10);
            var idValue = dataObj[i]._id;
            var addList = "";
            addList += "							<tr id='dataTR' onclick=window.location='/search/viewdetail/" + dataObj[i]._id + "'>";
            addList += "								<td>" + dataObj[i].higher_nm + "</td>";
            addList += "								<td>" + dataObj[i].title + "</td>";
            addList += "								<td>" + dataObj[i].user_nm + "</td>";
            addList += "								<td>" + dataObj[i].created_at + "</td>";
            addList += "								<td>" + dataObj[i].reading_cnt + "</td>";
            addList += "							</tr>";

            $("#more_list").append(addList);

            rowIdx++;
        }
    }
}