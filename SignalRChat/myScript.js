var myHub = $.connection.chatHub;
var chatKey = 'hiort-chatId';
var chatId = '';
var requestChat = false;

$(function () {
    var chat = $.connection.chatHub;
    chat.client.broadcastMessage = function (name, message) {
        var encodedName = $('<div />').text(name).html();
        var encodedMsg = $('<div />').text(message).html();
        $('#discussion').append('<li><strong>' + encodedName
            + '</strong>:&nbsp;&nbsp;' + encodedMsg + '</li>');
    };
    $('#displayname').val(prompt('Enter your name:', ''));
    $('#message').focus();
    $.connection.hub.start().done(function () {
        $('#sendmessage').click(function () {
            chat.server.send($('#displayname').val(), $('#message').val());
            $('#message').val('').focus();
        });
    });
});

$('body').on({
    click: function () {
        toggleChatBox();
    }
}, '#chat-box-header');

$('#chat-box').on({
    keydown: function (e) {
        var msg = $(this).val();
        if (e.keyCode == 13 && msg != '') {
            e.preventDefault();
            e.stopPropagation();
            
            myHub.server.send("Chat", msg);

            $('#chat-box-textinput').val('');
        }
    }
}, '#chat-box-textinput');

function toggleChatBox() {
    var elm = $('#chat-box-header');
    if ($('#chat-box').hasClass('chat-open')) {
        $('#chat-box').removeClass('chat-open');
        elm.css('bottom', '0px');
    } else {
        var y = 301 + elm.height();
        $('#chat-box').addClass('chat-open');
        $('#chat-box').html(
            '<div id="chat-box-msg" style="height:265px;overflow:auto;">' +
            '<p>Have a question? Let\'s chat!</p><p>Add your question on the field below and press ENTER.</p></div>' +
            '<div id="chat-box-input" style="height:35px;"><textarea id="chat-box-textinput" style="width:100%;height: 32px;border:1px solid #0354cb;border-radius: 3px;" /></div>'
        );
        elm.css('bottom', y);
        var $el = $("#chat-box");
        setTimeout(function () {
            $el.find('textarea').focus();
        }, 0);
    }
    $('#chat-box').slideToggle();
};

myHub.client.addMessage = function (from, msg) {    
    
        $('#chat-box-msg').append('<p><strong>' + from + '</strong>: ' + msg + '</p>');

        $("#chat-box-msg").scrollTop($("#chat-box-msg")[0].scrollHeight);
}