'use strict';

var rowIdx = 0; //출력 시작 인덱스
var dataCnt = 0; // 출력 종료 인덱스
var inCnt = 10; //한번에 화면에 조회되는 리스트 수

$(document).ready(function () {
    //최초 조회
    getDataList();
    //메인 카운트 로드
    cntLoad();
    //차트 로드
    chartLoad();
});

//차트 로드
function chartLoad() {
    $.ajax({
        type: "GET",
        async: true,
        url: "/statistic/chartLoad",
        dataType: "json", // xml, html, script, json 미지정시 자동판단
        timeout: 30000,
        cache: false,
        data: {},
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        error: function (request, status, error) {
            alert("error : " + error);
        },
        beforeSend: function (dataObj) {
        },
        success: function (dataObj) {
            setChartLoad(dataObj);
        }
    });
}

function setChartLoad(dataObj) {
    var DrawSparkline = function () {
        $('#sparkline1').sparkline([60, 23, 43, 35, 44, 45, 56, 37, 40], {
            type: 'line',
            width: $('#sparkline1').width(),
            height: '165',
            chartRangeMax: 50,
            lineColor: '#3bafda',
            fillColor: 'rgba(59,175,218,0.3)',
            highlightLineColor: 'rgba(0,0,0,.1)',
            highlightSpotColor: 'rgba(0,0,0,.2)',
        });

        $('#sparkline1').sparkline([25, 23, 26, 24, 25, 32, 30, 24, 19], {
            type: 'line',
            width: $('#sparkline1').width(),
            height: '165',
            chartRangeMax: 40,
            lineColor: '#00b19d',
            fillColor: 'rgba(0, 177, 157, 0.3)',
            composite: true,
            highlightLineColor: 'rgba(0,0,0,.1)',
            highlightSpotColor: 'rgba(0,0,0,.2)',
        });
    };

    DrawSparkline();

    var resizeChart;

    $(window).resize(function (e) {
        clearTimeout(resizeChart);
        resizeChart = setTimeout(function () {
            DrawSparkline();
        }, 300);
    });
}

//메인 카운트 로드
function cntLoad() {
    $.ajax({
        type: "GET",
        async: true,
        url: "/statistic/cntload",
        dataType: "json", // xml, html, script, json 미지정시 자동판단
        timeout: 30000,
        cache: false,
        data: {},
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        error: function (request, status, error) {
            alert("error : " + error);
        },
        beforeSend: function (dataObj) {
        },
        success: function (dataObj) {
            setCntLoad(dataObj);
        }
    });
}

function setCntLoad(dataObj) {
    for (var i = 0; i < dataObj.length; i++) {
        if (dataObj[i]._id.status_cd != null) {
            $('#status' + dataObj[i]._id.status_cd).html(dataObj[i].count);
        }
    }
}

function getDataList() {
    var reqParam = '';
    $.ajax({
        type: "GET",
        async: true,
        url: "/login/main_list",
        dataType: "json", // xml, html, script, json 미지정시 자동판단
        timeout: 30000,
        cache: false,
        data: reqParam,
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        error: function (request, status, error) {
            alert("error : " + error);
        },
        beforeSend: function () {
        },
        success: function (dataObj) {
            setDataList(dataObj);
        }
    });
}

//내용 매핑
function setDataList(dataObj) {
    //기존 데이터 삭제
    $("#more_list tr").remove();

    //조회 내용 추가
    if (rowIdx < dataObj.length) {

        if ((rowIdx + inCnt) < dataObj.length) {
            dataCnt = rowIdx + inCnt;
        } else {
            dataCnt = dataObj.length;
        }

        for (var i = rowIdx; i < dataCnt; i++) {
            var creat_dateVal = dataObj[i].created_at;
            creat_dateVal = creat_dateVal.substring(0, 10);
            var complete_dateVal = dataObj[i].complete_date;
            complete_dateVal = complete_dateVal.substring(0, 10);

            var addList = "";
            addList += "<tr onclick=window.location='/search/user_list/' style='cursor:pointer'>";
            addList += "	<td>" + dataObj[i].title + "</td>";
            addList += "	<td class='text-center'>" + creat_dateVal + "</td>";
            addList += "	<td class='text-center'>" + dataObj[i].app_menu + "</td>";
            addList += "	<td class='text-center'>" + dataObj[i].status_nm + "</td>";
            addList += "	<td class='text-center'>" + dataObj[i].manager_nm + "</td>";
            addList += "	<td class='text-center'>" + complete_dateVal + "</td>";
            addList += "</tr>";

            $("#more_list").append(addList);

            rowIdx++;
        }

        // 진행상태
        $('#more_list > tr').each(function () {
            if ($(this).find('td:eq(3)').html() == "접수" || $(this).find('td:eq(3)').html() == "접수대기") {
                $(this).find('td:eq(3)').html('<span class="label label-inverse">접수중</span>');
            } if ($(this).find('td:eq(3)').html() == "처리중") {
                $(this).find('td:eq(3)').html('<span class="label label-primary">처리중</span>');
            } if ($(this).find('td:eq(3)').html() == "미평가") {
                $(this).find('td:eq(3)').html('<span class="label label-success">미평가</span>');
            } if ($(this).find('td:eq(3)').html() == "완료") {
                $(this).find('td:eq(3)').html('<span class="label label-purple">완료</span>');
            } if ($(this).find('td:eq(3)').html() == "보류") {
                $(this).find('td:eq(3)').html('<span class="label label-info">보류</span>');
            }
        })
    }
}