'use strict';


var rowIdx = 0; //출력 시작 인덱스
var dataCnt = 0; // 출력 종료 인덱스
var inCnt = 3; //한번에 화면에 조회되는 리스트 수

$(document).ready(function () {

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
function research(){
    dataCnt = 0;
    rowIdx = 0;
    //내용삭제
    $("#more_list").empty();
    getDataList();
}
 
//데이타 가져오기
function getDataList() {

    var reqParam = 'searchType=' + $('#searchType').val() + '&status_cd=' + $('#status_cd').val() + '&searchText=' + $('#searchText').val();
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
function setMoreBtn(dataObj){
    if(dataObj.length == 0){ //조회 내용 없음
        var addList = "<div class='col-lg-12'>";
        addList += "    <div class='card-box' align='center'>";
        addList += "        <p><b>조회된 데이타가 없습니다.</b></p>";
        addList += "    </div>";
        addList += "</div>";
        $("#more_view").empty();
        $("#more_view").append(addList);
        return;
    }else{
        if(rowIdx < dataObj.length-1){ //더보기할 내용이 남아 있을 시
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
        }else{ //더보기할 내용이 없을 시 
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
            addList += "										<a href='/incident/viewDetail/" + dataObj[i]._id + "' class='forum-item-title'>";
            addList += "											<i class='md md-desktop-windows'></i>" + dataObj[i].title + "";
            addList += "										</a>";
            addList += "									</div>";
            addList += "									<div class='col-md-12'>";
            addList += "										<div class='forum-content truncate1 fh-100' style='word-wrap: break-word;'>";
            addList += "											<a href='/incident/viewDetail/" + dataObj[i]._id + "'>" + dataObj[i].content + "</a>";
            addList += "										</div>";
            addList += "										<a href='/incident/viewDetail/" + dataObj[i]._id + "' class='text-muted text-more'>상세보기</a>";
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