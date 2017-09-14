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

      $('#attach-file').fileinput({
          language: 'ko',
          uploadUrl: '#',
          overwriteInitial: false,
          maxFileSize: 1000,
          maxFilesNum: 10
      });


      /*
      $('#summernote').summernote({
          lang: 'ko-KR',
          height: 300,
      });
      */
      $('#summernote').summernote({
          lang: 'ko-KR',
          height: 300,
          callbacks: {
              onImageUpload: function (files) {
                  sendFile(files[0]);
              }
          }
      });

  });


  function sendFile(file, editor, welEditable) {
          data = new FormData();
          data.append("thumbnail", file);
          $.ajax({
              data: data,
              type: "POST",
              url: '#',
              cache: false,
              contentType: false,
              processData: false,
              success: function (url) {
                  $('#summernote').summernote("insertImage", url);
              }
          });
      }