'use strict';

var rowIdx = 0; //출력 시작 인덱스
var dataCnt = 0; // 출력 종료 인덱스
var inCnt = 15; //한번에 화면에 조회되는 리스트 수

$(document).ready(function () {

    $('#reg_date_from').datepicker({
        autoclose: true,
        todayHighlight: true,
        format: "yyyy-mm-dd"
    });
    $('#reg_date_to').datepicker({
        autoclose: true,
        todayHighlight: true,
        format: "yyyy-mm-dd"
    });
    
    //엔터키 이벤트 시
    $('#searchText').keypress(function(e){
        if(e.keyCode == 13) {
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
    $('#higher_cd').on('change', function () {
        getLowerProcessList();
        research();
    });
    
    //하위업무 변경 시
    $('#lower_cd').on('change', function () {
        research();
    });

});

//다시 조회
function research(){
    dataCnt = 0;
    rowIdx = 0;

    //내용삭제
    $("#more_list").empty();
    getDataList();
}


/**
 * 하위업무 가져오기
 */
function getLowerProcessList(){
    var reqParam = 'higher_cd=' + $('#higher_cd').val();
    $.ajax({
        type: "GET",
        url: "/search/getlowerprocess",
        contentType: "application/json",
        data: JSON.stringify({"higher_cd":reqParam}),
        dataType: "json",
        success: function(data, status){
            setContent(data, reqParam);
        },
        error: function(data, status, err) {
            logger.debug("err : "+err);
            return;
        }
    });
}
/**
 * 하위업무 뿌리기
 */
function setContent(data, higher_cd){

    $('#lower_cd').empty();
    $('#lower_cd').append("<option value=''> 전체</option>");
    
    for(var i=0; i<data.length; i++){
        var lower_cdVal = data[i]["lower_cd"];
        if(data[i]["higher_cd"] == $('#higher_cd').val()){
            $('#lower_cd').append("<option value='"+lower_cdVal+"'>"+data[i]["lower_nm"]+"</option>");
        }
    }
}

/**
 * 선택된 리스트 가져오기 (상/하위업무 구분, 검색어, 날짜)
 */
function getDataList(){
    
    if($('#lower_cd').val() =="" || $('#lower_cd').val() ==null){
        $('#lower_cd').val("*");
    }
    var reqParam = 'searchType=' + $('#searchType').val() + '&higher_cd=' + $('#higher_cd').val() + '&lower_cd=' + $('#lower_cd').val() + '&reg_date_from=' + $('#reg_date_from').val()+ '&reg_date_to=' + $('#reg_date_to').val()+ '&searchText=' + encodeURIComponent($('#searchText').val());
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
            setDataList(dataObj);
        }
    });
}
function getPagingData(dataPerPage, selectedPage){
    alert("선택한 페이지   :   " + selectedPage);
    alert("페이지당 수    :   " + dataPerPage);
    
    var startIdx = dataPerPage*(selectedPage-1)+1; 
    var endIdx = dataPerPage*selectedPage+1; 
    
    for(var i = startIdx; i<endIdx; i++){
        //alert();
    }

    //for(var i = (dataPerPage*(selectedPage-1)+1 ; i < dataPerPage*selectedPage+1 ; i++){
        //alert("1"+dataPerPage*selectedPage);
        //alert("2"+dataPerPage*selectedPage+1);
        /*
        var register_dateVal = dataObj[i].register_date; 
        register_dateVal = register_dateVal.substring(0,10);
        var idValue = dataObj[i]._id ;
        var addList = "";
        addList += "							<tr onclick=window.location='/search/user_detail/" + dataObj[i]._id + "'>";
        addList += "								<td>" + dataObj[i].higher_nm + "</td>";
        addList += "								<td>" + dataObj[i].lower_nm + "</td>";
        addList += "								<td>" + dataObj[i].title + "</td>";
        addList += "								<td>" + register_dateVal + "</td>";
        addList += "								<td>" + dataObj[i].manager_nm + "</td>";
        addList += "							</tr>";

        $("#more_list").append(addList);

        dataCntStart = dataCntStart+1;
        */


    //}



}
/**
 * 선택된 내용 매핑하기
 */
function setDataList(dataObj) {

    if (rowIdx < dataObj.length) {

        if ((rowIdx + inCnt) < dataObj.length) {
            dataCnt = rowIdx + inCnt;
            alert("dataCnt 데이터 수  : " +dataCnt);
        } else {
            dataCnt = dataObj.length;
        }
        //if(dataCnt < dataObj.length){
            for (var i = rowIdx; i < dataCnt; i++) {
                var register_dateVal = dataObj[i].register_date; 
                register_dateVal = register_dateVal.substring(0,10);
                var idValue = dataObj[i]._id ;
                var addList = "";
                addList += "							<tr onclick=window.location='/search/user_detail/" + dataObj[i]._id + "'>";
                addList += "								<td>" + dataObj[i].higher_nm + "</td>";
                addList += "								<td>" + dataObj[i].lower_nm + "</td>";
                addList += "								<td>" + dataObj[i].title + "</td>";
                addList += "								<td>" + register_dateVal + "</td>";
                addList += "								<td>" + dataObj[i].manager_nm + "</td>";
                addList += "							</tr>";

                $("#more_list").append(addList);

                rowIdx++;
            }

            //dataCnt = dataCnt * 2; //

            //alert("dataCnt*2 = "+dataCnt);

            /*for (var i = rowIdx; i < dataCnt; i++) {
                alert("for"+dataCnt);
                var register_dateVal = dataObj[i].register_date; 
                register_dateVal = register_dateVal.substring(0,10);
                var idValue = dataObj[i]._id ;
                var addList = "";
                addList += "							<tr onclick=window.location='/search/user_detail/" + dataObj[i]._id + "'>";
                addList += "								<td>" + dataObj[i].higher_nm + "</td>";
                addList += "								<td>" + dataObj[i].lower_nm + "</td>";
                addList += "								<td>" + dataObj[i].title + "</td>";
                addList += "								<td>" + register_dateVal + "</td>";
                addList += "								<td>" + dataObj[i].manager_nm + "</td>";
                addList += "							</tr>";

                $("#more_list").append(addList);

                rowIdx++;
            }
            */

        //}else{
        //    alert("dataCnt 수가 더 크거나 같음");
        //}

    }

}
