'use strict';

    var	dataCnt = 0;
    var	rowIdx = 0;
    var inCnt = 3;
    var	dataObj = null;

    $(document).ready(function () {
        alert(0);
        
        dataObj= incidentObj;
        alert(dataObj);
        $('#moreView').on('click',function(){
            alert(1);
            moreView();
        });
        
    });


    function moreView(){
        alert("rowIdx"+rowIdx);                 //0
        alert("dataObj.length"+dataObj.length); //303

        if(rowIdx < dataObj.length){
            if((rowIdx+inCnt) < dataObj.length){
                dataCnt = rowIdx + inCnt;
                alert("dataCnt"+dataCnt);
            }else{
                dataCnt = dataObj.length;
                alert("dataCnt"+dataCnt);
            } 
        }
        
        for(var i=rowIdx ; i < dataCnt ; i++){
            alert("rowIdx "+rowIdx);
            alert("dataCnt "+dataCnt);
            var addlist = "";

            /*
            addList += "				<div class='col-lg-12'>                                                                                      ";
            addList += "					<div class='card-box'>                                                                                   ";
            addList += "						<div class='forum-container'>                                                                        ";
            addList += "							<div class='forum-item'>                                                                         ";
            addList += "								<div class='row'>                                                                            ";
            addList += "									<div class='col-md-1 forum-info'>                                                        ";
            addList += "										<span class='btn-outline outline-pink'>접수</span>                                   ";
            addList += "									</div>                                                                                   ";
            addList += "									<div class='col-md-11'>                                                                  ";
            addList += "										<div class='forum-sub-title'>                                                        ";
            addList += "											<span class='text-primary'><b>이수시스템</b><b>ISU_ST</b></span>                  ";
            addList += "											<span class='p-w-xs'></span>                                                     ";
            addList += "										</div>                                                                               ";
            addList += "										<a href='/incident/viewDetail' class='forum-item-title'>                             ";
            addList += "											<i class='md md-desktop-windows'></i>STLC - 수출 선적서류 레이아웃 수정 요청        ";
            addList += "										</a>                                                                                 ";
            addList += "									</div>                                                                                   ";
            addList += "									<div class='col-md-12'>                                                                  ";
            addList += "										<div class='forum-content truncate1 fh-60' style='word-wrap: break-word;'>           ";
            addList += "											<a href='/incident/viewDetail'></a>                                              ";
            addList += "										</div>                                                                               ";
            addList += "										<a href='/incident/viewDetail' class='text-muted text-more'>더보기</a>               ";
            addList += "										<div class='forum-level'>                                                            ";
            addList += "											<p class='text-muted font-13'><b>서비스 만족도:</b>                               ";
            addList += "											    <span class='m-l-15'>                                                        ";
            addList += "												    <i class='md md-star text-warning'></i>                                  ";
            addList += "												    <i class='md md-star text-warning'></i>                                  ";
            addList += "												    <i class='md md-star text-warning'></i>                                  ";
            addList += "												    <i class='md md-star text-warning'></i>                                  ";
            addList += "												    <i class='md md-star text-muted'></i>                                    ";
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
            */
            alert(2323);
            rowIdx++;
            alert(rowIdx);

        }
        
    }