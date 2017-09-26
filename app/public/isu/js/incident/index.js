'use strict';


    var	dataCnt = 0;
    var	rowIdx = 3;
    var inCnt = 3;
    var	dataObj = null;
    var addlist = "";

    $(document).ready(function () {
        dataObj= incidentObj;
        $('#moreView').on('click',function(){
            moreView();
        });

    
        
    });
    
    function moreView(){
        //alert("dataObj.length"+dataObj.length); //303
        if(rowIdx < dataObj.length){
            if((rowIdx+inCnt) < dataObj.length){
                dataCnt = rowIdx + inCnt;
            }else{
                dataCnt = dataObj.length;
            } 
        }


        for(var i=rowIdx ; i < dataCnt ; i++){
            var addList = "";
            addList += "                <div class='col-lg-12'>";
            addList += "					<div class='card-box'>";
            addList += "						<div class='forum-container'>";
            addList += "							<div class='forum-item'>";
            addList += "								<div class='row'>";
            addList += "									<div class='col-md-1 forum-info'>";
            addList += "										<span class='btn-outline outline-pink'>접수</span>";
            addList += "									</div>";
            addList += "									<div class='col-md-11'>";
            addList += "										<div class='forum-sub-title'>";
            addList += "											<span class='text-primary'><b>"+dataObj[i].manager_nm+"</b></span>";
            addList += "											<span class='p-w-xs'></span>";
            addList += "										</div>";
            addList += "										<a href='/incident/viewDetail' class='forum-item-title'>";
            addList += "											<i class='md md-desktop-windows'></i>"+dataObj[i].title+"";
            addList += "										</a>";
            addList += "									</div>";
            addList += "									<div class='col-md-12'>";
            addList += "										<div class='forum-content truncate1 fh-60' style='word-wrap: break-word;'>";
            addList += "											<a href='/incident/viewDetail'>"+dataObj[i].content+"</a>";
            addList += "										</div>";
            addList += "										<a href='/incident/viewDetail' class='text-muted text-more'>더보기</a>";
            addList += "										<div class='forum-level'>";
            addList += "											<p class='text-muted font-13'><b>서비스 만족도:</b>";
            addList += "											    <span class='m-l-15'>";
            addList += "												    <i class='md md-star text-warning'></i>";
            addList += "												    <i class='md md-star text-warning'></i>";
            addList += "												    <i class='md md-star text-warning'></i>";
            addList += "												    <i class='md md-star text-warning'></i>";
            addList += "												    <i class='md md-star text-muted'></i>";
            addList += "												</span>";
            addList += "											</p>";
            addList += "											<p></p>";
            addList += "										</div>";
            addList += "									</div>";
            addList += "								</div>";
            addList += "							</div>";
            addList += "						</div>";
            addList += "					</div>";
            addList += "				</div>";

            //alert("addList : " + addList);
            
            $("#more_list").append(addList);
            
            rowIdx++;
        }
        $("#more_view").remove();
        //if(i!= dataCnt){
            $('#more_list').append("<div class='col-lg-12'><div class='card-box'><p><a class='text-muted text-more' id='moreView' onclick='javascript:moreView();' >더보기</a></p></div></div>");  
        //}else{
        //$('#more_list').append("<div class='col-lg-12'><div class='card-box'><p><a class='text-muted text-more'>더이상 데이터가 없습니다.</a></p></div></div>");  
        //}
    }