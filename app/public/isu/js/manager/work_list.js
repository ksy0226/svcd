'use strict';

var incident_id = ''; //선택 인시던트 id
var higher_cd = '000'//선택 상위코드
var rowIdx = 0; //출력 시작 인덱스
var dataCnt = 0; // 출력 종료 인덱스
var inCnt = 15; //한번에 화면에 조회되는 리스트 수
var totalData = 0;      // 총 데이터 수 

var dataPerPage = 15;   // 한 페이지에 나타낼 데이터 수
var pageCount = 10;      // 한 화면에 나타낼 페이지 수
var totalPage = 0;
var selectedPage = 1;


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
            research(1);
        }
    });
    

    //최초 페이징
    paging(totalData, dataPerPage, pageCount, 1);
    
    //최초 조회
    getDataList(1);
    
    //조회버튼 클릭 시
    $('#searchBtn').on('click', function () {
        $('#lower_cd').val('*');
        research(1);
    });


    //진행상태 변경 시
    $('#status_cd').on('change', function () {
        research(1);
    });
    
    //하위업무 변경 시
    $('#lower_cd').on('change', function () {
        research(1);
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
    
    //접수저장버튼 클릭 시
    $('#receiptSaveBtn').on('click', function () {
        receiptSave();
    });
    
    //완료저장버튼 클릭 시
    $('#completeSaveBtn').on('click', function () {
        completeSave();
    });

    //select박스 초기화
    setSelectBox();


    /**
     * 완료처리 화면
     */
    $('#complete_modal').on('show.bs.modal', function () {
        getQuestionType();
    });
    $('#complete_modal').on('hidden.bs.modal', function () {
        initCompleteModal();
    });

});



/**
 * 다시 조회
 */
function research(selectedPage){
    //dataCnt = 0;
    //rowIdx = 0;

    //내용삭제
    $("#more_list").empty();
    getDataList(selectedPage);
}

/**
 * incident 데이타 조회
 */
function getDataList(selectedPage){
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
            //setDataList(dataObj);
            setDataList(dataObj, selectedPage);
            totalData = dataObj.length;
            totalPage = Math.ceil(totalData/dataPerPage);
            $('#totalPage').text(totalPage);

            paging(totalData, dataPerPage, pageCount, selectedPage);   

        }
    });
}


/**
 * 조회된 incident 내용 매핑
 */
function setDataList(dataObj, selectedPage) {
    //선택한 페이지가 1page 이상일 때,
    //if(selectedPage>1){
        //기존 데이터 삭제
        $("#more_list tr").remove();
    //}

    var startIdx = dataPerPage*(selectedPage-1)+1;
    var endIdx = dataPerPage*selectedPage+1;
    
    //endIdx 가 실제 데이터 수보다 클 경우,
    if(dataObj.length < endIdx){ // 7<16
        endIdx = dataObj.length;
    } 

    if(dataObj.length > 0){
        for(var i = startIdx ; i <endIdx+1 ; i++){ 
            var register_dateVal = dataObj[i-1].register_date; 
            var receipt_dateVal = dataObj[i-1].receipt_date;

            if(register_dateVal){
                register_dateVal = register_dateVal.substring(0,10);
            }else{
                register_dateVal = ""; 
            }

            if(receipt_dateVal){
                receipt_dateVal = receipt_dateVal.substring(0,10);
            }else{
                receipt_dateVal = ""; 
            }

            var addList = "";
            //addList += "							<tr onclick=window.location='/manager/work_detail/" + dataObj[i]._id + "'>";
            //addList += "							<tr style='cursor:hand' onMouserOver='changeColor(this,red)' onMouseOut='changeColer(this,#yellow)' onclick=detailShow('" + dataObj[i]._id + "')>";
            addList += "							<tr onclick=detailShow('" + dataObj[i-1]._id + "')>";
            addList += "								<td class='text-center'>" + dataObj[i-1].process_speed + "</td>";
            addList += "								<td class='text-center'>" + dataObj[i-1].status_cd + "</td>";
            addList += "								<td>" + dataObj[i-1].title + "</td>";
            addList += "								<td>" + dataObj[i-1].request_company_nm +"/"+ dataObj[i-1].request_nm + "</td>";
            addList += "								<td class='text-center'>" + register_dateVal + "</td>";
            addList += "								<td class='text-center'>" + receipt_dateVal + "</td>";
            //addList += "								<td>" + dataObj[i].lower_nm + "</td>";
            addList += "							</tr>";

            $("#more_list").append(addList);

            //rowIdx++;
            startIdx++;
        }
    }else{
        var addList = "";
        addList += "							<tr onclick=detailShow('" + dataObj[i-1]._id + "')>";
        addList += "								<td colspan='6' class='text-center'>조회된 데이타가 없습니다.</td>";
        addList += "							</tr>";
        $("#more_list").append(addList);
    }

    $('#more_list > tr').each(function(){
        
        /**
         * 긴급구분
         */
        if($(this).find('td:eq(0)').html() == "N"){
            $(this).find('td:eq(0)').html('');
        }if($(this).find('td:eq(0)').html() == "Y"){
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
            $(this).find('td:eq(1)').html('<span class="label label-purple">완료</span>');
        }if($(this).find('td:eq(1)').html() == "5"){
            $(this).find('td:eq(1)').html('<span class="label label-info">보류</span>');
        }

    })

}


