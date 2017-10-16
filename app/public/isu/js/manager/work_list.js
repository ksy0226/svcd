'use strict';

var incident_id = ''; //선택 인시던트 id
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
        $('#lower_cd').val('*');
        research();
    });
    

    //진행상태 변경 시
    $('#status_cd').on('change', function () {
        research();
    });
    
    //하위업무 변경 시
    $('#lower_cd').on('change', function () {
        research();
    });

    //접수 모달 호출 시 포커스
    $('#receipt_modal').on('shown', function () {
        $('input[name="incident[receipt_content]"]').focus();
    });
    
    


    /**
     * 접수처리 화면
     */
    $('input[name="incident[complete_reserve_date]"]').datepicker({
        autoclose: true,
        todayHighlight: true,
        format: "yyyy-mm-dd",
    });
    //오늘날짜 설정
    setDatepickerToday($('input[name="incident[complete_reserve_date]"]'));
    
    //저장버튼 클릭 시
    $('#receiptSaveBtn').on('click', function () {
        receiptSave();
    });
    
    //select박스 초기화
    setSelectBox();


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
    var reqParam = 'searchType=' + $('#searchType').val() + '&status_cd=' + $('#status_cd').val() 
                 + '&lower_cd=' + $('#lower_cd').val() + '&reg_date_from=' 
                 + $('#reg_date_from').val()+ '&reg_date_to=' + $('#reg_date_to').val()
                 + '&searchText=' + encodeURIComponent($('#searchText').val());

    $.ajax({
        type: "GET",
        async: true,
        url: "/incident/getIncident",
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
            //addList += "							<tr onclick=window.location='/manager/work_detail/" + dataObj[i]._id + "'>";
            //addList += "							<tr style='cursor:hand' onMouserOver='changeColor(this,red)' onMouseOut='changeColer(this,#yellow)' onclick=detailShow('" + dataObj[i]._id + "')>";
            addList += "							<tr onclick=detailShow('" + dataObj[i]._id + "')>";
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
         * 긴급구분
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

}

/**
 * 상세모달호출
 * @param {*} incident_id  
 */
function detailShow(id){
    //incident id값 세팅
    incident_id = id;

    var reqParam = '';
    $.ajax({
        type: "GET",
        async: true,
        url: "/incident/getIncidentDetail/"+id,
        dataType: "json", // xml, html, script, json 미지정시 자동판단
        timeout: 30000, //제한 시간
        cache: false,
        data: reqParam, // $($('form')).serialize()
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        error: function (request, status, error) {
            alert("error : " + error);
        },
        beforeSend: function () {
        },
        success: function (dataObj) {
            setDetail(dataObj);
            $('#wdetail_modal').modal('show');
        }
    });
}

/**
 * 상세조회 매핑
 */
function setDetail(dataObj){

    /**
     * 등록내용 세팅
     */
    $('#_status_nm').html(dataObj.status_nm);
    $('#_process_speed').html(dataObj.process_speed);
    $('#_higher_nm').html(dataObj.higher_nm);
    $('#_lower_nm').html(dataObj.lower_nm);
    $('#_request_company_nm-request_nm').html(dataObj.request_company_nm+"/"+dataObj.request_nm);
    $('#_request_complete_date').html(dataObj.request_complete_date);
    $('#_app_menu').html(dataObj.app_menu);
    $('#_register_nm-register_date').html(dataObj.register_nm+"/"+dataObj.register_date);
    $('#_title').html(dataObj.title);
    $('#_content').html(dataObj.content);

    if(dataObj.status_cd == '1'){
        $('#_status_nm').addClass('label label-inverse');
    }else if(dataObj.status_cd == '2'){
        $('#_status_nm').addClass('label label-primary');
    }else if(dataObj.status_cd == '3'){
        $('#_status_nm').removeClass();
        $('#_status_nm').addClass('label label-success');
    }else if(dataObj.status_cd == '4'){
        $('#_status_nm').addClass('.label label-purple');
    }else if(dataObj.status_cd == '5'){
        $('#_status_nm').addClass('.label label-info');
    }

    /**
     * 처리내용 세팅
     */
    $('#_manager_nm').html(dataObj.manager_nm);
    $('#_receipt_date').html(dataObj.receipt_date);
    $('#_complete_reserve_date').html(dataObj.complete_reserve_date);
    $('#_business_level').html(dataObj.business_level);
    $('#_complete_content').html(dataObj.complete_content);
    $('#_complete_date').html(dataObj.complete_date);
    $('#_need_minute').html(dataObj.need_minute);
    $('#_delay_reason').html(dataObj.delay_reason);
    $('#_valuation').html(dataObj.valuation);
    if(dataObj.complete_open_flag == 'Y'){
        dataObj.complete_open_flag = '공개';
    }else{
        dataObj.complete_open_flag = '비공개';
    }
    $('#_complete_open_flag-reading_cnt').html(dataObj.complete_open_flag+"/"+dataObj.reading_cnt);
    $('#_sharing_content').html(dataObj.sharing_content);

}


//>>================== 접수처리 스크립트 ==============
/**
 * 접수 내용 저장
 */
function receiptSave(){
    var reqParam = $('#receipt_form').serialize();
    $.ajax({
        type: "POST",
        async: true,
        url: "/manager/saveReceipt/"+incident_id,
        dataType: "json", // xml, html, script, json 미지정시 자동판단
        timeout: 30000,
        cache: false,
        data: reqParam,
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        error: function (request, status, error) {
            alert("receiptSave error : " + error);
        },
        beforeSend: function () {
        },
        success: function (dataObj) {
            if(dataObj.success){
                //$('#receipt_modal').modal('hide')
                //$('#wdetail_modal').modal('hide');
                //research();
            }else{
                alert('e : '+JSON.stringify(dataObj));
            }
        }
    });
}

/**
 * select박스 초기화
 */
function setSelectBox(){

    //시간 세팅
    $('select[name="complete_hh"]').empty();
    for(var i = 0; i < 24; i++){
        if(i < 10){
            $('select[name="complete_hh"]').append("<option value='0"+i+"'>0"+i+"</option>");
        }else{
            $('select[name="complete_hh"]').append("<option value='"+i+"'>"+i+"</option>");
        }
    }
    $('select[name="complete_hh"]').val('18');

    //분 세팅
    $('select[name="complete_mi"]').empty();
    $('select[name="complete_mi"]').append("<option value='00'>00</option>");
    $('select[name="complete_mi"]').append("<option value='10'>10</option>");
    $('select[name="complete_mi"]').append("<option value='20'>20</option>");
    $('select[name="complete_mi"]').append("<option value='30'>30</option>");
    $('select[name="complete_mi"]').append("<option value='40'>40</option>");
    $('select[name="complete_mi"]').append("<option value='50'>50</option>");

    //난이도 세팅
    $('select[name="incident[complete_reserve_date]"]').empty();
    $('select[name="incident[complete_reserve_date]"]').append("<option value='S'>S</option>");
    $('select[name="incident[complete_reserve_date]"]').append("<option value='A'>A</option>");
    $('select[name="incident[complete_reserve_date]"]').append("<option value='B'>B</option>");
    $('select[name="incident[complete_reserve_date]"]').append("<option value='C'>C</option>");
    $('select[name="incident[complete_reserve_date]"]').append("<option value='D'>D</option>");

}

/**
 * Datepicker 오늘 날짜 설정
 */ 
function setDatepickerToday(datepicker) {
    var d = new Date();
    datepicker.datepicker("setDate", new Date(d.getFullYear(), d.getMonth(), d.getDate()));
}
//<<================== 접수처리 스크립트 ==============