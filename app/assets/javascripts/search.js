$(function () {

  const seach_field = $('#user-search-field')
  const search_result = $('#user-search-result')
  const add_user = $(".js-add-user")

  // search_result users template
  function outputResult(user) {
    var html =
      `<div class="chat-group-user clearfix">
        <p class="chat-group-user__name">
          ${user.name}</p>
        <a class="user-search-add chat-group-user__btn chat-group-user__btn--add" data-user-id="${user.id}" data-user-name="${user.name}">追加
        </a>
      </div>
    `;
    search_result.append(html);
  } // search_result users template //

  // search_result users template
  function addGroupUsers(id, name) {
    var html =
      `<div class="chat-group-user clearfix" id="chat-group-user-${id}">
        <input type="hidden" name="group[user_ids][]" value="${id}">
        <p class="chat-group-user__name">${name}</p>
        <a class='user-search-remove chat-group-user__btn chat-group-user__btn--remove js-remove-btn' data-user-id="${id}" data-user-name="${name}">削除</a>
      </div>`;
    add_user.append(html);
  } // search_result users template//

  // return_result users template
  function returnResult(id, name) {
    var html =
      `<div class="chat-group-user clearfix">
        <p class="chat-group-user__name">
          ${name}</p>
        <a class="user-search-add chat-group-user__btn chat-group-user__btn--add" data-user-id="${id}" data-user-name="${name}">追加
        </a>
      </div>
    `;
    search_result.append(html);
  } // return_result users template //

  // result no user template
  function resultNoUser() {
    let html = `
        <div class="chat-group-user clearfix">
          <p class="chat-group-user__name">ユーザーが見つかりません</p>
        </div>
      `;
    search_result.append(html);
  } // result no user template //

  // Incremental search
  seach_field.on('keyup', function (user) {

    let input = seach_field.val();
    user.preventDefault();

    $.ajax({
      type: 'GET',
      url: '/users/search', //request URL
      data: { keyword: input },
      dataType: 'json'
    })
      .done(function (data) {
        search_result.empty();
        if (data.length !== 0) {
          data.forEach(function (user) {
            outputResult(user);
          });
        } else if (input.length == 0) {
          return false;
        } else {
          resultNoUser();
        }
      })
      .fail(function () {
        alert("通信エラーです。ユーザーが表示できません。");
      });
  }); // Incremental search //

  // addGroupUsers action
  search_result.on('click', '.chat-group-user__btn--add', function () {
    var id = $(this).data('userId');
    var name = $(this).data('userName');
    addGroupUsers(id, name); //add action
    $(this).parent('.chat-group-user').remove(); //delete action
  });  //search_result.on('click')//

  add_user.on('click', '.chat-group-user__btn--remove', function () {
    var id = $(this).data('userId');
    var name = $(this).data('userName');
    $(`#chat-group-user-${id}`).remove(); //delete action
    returnResult(id, name); //add action
  });

});