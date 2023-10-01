$(document).ready(function() {
  let items = [];
  let itemsRaw = [];

  $.getJSON('/api/books', function(data) {
    //let  items = [];
    itemsRaw = data;
    $.each(data, function(i, val) {
      items.push('<li class="bookItem" id="' + i + '">' + val.title + ' - ' + val.commentcount + ' comments</li>');
      return (i !== 14);
    });
    if (items.length >= 15) {
      items.push('<p>...and ' + (data.length - 15) + ' more!</p>');
    }
    $('<ul/>', {
      'class': 'listWrapper',
      html: items.join('')
    }).appendTo('#display');
  });

  let comments = [];
  $('#display').on('click', 'li.bookItem', function() {
    $("#detailTitle").html('<b>' + itemsRaw[this.id].title + '</b> (id: ' + itemsRaw[this.id]._id + ')');
    $.getJSON('/api/books/' + itemsRaw[this.id]._id, function(data) {
      comments = [];
      $.each(data.comments, function(i, val) {
        comments.push('<li>' + val + '</li>');
      });
      comments.push('<br><form id="newCommentForm"><textarea style="width:300px" type="text" class="form-control textarea-input" id="commentToAdd" name="comment" placeholder="New Comment"></textarea></form>');
      comments.push('<br><button class="btn-secondary addComment" id="' + data._id + '">Add Comment</button>');
      comments.push('<button class="btn-secondary deleteBook" id="' + data._id + '">Delete Book</button>'); // some things in here seem to have been left here by mistake. For example, there were classes on these buttons that don't seem to point to anything in style.css. Maybe they did, and I've deleted that, or maybe it's just a mistake, and I could make a pull-request or something on that...
      $('#detailComments').html(comments.join(''));
    });
  });

  $('#bookDetail').on('click', 'button.deleteBook', function() {
    $.ajax({
      url: '/api/books/' + this.id,
      type: 'delete',
      success: function(data) {
        //update list
        $('#detailComments').html('<p style="color: red;">' + data + '<p><p>Refresh the page</p>');
      }
    });
  });

  $('#bookDetail').on('click', 'button.addComment', function() {
    let newComment = $('#commentToAdd').val();
    $.ajax({
      url: '/api/books/' + this.id,
      type: 'post',
      dataType: 'json',
      data: $('#newCommentForm').serialize(),
      success: function(data) {
        comments.unshift(newComment); //adds new comment to top of list
        $('#detailComments').html(comments.join(''));
      }
    });
  });

  $('#newBook').click(function() {
    $.ajax({
      url: '/api/books',
      type: 'post',
      dataType: 'json',
      data: $('#newBookForm').serialize(),
      success: function(data) {
        //update list

      }
    });
  });

  $('#deleteAllBooks').click(function() {
    $.ajax({
      url: '/api/books',
      type: 'delete',
      dataType: 'json',
      data: $('#newBookForm').serialize(),
      success: function(data) {
        //update list
      }
    });
  });

});