/**
 * 페이징 처리
 */
function paging(totalData, dataPerPage, pageCount, currentPage){
    
    var totalPage = Math.ceil(totalData/dataPerPage);    // 총 페이지 수
    var pageGroup = Math.ceil(currentPage/pageCount);    // 페이지 그룹

    //검색 시, 총 페이지 수가 화면에 뿌려질 페이지(10개Page)보다 작을 경우 처리
    if(totalPage <= pageCount){
        last = totalPage;
        first = 1;
    }else{
        var last = pageGroup * pageCount;    // 화면에 보여질 마지막 페이지 번호
        if(last > totalPage)
            last = totalPage;
        var first = last - (pageCount-1);    // 화면에 보여질 첫번째 페이지 번호
    }
    
    var next = last+1;
    var prev = first-1;
    

    var html = "";
    
    if(prev > 0)
        html += "<li class='cpaginate_button previous'><a href=# id='prev'>Previous</a></li>";
    for(var i=first; i <= last; i++){
        if(i == currentPage){
            html += "<li class='cpaginate_button active'><a href='#' id=" + i + ">" + i + "</a></li> ";
        }else{
            html += "<li class='cpaginate_button'><a href='#' id=" + i + ">" + i + "</a></li> ";
        }
    }
    
    if(last < totalPage)
        html += "<li class='cpaginate_button next'><a href=# id='next'>Next</a></li>";
    
    $("#paging").html(html);    // 페이지 목록 생성
   
    //$("#paging a").css("color", "black");
    // $("#paging a#" + currentPage).css({"text-decoration":"none", 
    //                                 "color":"red", 
    //                                 "font-weight":"bold"});    // 현재 페이지 표시
    
    
   //페이지 목록 선택 시 페이징 함수, 데이터 조회 함수 호출
    $("#paging a").click(function(){
        $("#more_list").empty();

        var $item = $(this);
        var $id = $item.attr("id");
        selectedPage = $item.text();
        
        if($id == "next")    selectedPage = next;
        if($id == "prev")    selectedPage = prev;

        paging(totalData, dataPerPage, pageCount, selectedPage);
        getDataList(selectedPage);
        
    });
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
            initDetail();
            setDetail(dataObj);
            $('#wdetail_modal').modal('show');
        }
    });
}

/**
 * 상세조회 초기화
 */
