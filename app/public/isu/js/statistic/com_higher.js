'use strict';

$(document).ready(function () {

    getHigherProcess();
    
    //조회 버튼 클릭 시
    $('#searchBtn').on('click', function () {
        getComHigherSt();
    });

    //상위업무 선택 시
    $('#higher_cd').on('change', function () {
        getComHigherSt();
    });

    //연도 선택 시
    $('#yyyy').on('click', function () {
        getComHigherSt();
    });

    //월 선택 시
    $('#mm').on('click', function () {
        getComHigherSt();
    });
    
    
});


/**
 * rowSpan 합치기
 */
function rowSpan(){
    $(".target-table").rowspanizer({
        //합치고자 하는 row 지정
        //cols : [0, 1, 4], 
        cols : [0],
        vertical_align: "middle"
    });
}

/**
 * 회사별 상위업무 통계 가져오기
 */
function getComHigherSt(){

    $("#more_list").empty();

    var reqParam = 'higher_cd=' + $('#higher_cd').val() + '&yyyy=' + $('#yyyy').val() + '&mm=' + $('#mm').val() ;
    $.ajax({          
        type: "GET",
        async: true,
        url: "/statistic/getComHigher/",
        contentType: "application/json",
        data : reqParam,
        dataType: "json", 
        error: function (request, status, error) {
            alert("getHighLower : " + error+ " "+request.responseText);
        },         
        success: function( data ) { 
            setComHigherSt(data);
            
        }             
    }); 
}

/**
 * 회사별 상위업무 통계 display
 */
function setComHigherSt(dataObj){
    //alert(JSON.stringify(dataObj));
   

    if (dataObj.length > 0) {
        for (var i = 0; i < dataObj.length; i++) {
    
            var addList = "";
            addList += "<tr>";
            addList += "    <td class='text-center'>" + dataObj[i]._id.request_company_nm + "</td>";
            addList += "    <td class='text-center'>" + dataObj[i]._id.higher_nm + "</td>";
            addList += "    <td class='text-center'>" + dataObj[i].totalCnt + "</td>";
            addList += "    <td class='text-center'>" + dataObj[i].stCnt2+ "</td>";
            addList += "    <td class='text-center'>" + dataObj[i].stCnt3_4 + "</td>";
            addList += "    <td class='text-center'>" + dataObj[i].stCnt5 + "</td>";
            addList += "    <td class='text-center'>" + dataObj[i].solRatio + "</td>";
            addList += "    <td class='text-center'>" + dataObj[i].valAvg + "</td>";
            addList += "</tr>";
          
            $("#more_list").append(addList);
        }
    } else {
        var addList = "";
        addList += "<tr>";
        addList += "    <td colspan='8' class='text-center'>조회된 데이타가 없습니다.</td>";
        addList += "</tr>";

        $("#more_list").append(addList);
    }
    //var rs = new rowSpan();
    //rs.init();
    rowSpan();
}



/**
 * 상위 업무 조회
 */
function getHigherProcess() {
    $.ajax({
        type: "GET",
        async: true,
        url: "/higherProcess/getHigher/",
        contentType: "application/json",
        //data : reqParam,
        dataType: "json",
        error: function (request, status, error) {
            alert("getHigher : " + error + " " + request.responseText);
        },
        success: function (data) {
            setHigherProcess(data);
        }
    });
}

/**
 * 상위 업무 세팅
 */

function setHigherProcess(data) {
    
    $('#higher_cd').empty();
    $('#higher_cd').append("<option value='*' selected>전체</option>");
    for (var i = 0; i < data.length; i++) {
        $('#higher_cd').append("<option value='" + data[i]["higher_cd"] + "'>" + data[i]["higher_nm"] + "</option>");
    }

    //상위업무 세팅이 끝나면 조회한다.
    getComHigherSt();

}


