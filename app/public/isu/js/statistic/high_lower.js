'use strict';

$(document).ready(function () {

    getCompany();

    //조회 버튼 클릭 시
    $('#searchBtn').on('click', function () {
        getHighLowerSt();
    });

    //회사 선택 시
    $('#company_cd').on('change', function () {
        getHighLowerSt();
    });

    //연도 선택 시
    $('#yyyy').on('click', function () {
        getHighLowerSt();
    });

    //월 선택 시
    $('#deselect-all').on('click', function () {
        getHighLowerSt();
    });

     

});

/**
 * 상위업무별 하위업무 통계 가져오기
 */
function getHighLowerSt(){

    $("#more_list").empty();

    var reqParam = 'company_cd=' + $('#company_cd').val() + '&yyyy=' + $('#yyyy').val() + '&mm=' + $('#mm').val() ;
    $.ajax({          
        type: "GET",
        async: true,
        url: "/statistic/getHighLower/",
        contentType: "application/json",
        data : reqParam,
        dataType: "json", 
        error: function (request, status, error) {
            alert("getHighLower : " + error+ " "+request.responseText);
        },         
        success: function( data ) { 
            setHighLower(data);
            
        }             
    }); 
}

/**
 * 상위업무별 하위업무 통계 display
 */
function setHighLower(dataObj){
    //alert(JSON.stringify(dataObj));
   

    if (dataObj.length > 0) {
        for (var i = 0; i < dataObj.length; i++) {
    
            var addList = "";
            addList += "<tr>";
            addList += "    <td class='text-left'>" + dataObj[i]._id.higher_nm + "</td>";
            addList += "    <td class='text-left'>" + dataObj[i]._id.lower_nm + "</td>";
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
    
    rowSpan();
}

/**
 * rowSpan 합치기
 */
function rowSpan(){
    

    $("#target-table").rowspanizer({
        //합치고자 하는 row 지정
        //cols : [0, 1, 4], 
        cols : [0],
        vertical_align: "middle"
    });
}

/**
 * 회사 정보 조회
 */
function getCompany() {
    //var reqParam = 'company_cd=' + company_cd ;
    $.ajax({
        type: "GET",
        async: true,
        url: "/company/getCompany/",
        contentType: "application/json",
        //data : reqParam,
        dataType: "json",
        error: function (request, status, error) {
            alert("getCompany : " + error + " " + request.responseText);
        },
        success: function (data) {
            setCompany(data);
        }
    });
}

/**
 * 회사 정보 세팅
 */
function setCompany(data) {
    $('#company_cd').empty();
    $('#company_cd').append("<option value='*' selected>전체</option>");
    for (var i = 0; i < data.length; i++) {
        $('#company_cd').append("<option value='" + data[i]["company_cd"] + "'>" + data[i]["company_nm"] + "</option>");
    }

    
    //회사 세팅이 끝나면 조회한다.
    getHighLowerSt();


}

