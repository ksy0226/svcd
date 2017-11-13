'use strict';

var rowIdx = 0; //출력 시작 인덱스
var dataCnt = 0; // 출력 종료 인덱스
var inCnt = 10; //한번에 화면에 조회되는 리스트 수

$(document).ready(function () {
    //최초 조회
    getDataList();
});

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
            alert(dataObj);
        }
    });
}

//내용 매핑
function setDataList(dataObj) {
    /**
     * 등록내용 세팅
     */
    if (dataObj.status_nm != "접수대기") {
        $('#_status_nm').html(dataObj.status_nm);
    } else {
        $('#_status_nm').html("접수중");
    }

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
            var idValue = dataObj[i]._id;
            var addList = "";
            addList += "							<tr id='dataTR' onclick=window.location='/incident/edit/" + dataObj[i]._id + "'>";
            addList += "								<td>" + dataObj[i].title + "</td>";
            addList += "								<td class='text-center'>" + dataObj[i].created_at + "</td>";
            addList += "								<td class='text-center'>" + dataObj[i].app_menu + "</td>";
            if (dataObj[i].status_cd == '1') {
                addList += "										<span class='label label-inverse'>" + dataObj[i].status_nm + "</span>";
            } else if (dataObj[i].status_cd == '2') {
                addList += "										<span class='label label-primary'>" + dataObj[i].status_nm + "</span>";
            } else if (dataObj[i].status_cd == '3') {
                addList += "										<span class='label label-success'>" + dataObj[i].status_nm + "</span>";
            } else if (dataObj[i].status_cd == '4') {
                addList += "										<span class='label label-purple'>" + dataObj[i].status_nm + "</span>";
            } else if (dataObj[i].status_cd == '5') {
                addList += "										<span class='label label-info'>" + dataObj[i].status_nm + "</span>";
            }
            addList += "								<td class='text-center'>" + dataObj[i].manager_nm + "</td>";
            addList += "								<td class='text-center'>" + dataObj[i].complete_date + "</td>";
            addList += "							</tr>";

            $("#more_list").append(addList);

            rowIdx++;
        }
    }
}