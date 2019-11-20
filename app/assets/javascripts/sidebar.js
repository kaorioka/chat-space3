$(window).load(function () {

  var href = $(".main-header__left-box__current-group").data("group-id")
  $(".group").each(function (i, ele) {
    if ($(ele).data("group-id") === href) {
      $(this).addClass("group__side_current")
    } else {
      $(this).removeClass("group__side_current")
    }
  });

});