$(document).ready(function () {

  // def current_page
  var current_page = window.location.pathname;
  // def current_page //

  // image Attach style
  var imageAttach = $('i.fa.fa-picture-o.icon');
  $('input[type=file]').change(function () {
    imageAttach.addClass('active');
  }); // image Attach style //


  //html template
  function buildHTML(message) {

    var data_id = `data-message-id=${message.id}`;
    var image = message.image ? `<img src= ${message.image}>` : "";
    var upper_info = `<div class="message__upper-info">
                        <p class="message__upper-info__talker">
                        ${message.user_name}
                        </p >
                        <p class="message__upper-info__date">
                          ${message.created_at}
                        </p>
                      </div >`;

    if (message.content && message.image) {

      var html = `<div class="message" ${data_id}>
                    ${upper_info}
                      <p class="message__text">${message.content}</p>
                    ${image}
                  </div > `;

    } else if (message.content) {

      var html = `<div class="message" ${data_id}>
                    ${upper_info}
                      <p class="message__text">${message.content}</p>
                  </div > `;

    } else if (message.image) {

      var html = `<div class="message" ${data_id}>
                    ${upper_info}
                    ${image}
                  </div > `;

    };
    return html;
  }; //html template //

  //scroll event
  function send_scroll(list) {
    var scrollHeight = $('#messages_area')[0].scrollHeight;
    $(list).animate({ scrollTop: scrollHeight }, '50000000000000000');
  }; //scroll event//

  //submit event
  $('#new_message').submit(function (e) {
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action'); //request url
    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
      .done(function (data) {
        var list = ".messages";
        var html = buildHTML(data);
        $(list).append(html);
        send_scroll(list);
        $('#new_message')[0].reset(); //input reset
        imageAttach.removeClass('active'); //remove image Attach style
      })
      .fail(function () {
        alert('メッセージが空欄です。');
      })
      .always(function () {
        $('.form__submit').prop('disabled', false); //disabled cancel
      });
  }); //submit event//

  //reload function
  var reloadMessages = function () {

    if (current_page.match(/\/groups\/\d+\/messages/)) {

      var last_message = $(".message:last").data("message-id") || 0;

      $.ajax({
        url: "api/messages", //request url
        type: 'GET',
        data: {
          id: last_message
        },
        dataType: 'json'
      })
        .done(function (message) {

          if (message != 0) {
            var insertHTML = '';
            message.forEach(function (message) {
              insertHTML += buildHTML(message);
            });
            var list = ".messages";
            $(list).append(insertHTML);
            send_scroll(list);

          } else {
            //current page no messages
          }

        })
        .fail(function () {
          alert('自動更新に失敗しました');
        });
    } else {
      clearInterval(reloadMessages);
    }; //reload function//
  };

  // reload request
  window.addEventListener('load', function () {
    setInterval(reloadMessages, 5000);
  }); // reload request //

});