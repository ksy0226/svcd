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

    //최초 페이징
    paging(totalData, dataPerPage, pageCount, 1);
    
    //최초 조회
    getDataList(1);

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
function research(selectedPage){
    dataCnt = 0;
    rowIdx = 0;

    //내용삭제
    $("#more_list").empty();
    getDataList(selectedPage);
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



var totalData = 322;    // 총 데이터 수
var dataPerPage = 15;    // 한 페이지에 나타낼 데이터 수
var pageCount = 6;       // 한 화면에 나타낼 페이지 수

/**
 * 페이징 처리
 */
function paging(totalData, dataPerPage, pageCount, currentPage){
    
    var totalPage = Math.ceil(totalData/dataPerPage);    // 총 페이지 수
    var pageGroup = Math.ceil(currentPage/pageCount);    // 페이지 그룹
    alert("currentPage : " + currentPage);
    alert("pageGroup : " + pageGroup);
    
    var last = pageGroup * pageCount;    // 화면에 보여질 마지막 페이지 번호
    if(last > totalPage)
        last = totalPage;
    var first = last - (pageCount-1);    // 화면에 보여질 첫번째 페이지 번호
    var next = last+1;
    var prev = first-1;
    
    //alert("last : " + last);
    //alert("first : " + first);
    //alert("next : " + next);
    //alert("prev : " + prev);

    var $pingingView = $("#paging");
    
    var html = "";
    
    if(prev > 0)
        html += "<a href=# id='prev'><<< Prev</a> ";
    for(var i=first; i <= last; i++){
        html += "<a href='#' id=" + i + ">" + i + "</a> ";
    }
    
    if(last < totalPage)
        html += "<a href=# id='next'> Next >>></a>";
    
    $("#paging").html(html);    // 페이지 목록 생성
    $("#paging a").css("color", "black");
    $("#paging a#" + currentPage).css({"text-decoration":"none", 
                                    "color":"red", 
                                    "font-weight":"bold",});    // 현재 페이지 표시
    
    //페이지 목록 선택 시 1페이징 함수, 2데이터 조회 함수 호출
    $("#paging a").click(function(){
        
        var $item = $(this);
        var $id = $item.attr("id");
        var selectedPage = $item.text();
        
        if($id == "next")    selectedPage = next;
        if($id == "prev")    selectedPage = prev;
        
        paging(totalData, dataPerPage, pageCount, selectedPage);
        //getPagingData(dataPerPage, selectedPage);
        getDataList(selectedPage);
    });
                                    
}

/**
 * 데이터 조회-(상/하위업무 구분, 검색어, 날짜 중) 선택된 리스트 가져오기 
 */
function getDataList(selectedPage){
    alert("getDataList 함수 selectedPage" + selectedPage);
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
            //리스트에 내용 매핑
            setDataList(dataObj, selectedPage);
        }
    });
}


/**
 * 선택된 내용 매핑하기
 */
function setDataList(dataObj, selectedPage) {
    alert("setDataList 함수 "+ selectedPage);
    alert("setDataList 선택한 페이지   :   " + selectedPage);

    //선택한 페이지가 1page 이상일 때,
    if(selectedPage>1){
        //기존 데이터 삭제
        $("#more_list tr").remove();
    }

    //var totalData = dataObj.length();
    //alert("totalData 토탈데이터 수" + totalData);
    
    dataPerPage = 15;   //페이지당 수
    
    var startIdx = dataPerPage*(selectedPage-1)+1; 
    var endIdx = dataPerPage*selectedPage+1; 
    if (startIdx < dataObj.length) {
        for(var i = startIdx ; i < endIdx ; i++){
            alert(i+"번째"+dataObj[i].title);
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

            startIdx++;
            
        }
    }else{
        $("#more_list tr").remove();
        addList += $("#more_list").append("<tr><td colspan='5'>조회된 데이터가 없습니다.</td></tr>");

    }




    /*
    if(selectedPage >1){
        $("#more_list").remove();
    }
    */
    /*
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
    
    }
    */
    


}
