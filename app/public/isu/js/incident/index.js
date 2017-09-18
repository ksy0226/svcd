  'use strict';


  $(document).ready(function () {

      $(".btn-select").each(function (e) {
          var value = $(this).find("ul li.selected").html();
          if (value != undefined) {
              $(this).find(".btn-select-input").val(value);
              $(this).find(".btn-select-value").html(value);
          }
      });

      // 셀렉트버튼 처리
      $(document).on('click', '.btn-select', function (e) {
          e.preventDefault();
          var ul = $(this).find("ul");
          if ($(this).hasClass("active")) {
              if (ul.find("li").is(e.target)) {
                  var target = $(e.target);
                  target.addClass("selected").siblings().removeClass("selected");
                  var value = target.html();
                  $(this).find(".btn-select-input").val(value);
                  $(this).find(".btn-select-value").html(value);
              }
              ul.hide();
              $(this).removeClass("active");
          } else {
              $('.btn-select').not(this).each(function () {
                  $(this).removeClass("active").find("ul").hide();
              });
              ul.slideDown(300);
              $(this).addClass("active");
          }
      });

      $(document).on('click', function (e) {
          var target = $(e.target).closest(".btn-select");
          if (!target.length) {
              $(".btn-select").removeClass("active").find("ul").hide();
          }
      });

      $('.summernote').summernote({
          height: 170, // set editor height
          minHeight: null, // set minimum height of editor
          maxHeight: null, // set maximum height of editor
          focus: false // set focus to editable area after initializing summernote
      });

      $('.inline-editor').summernote({
          airMode: true
      });

      $('#datepicker-rcd').datepicker({
        autoclose: true,
        todayHighlight: true,
        format: "yyyy/mm/dd"
    });

  });