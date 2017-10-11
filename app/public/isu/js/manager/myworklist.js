'use strict';

var rowIdx = 0; //출력 시작 인덱스
var dataCnt = 0; // 출력 종료 인덱스
var inCnt = 16; //한번에 화면에 조회되는 리스트 수


$(document).ready(function () {
    
    $('#datepicker_rcd').datepicker({
        autoclose: true,
        todayHighlight: true,
        format: "yyyy-mm-dd"
    });
    $('#datepicker_rcd2').datepicker({
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
    $('#higher_nm').on('change', function () {
        getLowerProcessList();
        research();
    });
    
    //하위업무 변경 시
    $('#lower_nm').on('change', function () {
        alert($('#lower_nm').val());
        research();
    });

    //TR 클릭 시
    $('#dataTR').on('click', function () {
        alert("22222");
        window.location = $(this).attr('href');
        return false;
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



function getLowerProcessList(){
    var reqParam = 'higher_nm=' + $('#higher_nm').val();
    $.ajax({
        type: "GET",
        url: "/search/getlowerprocess",
        contentType: "application/json",
        data: JSON.stringify({"higher_nm":reqParam}),
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

function setContent(data, higher_nm){
    $('#lower_nm').empty();
    $('#lower_nm').append("<option value=''> 전체</option>");
    
    for(var i=0; i<data.length; i++){
        var lower_nmVal = data[i]["lower_nm"];
        if(data[i]["higher_nm"] == $('#higher_nm').val()){
            $('#lower_nm').append("<option value='"+lower_nmVal+"'>"+data[i]["lower_nm"]+"</option>");
        }
    }
}


function getDataList(){
    if($('#lower_nm').val() ==""){
        $('#lower_nm').val() = "*";
    }
    var reqParam = 'searchType=' + $('#searchType').val() + '&higher_nm=' + $('#higher_nm').val() + '&lower_nm=' + $('#lower_nm').val() + '&datepicker_rcd=' + $('#datepicker_rcd').val()+ '&datepicker_rcd2=' + $('#datepicker_rcd2').val()+ '&searchText=' + $('#searchText').val();

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


//내용 매핑
function setDataList(dataObj) {
    alert('dataObj.length'+dataObj.length);
    
    //더보기 버튼 처리
    //setMoreBtn(dataObj);

    //조회 내용 추가
    if (rowIdx < dataObj.length) {

        if ((rowIdx + inCnt) < dataObj.length) {
            dataCnt = rowIdx + inCnt;
        } else {
            dataCnt = dataObj.length;
        }

        for (var i = rowIdx; i < dataCnt; i++) {
            var register_dateVal = dataObj[i].register_date; 
            register_dateVal = register_dateVal.substring(0,10);
            var idValue = dataObj[i]._id ;
            var addList = "";
            addList += "							<tr id='dataTR' onclick=window.location='/search/viewdetail/" + dataObj[i]._id + "'>";
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


}