'use strict';

var	dataCnt = 0;
var	rowIdx = 0;
var inCnt = 3;//증가개수 
var	dataObj = null;
$(document).ready(function () {
    alert(0);
    dataObj= incidentObj;
    $('#moreView').on('click',function(){
        alert(1);
        moreView();
    });
});



function moreView(){

    if(rowIdx < dataObj.jsonData.length){
		if((rowIdx+inCnt) < dataObj.jsonData.length){
			dataCnt = rowIdx + inCnt;
		}else{
			dataCnt = dataObj.jsonData.length;
		} 
	}
		
	for(i=rowIdx ; i < dataCnt ; i++){
            
        var addlist = "";
        addList += "				<div class="col-lg-12">                                                                                      ";
        addList += "					<div class="card-box">                                                                                   ";
        addList += "						<div class="forum-container">                                                                        ";
        addList += "							<div class="forum-item">                                                                         ";
        addList += "								<div class="row">                                                                            ";
        addList += "									<div class="col-md-1 forum-info">                                                        ";
        addList += "										<span class="btn-outline outline-pink">접수</span>                                   ";
        addList += "									</div>                                                                                   ";
        addList += "									<div class="col-md-11">                                                                  ";
        addList += "										<div class="forum-sub-title">                                                        ";
        addList += "											<span class="text-primary"><b>이수시스템</b><b>ISU_ST</b></span>                 ";
        addList += "											<span class="p-w-xs"></span>                                                     ";
        addList += "										</div>                                                                               ";
        addList += "										<a href="/incident/viewDetail" class="forum-item-title">                             ";
        addList += "											<i class="md md-desktop-windows"></i>STLC - 수출 선적서류 레이아웃 수정 요청     ";
        addList += "										</a>                                                                                 ";
        addList += "									</div>                                                                                   ";
        addList += "									<div class="col-md-12">                                                                  ";
        addList += "										<div class="forum-content truncate1 fh-60" style="word-wrap: break-word;">           ";
        addList += "											<a href="/incident/viewDetail"></a>                                              ";
        addList += "										</div>                                                                               ";
        addList += "										<a href="/incident/viewDetail" class="text-muted text-more">더보기</a>               ";
        addList += "										<div class="forum-level">                                                            ";
        addList += "											<p class="text-muted font-13"><b>서비스 만족도:</b> ";
        addList += "											    <span class="m-l-15">         ";
        addList += "												    <i class="md md-star text-warning"></i>                                      ";
        addList += "												    <i class="md md-star text-warning"></i>                                      ";
        addList += "												    <i class="md md-star text-warning"></i>                                      ";
        addList += "												    <i class="md md-star text-warning"></i>                                      ";
        addList += "												    <i class="md md-star text-muted"></i>                                        ";
        addList += "												</span>                                                                      ";
        addList += "											</p>                                                                             ";
        addList += "											<p></p>                                                                          ";
        addList += "										</div>                                                                               ";
        addList += "									</div>                                                                                   ";
        addList += "								</div>                                                                                       ";
        addList += "							</div>                                                                                           ";
        addList += "						</div>                                                                                               ";
        addList += "					</div>                                                                                                   ";
        addList += "				</div>                                                                                                       ";                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         ";
        
        
		rowIdx++;





    //var sIdx = 

        //alert(JSON.stringify(companyObj));dddd
    //선택된 회사 인덱스 값
    /*
    var sIdx = $('#company_cd option').index($('#company_cd option:selected'));
    sIdx = sIdx -1; //'선택하세요' 인덱스값 1을 빼줌
    //선택값 매핑
    $('#company_nm').val($('#company_cd option:selected').text());
    $('input[name="usermanage[dom_post_cd1]"]').val(companyObj[sIdx].zip_cd);
    $('input[name="usermanage[dom_addr]"]').val(companyObj[sIdx].addr);
    $('input[name="usermanage[dom_addr2]"]').val(companyObj[sIdx].addr2);
    $('input[name="usermanage[office_tel_no]"]').val(companyObj[sIdx].tel_no);
*/

}