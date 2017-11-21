'use strict';

$( document ).ready(function() {
    chartLoad();

    $('#sparkline2').sparkline([3, 6, 7, 8, 6, 4, 7, 10, 12, 7, 4, 9, 12, 13, 11, 12], {
        type: 'bar',
        height: '165',
        barWidth: '10',
        barSpacing: '3',
        barColor: '#3bafda'
    });

    $('#sparkline3').sparkline([20, 40, 30, 10], {
        type: 'pie',
        width: '165',
        height: '165',
        sliceColors: ['#dcdcdc', '#3bafda', '#333333', '#00b19d']
    });
});

function chartLoad() {
    $.ajax({
        type: "GET",
        async: true,
        url: "/statistic/chartLoad",
        dataType: "json", // xml, html, script, json 미지정시 자동판단
        timeout: 30000,
        cache: false,
        data: {},
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        error: function (request, status, error) {
            alert("chartLoad error : " + error);
        },
        beforeSend: function (dataObj) {
        },
        success: function (dataObj) {
            setChartLoad(dataObj);
            //alert(JSON.stringify(dataObj));
        }
    });
}

function setChartLoad(dataObj) {
    var status01 = 0;
    var status02 = 0;
    var status03 = 0;
    var status04 = 0;
    var status05 = 0;
    var status06 = 0;
    var status07 = 0;
    var status08 = 0;
    var status09 = 0;
    var status10 = 0;
    var status11 = 0;
    var status12 = 0;

    for (var i = 0; i < dataObj.length; i++) { 
        'status'+dataObj[i]._id.register_mm == dataObj[i]._id.count;
    }
    
    var DrawSparkline = function () {
        $('#sparkline1').sparkline([status01, status02, status03, status04, status05, status06, status07, status08, status09, status10, status11, status12], {
            type: 'line',
            width: $('#sparkline1').width(),
            height: '165',
            chartRangeMax: 50,
            lineColor: '#3bafda',
            fillColor: 'rgba(59,175,218,0.3)',
            highlightLineColor: 'rgba(0,0,0,.1)',
            highlightSpotColor: 'rgba(0,0,0,.2)',
        });

        $('#sparkline1').sparkline([25, 23, 26, 24, 25, 32, 30, 24, 19], {
            type: 'line',
            width: $('#sparkline1').width(),
            height: '165',
            chartRangeMax: 40,
            lineColor: '#00b19d',
            fillColor: 'rgba(0, 177, 157, 0.3)',
            composite: true,
            highlightLineColor: 'rgba(0,0,0,.1)',
            highlightSpotColor: 'rgba(0,0,0,.2)',
        });
    };

    DrawSparkline();

    var resizeChart;

    $(window).resize(function (e) {
        clearTimeout(resizeChart);
        resizeChart = setTimeout(function () {
            DrawSparkline();
        }, 300);
    });
}