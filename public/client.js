$(document).ready(function () {
  let items = [];
  let itemsRaw = [];

  $.getJSON("/api/books", function (data) {
    //let  items = [];
    itemsRaw = data;
    $.each(data, function (i, val) {
      items.push(
        '<button class="bookItem" id="' +
          i +
          '">' +
          val.title +
          " - " +
          val.commentcount +
          " comments</button>"
      );
      return i !== 14;
    });
    if (items.length >= 15) {
      items.push("<p>...and " + (data.length - 15) + " more!</p>");
    }
    $("<div/>", {
      class: "listWrapper",
      html: items.join(""),
    }).appendTo("#display");
  });

  let comments = [];
  $("#display").on("click", "button.bookItem", function () {
    $("#detailTitle").html(
      '<p class="detail-title__title">' +
        itemsRaw[this.id].title +
        '</p><p class="detail-title__id">ID: ' +
        itemsRaw[this.id]._id +
        "</p>"
    );

    $.getJSON("/api/books/" + itemsRaw[this.id]._id, function (data) {
      comments = [];

      $.each(data.comments, function (i, val) {
        comments.push('<div class="specificBookComment">' + val + "</div>");
      });

      $("#detailComments").html(comments.join(""));

      let commentsForm = [];

      commentsForm.push(
        '<form id="newCommentForm" class="new-comment-form"><textarea type="text" class="form-control textarea-input" id="commentToAdd" name="comment" placeholder="New Comment"></textarea></form>'
      );

      commentsForm.push(
        '<div class="jQueryBtns"><button class="btn-secondary addComment" id="' +
          data._id +
          '">Add Comment</button><button class="btn-secondary deleteBook" id="' +
          data._id +
          '">Delete Book</button></div>'
      );

      $("#detailCommentsForm").html(commentsForm.join(""));
    });
  });
  // comments.push('<button class="btn-secondary deleteBook" id="' + data._id + '">Delete Book</button>');
  // I can make a PR to have redundant classes on these buttons removed as they don't connect to anything in style.css.

  $("#bookDetail").on("click", "button.deleteBook", function () {
    $.ajax({
      url: "/api/books/" + this.id,
      type: "delete",
      success: function (data) {
        //update list
        $("#detailComments").html(
          '<p style="color: gold; text-transform: capitalize;">' +
            data +
            ". Refresh the page.</p>"
        );
      },
    });
  });

  $("#bookDetail").on("click", "button.addComment", function () {
    let newComment = $("#commentToAdd").val();
    $.ajax({
      url: "/api/books/" + this.id,
      type: "post",
      dataType: "json",
      data: $("#newCommentForm").serialize(),
      success: function (data) {
        comments.unshift(newComment); //adds new comment to top of list
        // $('#detailComments').html(comments.join(''));
        $("<div/>", {
          class: "specificBookComment",
          html: newComment,
        }).appendTo("#detailComments");
      },
    });
  });

  $("#newBook").click(function () {
    $.ajax({
      url: "/api/books",
      type: "post",
      dataType: "json",
      data: $("#newBookForm").serialize(),
      success: function (data) {
        //update list
      },
    });
  });

  $("#deleteAllBooks").click(function () {
    $.ajax({
      url: "/api/books",
      type: "delete",
      dataType: "json",
      data: $("#newBookForm").serialize(),
      success: function (data) {
        //update list
      },
    });
  });
});
