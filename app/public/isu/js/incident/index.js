'use strict';

var incident_id = ''; //선택 인시던트 id
var rowIdx = 0; //출력 시작 인덱스
var dataCnt = 0; // 출력 종료 인덱스
var inCnt = 3; //한번에 화면에 조회되는 리스트 수

$(document).ready(function () {
    $('#reg_date_from').datepicker({
        //showOn: "both",  
        autoclose: true,
        todayHighlight: true,
        format: "yyyy-mm-dd"
    });

    $('#reg_date_to').datepicker({
        //showOn: "both",  
        autoclose: true,
        todayHighlight: true,
        format: "yyyy-mm-dd"
    });

    //엔터키 이벤트 시
    $('#searchText').keypress(function (e) {
        if (e.keyCode == 13) {
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

    //제목+본문 검색 시
    $('#searchType').on('change', function () {
        research();
    });

    //처리구분 변경 시
    $('#status_cd').on('change', function () {
        research();
    });

    //말줄임
    /*
    $(".truncate1").dotdotdot({
        ellipsis: '...', //말줄임 뭘로 할지
        watch: false, //윈도우 창에따라서 업데이트 할건지, 윈도우가 리사이즈될 때 업데이트할 건지
        wrap: 'letter', //word(단어단위), letter(글 단위), children(자식단위) 자르기
        height: 10,
        tolerance: 30 //글이 넘치면 얼만큼 height 늘릴건지    
    });
    */
});
//다시 조회
function research() {
    dataCnt = 0;
    rowIdx = 0;
    //내용삭제
    $("#more_list").empty();
    getDataList();
}

//데이타 가져오기
function getDataList() {

    var reqParam = 'searchType=' + $('#searchType').val() + '&status_cd=' + $('#status_cd').val() + '&reg_date_from=' + $('#reg_date_from').val() + '&reg_date_to=' + $('#reg_date_to').val() + '&searchText=' + encodeURIComponent($('#searchText').val());
    $.ajax({
        type: "GET",
        async: true,
        url: "/incident/list",
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
            setContent(dataObj);
        }
    });
}

//더보기 버튼 처리
function setMoreBtn(dataObj) {
    if (dataObj.length == 0) { //조회 내용 없음
        var addList = "<div class='col-lg-12'>";
        addList += "    <div class='card-box' align='center'>";
        addList += "        <p><b>조회된 데이타가 없습니다.</b></p>";
        addList += "    </div>";
        addList += "</div>";
        $("#more_view").empty();
        $("#more_view").append(addList);
        return;
    } else {
        if (rowIdx < dataObj.length - 1) { //더보기할 내용이 남아 있을 시
            var addList = "<div class='row'>";
            addList = "        <div class='col-lg-12'>";
            addList += "        <p class='pull-right'><span id='moreBtn' class='text-primary'><b>더보기 >>></b></span></p>";
            addList += "    </div>";
            addList += "</div>";
            $("#more_view").empty();
            $("#more_view").append(addList);

            //더보기 클릭 시
            $('#moreBtn').on('click', function () {
                getDataList();
            });
        } else { //더보기할 내용이 없을 시 
            $("#more_view").empty();
        }
    }
}

//내용 매핑
function setContent(dataObj) {

    //더보기 버튼 처리
    setMoreBtn(dataObj);

    //조회 내용 추가
    if (rowIdx < dataObj.length) {

        if ((rowIdx + inCnt) < dataObj.length) {
            dataCnt = rowIdx + inCnt;
        } else {
            dataCnt = dataObj.length;
        }

        for (var i = rowIdx; i < dataCnt; i++) {

            var register_dateVal = dataObj[i].register_date;

            if (register_dateVal) {
                register_dateVal = register_dateVal.substring(0, 10);
            } else {
                register_dateVal = "";
            }

            var addList = "";
            //addList += "                <div class='col-lg-12'>";
            //addList += "					<div class='card-box'>";
            //addList += "						<div class='forum-container'>";
            addList += "							<div class='forum-item'>";
            addList += "								<div class='row'>";
            addList += "									<div class='col-md-1 forum-info'>";
            if (dataObj[i].status_cd == '1') {
                addList += "										<span class='btn-outline outline-pink'>" + dataObj[i].status_nm + "</span>";
            } else if (dataObj[i].status_cd == '2') {
                addList += "										<span class='btn-outline outline-primary'>" + dataObj[i].status_nm + "</span>";
            } else if (dataObj[i].status_cd == '3') {
                addList += "										<span class='btn-outline outline-success'>" + dataObj[i].status_nm + "</span>";
            } else if (dataObj[i].status_cd == '4') {
                addList += "										<span class='btn-outline outline-warning'>" + dataObj[i].status_nm + "</span>";
            } else if (dataObj[i].status_cd == '5') {
                addList += "										<span class='btn-outline outline-inverse'>" + dataObj[i].status_nm + "</span>";
            }
            addList += "									</div>";
            addList += "									<div class='col-md-11'>";
            addList += "										<div class='forum-sub-title'>";
            addList += "											<span class='text-primary'><b>" + dataObj[i].manager_nm + "</b></span>";
            addList += "											<span class='p-w-xs'>" + dataObj[i].register_date + "</span>";
            addList += "										</div>";
            //addList += "										<a href='/incident/viewDetail/" + dataObj[i]._id + "' class='forum-item-title'>";
            addList += "										<a onclick=detailShow('" + dataObj[i]._id + "') class='forum-item-title'>";
            addList += "											<i class='md md-desktop-windows'></i>" + dataObj[i].title + "";
            addList += "										</a>";
            addList += "									</div>";
            addList += "									<div class='col-md-12'>";
            addList += "										<div class='forum-content truncate1 fh-100' style='word-wrap: break-word;'>";
            //addList += "											<a href='/incident/viewDetail/" + dataObj[i]._id + "'>" + dataObj[i].content + "</a>";
            addList += "											<a onclick=detailShow('" + dataObj[i]._id + "')>" + dataObj[i].content + "</a>";
            addList += "										</div>";
            //addList += "										<a href='/incident/viewDetail/" + dataObj[i]._id + "' class='text-muted text-more'>상세보기</a>";
            addList += "										<a onclick=detailShow('" + dataObj[i]._id + "') class='text-muted text-more'>상세보기</a>";
            addList += "										<div class='forum-level'>";
            addList += "											<p class='text-muted font-13'><b>서비스 만족도:</b>";
            addList += "											    <span name='" + dataObj[i]._id + "' class='m-l-15'>";
            addList += "												    <i class='md md-star text-muted'></i>";
            addList += "												    <i class='md md-star text-muted'></i>";
            addList += "												    <i class='md md-star text-muted'></i>";
            addList += "												    <i class='md md-star text-muted'></i>";
            addList += "												    <i class='md md-star text-muted'></i>";
            addList += "												</span>";
            addList += "											</p>";
            addList += "											<p></p>";
            addList += "										</div>";
            addList += "									</div>";
            addList += "								</div>";
            addList += "							</div>";
            //addList += "						</div>";
            //addList += "					</div>";
            //addList += "				</div>";

            $("#more_list").append(addList);

            var cnt = parseInt(dataObj[i].valuation, 10);
            for (var j = 0; j < cnt; j++) {
                $('.m-l-15:eq(' + i + ') i:eq(' + j + ')').attr('class', 'md md-star text-warning');
            }

            //말줄임

            $(".truncate1").dotdotdot({
                ellipsis: '...', //말줄임 뭘로 할지
                watch: false //윈도우 창에따라서 업데이트 할건지, 윈도우가 리사이즈될 때 업데이트할 건지
                //,wrap: 'letter', //word(단어단위), letter(글 단위), children(자식단위) 자르기
                //height: 30,
                //tolerance: 20 //글이 넘치면 얼만큼 height 늘릴건지    
            });


            //검색어하이라이트
            //$('#aaa').highlight('진행');
            rowIdx++;
        }
    }
}



/**
 * 상세모달호출
 * @param {*} incident_id  
 */
function detailShow(id) {
    //incident id값 세팅
    incident_id = id;

    var reqParam = '';
    $.ajax({
        type: "GET",
        async: true,
        url: "/incident/getIncidentDetail/" + id,
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
function setDetail(dataObj) {
    /**
     * 등록내용 세팅
     */
    $('#_status_nm').html(dataObj.status_nm);

    /**
    * 긴급구분
    */
    if (dataObj.process_speed == "2") {
        $('#_process_speed').html('<span class="label label-warning">✔</span>');
    }

    $('#_filelength').html(dataObj.attach_file.length);
    $('#_higher_nm').html(dataObj.higher_nm);
    $('#_lower_nm').html(dataObj.lower_nm);
    $('#_request_company_nm-request_nm').html(dataObj.request_company_nm + "/" + dataObj.request_nm);
    $('#_request_complete_date').html(dataObj.request_complete_date);
    $('#_app_menu').html(dataObj.app_menu);
    $('#_register_nm-register_date').html(dataObj.register_nm + "/" + dataObj.register_date);
    $('#_title').html(dataObj.title);
    $('#_content').html(dataObj.content);

    if (dataObj.status_cd == '1') {
        $('#_status_nm').addClass('label label-inverse');
    } else if (dataObj.status_cd == '2') {
        $('#_status_nm').addClass('label label-primary');
    } else if (dataObj.status_cd == '3') {
        $('#_status_nm').removeClass();
        $('#_status_nm').addClass('label label-success');
    } else if (dataObj.status_cd == '4') {
        $('#_status_nm').addClass('.label label-purple');
    } else if (dataObj.status_cd == '5') {
        $('#_status_nm').addClass('.label label-info');
    }

    //진행상태 미평가, 완료시 담당자 코멘트 활성화
    if (dataObj.status_cd == '3' || dataObj.status_cd == '4') {
        $('#_complete_box').html('');
        var addList = "";
        addList += "<div class='row'>";
        addList += "    <div class='col-sm-12'>";
        addList += "        <div style='border:1px solid #3bafda' class='card-box m-t-10'><span id='_complete_date' class='pull-right'></span>";
        addList += "            <h4 class='m-t-0 text-primary'><i style='font-size:24px' class='md md-sms m-r-10'></i><b>조치내용</b></h4>";
        addList += "            <hr>";
        addList += "            <p id='_complete_content'></p>";
        addList += "            <hr>";
        addList += "            <div style='min-height:0;' class='widget-user'>";
        addList += "                <div><img src='/assets/images/users/avatar-2.jpg' alt='user' class='img-responsive img-circle'>";
        addList += "                    <div class='wid-u-info'><small class='text-primary'><b>담당자</b></small>";
        addList += "                    <h4 id='_manager_info' class='m-t-5 m-b-5'></h4>";
        addList += "                    <p class='text-muted m-b-5 font-13'><i id='_manager_email' class='md md-mail m-r-5'></i></p>";
        addList += "                </div>";
        addList += "            </div>";
        addList += "        </div>";
        addList += "    </div>";
        addList += "</div>";
        $('#_complete_box').append(addList);
    } else {
        $('#_complete_box').html('');
    }
        
    //진행상태 미평가시 서비스 만족도 활성화
    if (dataObj.status_cd == '3') {
        $('#_service_box').html('');
        var addList = "";
        addList += "<div class='row'>";
        addList += "    <div class='col-lg-12'>";
        addList += "        <div class='card-box'><span class='m-t-0 text-primary'><b>서비스 만족도</b></span>";
        addList += "            <hr>";
        addList += "            <p class='text-inverse m-b-10 m-t-20'>조치내역에 대해 만족하십니까?</p>";
        addList += "            <div class='radio radio-primary radio-inline'>";
        addList += "                <input id='valuation' type='radio' value='5' name='incident[valuation]' checked=''>";
        addList += "                <label for='inlineRadio1' class='font-12'> 매우 만족 </label>";
        addList += "            </div>";
        addList += "            <div class='radio radio-primary radio-inline'>";
        addList += "                <input id='valuation' type='radio' value='4' name='incident[valuation]'>";
        addList += "                <label for='inlineRadio2' class='font-12'> 만족 </label>";
        addList += "            </div>";
        addList += "            <div class='radio radio-primary radio-inline'>";
        addList += "                <input id='valuation' type='radio' value='3' name='incident[valuation]'>";
        addList += "                <label for='inlineRadio3' class='font-13'> 보통 </label>";
        addList += "            </div>";
        addList += "            <div class='radio radio-primary radio-inline'>";
        addList += "                <input id='valuation' type='radio' value='2' name='incident[valuation]'>";
        addList += "                <label for='inlineRadio4' class='font-12'> 불만족 </label>";
        addList += "            </div>";
        addList += "            <div class='radio radio-primary radio-inline'>";
        addList += "                <input id='valuation' type='radio' value='1' name='incident[valuation]'>";
        addList += "                <label for='inlineRadio5' class='font-12'> 매우 불만족 </label>";
        addList += "            </div>";
        addList += "            <p class='text-inverse m-t-20'>불편사항이나 개선사항이 있으시다면 입력해주세요. </p>";
        addList += "            <textarea rows='3' name='incident[valuation_content]' class='form-control'></textarea>";
        addList += "            <div class='text-right m-t-15'>";
        addList += "                <button type='button' class='btn btn-default btn-sm waves-effect waves-light'>확인</button>";
        addList += "            </div>";
        addList += "        </div>";
        addList += "    </div>";
        addList += "</div>";
        $('#_service_box').append(addList);
    } else {
        $('#_service_box').html('');
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
    if (dataObj.complete_open_flag == 'Y') {
        dataObj.complete_open_flag = '공개';
    } else {
        dataObj.complete_open_flag = '비공개';
    }
    $('#_complete_open_flag-reading_cnt').html(dataObj.complete_open_flag);
    $('#_sharing_content').html(dataObj.sharing_content);

    $('#_manager_info').html(dataObj.manager_dept_nm + "  " + dataObj.manager_nm + "  " + dataObj.manager_position);
    $('#_manager_email').html(dataObj.manager_email);


    if(dataObj.status_cd >= '4'){
        $('#_').addClass('label label-purple');
    }


    /*
    if(dataObj.attach_file.length > 0){
        var addList = "";
        addList += "							<tr onclick=detailShow('" + dataObj[i-1]._id + "')>";
        addList += "								<td>" + dataObj[i-1].higher_nm + " / " + dataObj[i-1].lower_nm + "</td>";
        addList += "								<td class='text-center'>" + dataObj[i-1].request_nm + "</td>";
        addList += "								<td class='text-center'>" + register_dateVal + "</td>";
        addList += "								<td class='text-center'>" + dataObj[i-1].status_nm + "</td>";
        addList += "							</tr>";
    
        $("#_aftercomplete").append(addList);

        $('#_aftercomplete').addClass('i fa fa-paperclip m-r-10 m-b-10');
        for(var cnt=0; cnt <dataObj.attach_file.length; cnt++){
            $('#_aftercomplete').html(dataObj.attach_file[cnt].originalname);
        }
       
    }else{

        $('#_aftercomplete').html('');
        $('#_aftercomplete').removeClass();
    }
    */

    

}