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

    //계정신청 모달 저장버튼 클릭 시
    $('#usermanageNewSaveBtn').on('click', function () {
        if (checkValue()) {
            if (confirm("등록하시겠습니까?")) {
                receiptSave();
            }
        }
    })
});

//상위코드 맵핑
function companyCd() {
    //선택된 회사 인덱스 값
    var sIdx = $('#company_cd option').index($('#company_cd option:selected'));
    sIdx = sIdx - 1; //'선택하세요' 인덱스값 1을 빼줌
    //선택값 매핑
    $('#company_nm').val($('#company_cd option:selected').text());
}

//필수값 체크
function checkValue() {
    if ($('#company_cd').val() == '') {
        alert("회사명을 선택하세요.");
        $('#company_cd').focus();
        return false;
    }

    if ($('#email').val() == '') {
        alert("EMAIL을 입력하세요.");
        $('#email').focus();
        return false;
    }

    if ($('#employee_nm').val() == '') {
        alert("이름을 입력하세요.");
        $('#employee_nm').focus();
        return false;
    }

    if ($('#dept_nm').val() == '') {
        alert("부서명을 입력하세요.");
        $('#dept_nm').focus();
        return false;
    }

    if ($('#position_nm').val() == '') {
        alert("직위를 입력하세요.");
        $('#position_nm').focus();
        return false;
    }

    if ($('#hp_telno').val() == '') {
        alert("연락처를 입력하세요.");
        $('#hp_telno').focus();
        return false;
    }

    return true;
}

//구글맵 초기화
function initMap() {
    if ($("#map").length) {
        var mapOptions = { //구글 맵 옵션 설정
            zoom: 12, //기본 확대율                 
            //center : new google.maps.LatLng(37.497983,126.9938672), // 지도 중앙 위치
            center: new google.maps.LatLng(37.557983, 126.8938672), // 지도 중앙 위치
            scrollwheel: false, //마우스 휠로 확대 축소 사용 여부
            mapTypeControl: false //맵 타입 컨트롤 사용 여부
        };

        var map = new google.maps.Map(document.getElementById('map'), mapOptions);

        var marker = new google.maps.Marker({
            //position: map.getCenter(), //마커 위치
            position: new google.maps.LatLng(37.497983, 126.9938672), // 지도 중앙 위치
            map: map,
            icon: '/isu/images/isu_map_icon.png',
        });
    }
}

//구글맵 리사이즈(모달 시 적용필요)
function resize() {
    $('#myModal').on('shown.bs.modal', function () {
        google.maps.event.trigger(map, "resize");
    });
}

//계정신청 폼 초기화
function usermanageNew() {
    $('#usermanageNew_form').find('input').val('');
    $('#usermanageNew_form').find('select').val('');
}

//계정신청 저장
function receiptSave() {

    if (confirm("등록하시겠습니까?")) {
        var reqParam = $('#usermanageNew_form').serialize();

        try {
            $.ajax({
                type: "POST",
                async: true,
                url: "/new",
                dataType: "json",
                timeout: 30000,
                cache: false,
                data: reqParam,
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                error: function (request, status, error) {
                    alert("receiptSave ajax error : " + error);
                },
                beforeSend: function () {
                },
                success: function (dataObj) {
                    alert("계정 신청이 완료되었습니다.");
                    $('#usermanageNew_modal').modal('hide');
                }
            });
        } catch (error) {
            logger.debug("receiptSave catch error : ", error);
        }
    }
}