function initDetail(){
    

    $('#receiptBtn').attr('style','display:none');
    $('#completeBtn').attr('style','display:none');


    /**
     * 등록내용 세팅
     */
    $('#_status_nm').html('');

    /**
    * 긴급구분
    */
    $('#_process_speed').html('');
    
    $('#_higher_nm').html('');
    $('#_lower_nm').html('');
    $('#_request_company_nm-request_nm').html('');
    $('#_request_complete_date').html('');
    $('#_app_menu').html('');
    $('#_register_nm-register_date').html('');
    $('#_title').html('');
    $('#_content').html('');

    $('#_status_nm').removeClass();

    /**
     * 처리내용 세팅
     */
    $('#_manager_nm').html('');
    $('#_receipt_date').html('');
    $('#_complete_reserve_date').html('');
    $('#_business_level').html('');
    $('#_complete_content').html('');
    $('#_complete_date').html('');
    $('#_need_minute').html('');
    $('#_delay_reason').html('');
    $('#_valuation').html('');
    $('#_complete_open_flag-reading_cnt').html('');
    $('#_sharing_content').html('');
    
}


/**
 * 상세조회 매핑
 */
function setDetail(dataObj){

    //업무처리 버튼처리
    if(dataObj.status_cd == "1"){
        $('#receiptBtn').attr('style','display:');
        $('#completeBtn').attr('style','display:none');
    }else if(dataObj.status_cd == "2"){
        $('#receiptBtn').attr('style','display:none');
        $('#completeBtn').attr('style','display:');
    }else{
        $('#receiptBtn').attr('style','display:none');
        $('#completeBtn').attr('style','display:none');
    }


    //상위코드
    higher_cd = dataObj.higher_cd;

    /**
     * 등록내용 세팅
     */
    if(dataObj.status_nm !="접수대기"){
        $('#_status_nm').html(dataObj.status_nm);
    }else{
        $('#_status_nm').html("접수중");
    }

    /**
    * 긴급구분
    */
    if(dataObj.process_speed == "Y"){
        $('#_process_speed').html('<span class="label label-warning">✔</span>');
    }

    $('#_higher_nm').html(dataObj.higher_nm);
    $('#_lower_nm').html(dataObj.lower_nm);
    $('#_request_company_nm-request_nm').html(dataObj.request_company_nm+"/"+dataObj.request_nm);
    $('#_request_complete_date').html(dataObj.request_complete_date);
    $('#_app_menu').html(dataObj.app_menu);
    //$('#_register_nm-register_date').html(dataObj.register_nm+"/"+dataObj.register_date);
    var register_dateVal = new Date(dataObj.register_date).toISOString().replace(/T/, ' ').replace(/\..+/, '');
    $('#_register_nm-register_date').html(dataObj.register_nm+"/"+register_dateVal);




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
        $('#_status_nm').addClass('label label-purple');
    }else if(dataObj.status_cd == '5'){
        $('#_status_nm').addClass('label label-info');
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
    //$('#_complete_open_flag-reading_cnt').html(dataObj.complete_open_flag+"/"+dataObj.reading_cnt);
    $('#_complete_open_flag-reading_cnt').html(dataObj.complete_open_flag);
    $('#_sharing_content').html(dataObj.sharing_content);


        
    /**
         * 첨부파일
         */
    if(dataObj.attach_file.length > 0){
        $('#_attach').html('');

        for(var cnt=0; cnt <dataObj.attach_file.length; cnt++){
            var fileList = "";
            fileList += "<a href='/search/download/" + dataObj.attach_file[cnt].path + "'>";
            fileList += "<span class='text-pink'> " + dataObj.attach_file[cnt].originalname +  "</span>";
            fileList += "<span class='text-muted.m-l-10'> " + "(" + dataObj.attach_file[cnt].size + " Byte)" +  "</span>";
            //$('#_attach').addClass('i fa fa-paperclip m-r-10 m-b-10');
            $('#_attach').append("<td class='i fa fa-paperclip m-r-10 m-b-10'>" + fileList +"</td>");
        } 
        
    }else{
        $('#_attach').html('');
        $('#_attach').removeClass();
    }

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
    $('select[name="incident[business_level]"]').empty();
    $('select[name="incident[business_level]"]').append("<option value='S'>S</option>");
    $('select[name="incident[business_level]"]').append("<option value='A' selected>A</option>");
    $('select[name="incident[business_level]"]').append("<option value='B'>B</option>");
    $('select[name="incident[business_level]"]').append("<option value='C'>C</option>");
    $('select[name="incident[business_level]"]').append("<option value='D'>D</option>");
}

