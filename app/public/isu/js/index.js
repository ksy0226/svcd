'use strict'; 
$(document).ready(function () {
    $('.button-checkbox').each(function () {
        var $widget = $(this),
            $button = $widget.find('button'),
            $checkbox = $widget.find('input:checkbox'),
            color = $button.data('color'),
            settings = {
                on: {
                    icon: 'glyphicon glyphicon-check'
                },
                off: {
                    icon: 'glyphicon glyphicon-unchecked'
                }
            };

        $button.on('click', function () {
            $checkbox.prop('checked', !$checkbox.is(':checked'));
            $checkbox.triggerHandler('change');
            updateDisplay();
        });

        $checkbox.on('change', function () {
            updateDisplay();
        });

        function updateDisplay() {
            var isChecked = $checkbox.is(':checked');
            // Set the button's state
            $button.data('state', (isChecked) ? "on" : "off");

            // Set the button's icon
            $button.find('.state-icon')
                .removeClass()
                .addClass('state-icon ' + settings[$button.data('state')].icon);

            // Update the button's color
            if (isChecked) {
                $button
                    .removeClass('btn-default')
                    .addClass('btn-' + color + ' active');
            } else {
                $button
                    .removeClass('btn-' + color + ' active')
                    .addClass('btn-default');
            }
        }

        function init() {
            updateDisplay();
            // Inject the icon if applicable
            if ($button.find('.state-icon').length == 0) {
                $button.prepend('<i class="state-icon ' + settings[$button.data('state')].icon + '"></i>');
            }
        }
        init();
        initMap();
        resize();
    });

    $('#myModal').click(function () {
        resize();
    }); 

});

//구글맵 초기화
function initMap() {
    if($("#map").length) {  
        var mapOptions = { //구글 맵 옵션 설정
            zoom : 12, //기본 확대율                 
            //center : new google.maps.LatLng(37.497983,126.9938672), // 지도 중앙 위치
            center : new google.maps.LatLng(37.557983,126.8938672), // 지도 중앙 위치
            scrollwheel : false, //마우스 휠로 확대 축소 사용 여부
            mapTypeControl : false //맵 타입 컨트롤 사용 여부
        };

        var map = new google.maps.Map(document.getElementById('map'), mapOptions);
        
        var marker = new google.maps.Marker({
            //position: map.getCenter(), //마커 위치
            position : new google.maps.LatLng(37.497983,126.9938672), // 지도 중앙 위치
            map: map,
            icon: '/isu/image/isu_map_icon.png',
        });
    }
}

//구글맵 리사이즈(모달 시 적용필요)
function resize(){
    $('#myModal').on('shown.bs.modal', function () {
        google.maps.event.trigger(map, "resize");
    });
}