'use strict';

$(function() {
    $( "#datepicker" ).datepicker({
        dateFormat : 'yy/mm/dd',
        changeMonth : true,
        changeYear : true,
        yearRange: '-100y:c+nn',
        maxDate: '-1d'
    });
});

$(function() {
    $( "#datepicker2" ).datepicker({
        dateFormat : 'yy/mm/dd',
        changeMonth : true,
        changeYear : true,
        yearRange: '-100y:c+nn',
        maxDate: '-1d'
    });
});

