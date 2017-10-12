'use strict';

var rowIdx = 0; //출력 시작 인덱스
var dataCnt = 0; // 출력 종료 인덱스
var inCnt = 16; //한번에 화면에 조회되는 리스트 수

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
    $('#status_cd').on('change', function () {
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


function getDataList(){
    if($('#lower_cd').val() ==""){
        $('#lower_cd').val() = "*";
    }
    var reqParam = 'searchType=' + $('#searchType').val() + '&status_cd=' + $('#status_cd').val() + '&lower_cd=' + $('#lower_cd').val() + '&reg_date_from=' + $('#reg_date_from').val()+ '&reg_date_to=' + $('#reg_date_to').val()+ '&searchText=' + $('#searchText').val();

    $.ajax({
        type: "GET",
        async: true,
        url: "/manager/getIncident",
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
    
    //조회 내용 추가
    if (rowIdx < dataObj.length) {

        if ((rowIdx + inCnt) < dataObj.length) {
            dataCnt = rowIdx + inCnt;
        } else {
            dataCnt = dataObj.length;
        }

        for (var i = rowIdx; i < dataCnt; i++) {
            
            var addList = "";
            addList += "							<tr onclick=window.location='/manager/work_detail/" + dataObj[i]._id + "'>";
            addList += "								<td class='text-center'>" + dataObj[i].process_speed + "</td>";
            addList += "								<td class='text-center'>" + dataObj[i].status_cd + "</td>";
            addList += "								<td>" + dataObj[i].title + "</td>";
            addList += "								<td>" + dataObj[i].request_company_nm +"/"+ dataObj[i].request_nm + "</td>";
            addList += "								<td class='text-center'>" + dataObj[i].register_date + "</td>";
            addList += "								<td class='text-center'>" + dataObj[i].receipt_date + "</td>";
            //addList += "								<td>" + dataObj[i].lower_nm + "</td>";
            addList += "							</tr>";

            $("#more_list").append(addList);

            rowIdx++;
        }
    }

    $('#more_list > tr').each(function(){
        
        /**
         * 진행상태
         */
        if($(this).find('td:eq(0)').html() == "1"){
            $(this).find('td:eq(0)').html('');
        }if($(this).find('td:eq(0)').html() == "2"){
            $(this).find('td:eq(0)').html('<span class="label label-warning">✔</span>');
        }

        /**
         * 진행상태
         */
        if($(this).find('td:eq(1)').html() == "1"){
            $(this).find('td:eq(1)').html('<span class="label label-inverse">접수중</span>');
        }if($(this).find('td:eq(1)').html() == "2"){
            $(this).find('td:eq(1)').html('<span class="label label-primary">처리중</span>');
        }if($(this).find('td:eq(1)').html() == "3"){
            $(this).find('td:eq(1)').html('<span class="label label-success">미평가</span>');
        }if($(this).find('td:eq(1)').html() == "4"){
            $(this).find('td:eq(1)').html('<span class="font-12 text-purple">완&nbsp;&nbsp;료</span>');
        }if($(this).find('td:eq(1)').html() == "5"){
            $(this).find('td:eq(1)').html('<span class="label label-info">보 류</span>');
        }

    })

    /**
     * 긴급구분
     */

}