/**
 * Datepicker 오늘 날짜 설정
 */ 
function setDatepickerToday(datepicker) {
    var d = new Date();
    datepicker.datepicker("setDate", new Date(d.getFullYear(), d.getMonth(), d.getDate()));
}

//>>================== 접수처리 스크립트 ==============
/**
 * 접수 내용 저장
 */
function receiptSave(){
    var reqParam = $('#receipt_form').serialize();
    reqParam += "&incident[lower_nm]="+$('select[name="incident[lower_cd]"] option:selected').text();
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
                $('.modal').modal('hide');
                initReceiptModal();
                research(selectedPage);
            }else{
                alert('e : '+JSON.stringify(dataObj));
            }
        }
    });
}

/**
 * 접수모달 초기화
 */
function initReceiptModal(){
    $('textarea[name="incident[receipt_content]"]').val('접수하였습니다.');
    setDatepickerToday($('input[name="incident[complete_reserve_date]"]'));
    $('select[name="complete_hh"]').val('18');
    $('select[name="complete_mi"]').val('00');
    $('select[name="incident[lower_cd]"] option:eq(0)').attr("selected", "selected");
    $('select[name="incident[business_level]"]').val('A');
}
//<<================== 접수처리 스크립트 ==============

//>>================== 완료처리 스크립트 ==============
/**
 * 완료 내용 저장
 */
function completeSave(){
    var reqParam = $('#complete_form').serialize();
    reqParam += "&incident[process_nm]="+$('select[name="incident[process_cd]"] option:selected').text();
    $.ajax({
        type: "POST",
        async: true,
        url: "/manager/saveComplete/"+incident_id,
        dataType: "json", // xml, html, script, json 미지정시 자동판단
        timeout: 30000,
        cache: false,
        data: reqParam,
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        error: function (request, status, error) {
            alert("completeSave error : " + error);
        },
        beforeSend: function () {
        },
        success: function (dataObj) {
            if(dataObj.success){
                $('.modal').modal('hide');
                initCompleteModal();
                research(selectedPage);
            }else{
                alert('e : '+JSON.stringify(dataObj));
            }
        }
    });
}

/**
 * 완료모달 초기화
 */
function initCompleteModal(){
    $('select[name="incident[process_gubun]"]').empty();
    $('textarea[name="incident[complete_content]"]').val('');
    $('textarea[name="incident[work_time]"]').val('1');
    $('textarea[name="incident[delay_reason]"]').val('');
    $('textarea[name="incident[sharing_content]"]').val('');
}

/**
 * 요청타입 세팅
 */
function getQuestionType(){
    var reqParam = "";
    $.ajax({
        type: "GET",
        async: true,
        url: "/processGubun/getJSON/"+higher_cd,
        dataType: "json", // xml, html, script, json 미지정시 자동판단
        timeout: 30000,
        cache: false,
        data: reqParam,
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        error: function (request, status, error) {
            alert("error : " + error + " : "+JSON.stringify(request));
        },
        beforeSend: function () {
        },
        success: function (dataObj) {
            setQuestionType(dataObj);
        }
    });
}

/**
 * 요청타입 세팅
 */
function setQuestionType(dataObj){
    $('select[name="incident[process_cd]"]').empty();
    for(var i = 0 ; i < dataObj.length ; i++){
        $('select[name="incident[process_cd]"]').append("<option value='"+dataObj[i].process_cd+"'>"+dataObj[i].process_nm+"</option>");
    }
}

//<<================== 완료처리 스크립트 ==============





