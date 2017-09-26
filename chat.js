var config = {
  userInfo: {
    name: '',
    portrait: '',
  },

  botInfo: {
    name: '',
    portrait: '',
  },

  showName: true,
};

var userMessageQueue = [];
var botMessageQueue = [];

var MESSAGE_TYPE_USER = 'message_type_user';
var MESSAGE_TYPE_BOT = 'message_type_bot';

function _renderMessage(id, text, type) {
  var info = type === MESSAGE_TYPE_BOT
    ? config.botInfo
    : config.userInfo;

  var portrait = info.portrait;
  var name = info.name;

  var tpl = ''
    + '<div data-id="' + id + '" class="message clearfix ' + (type === MESSAGE_TYPE_BOT ? 'receive' : 'send') + '">'
    +   '<img src="' + portrait + '" class="message-avatar" />'

    +   '<div class="message-content-container">'
    +     '<div class="message-name">'
    +       name
    +     '</div>'

    +     '<div class="message-content">'
    +       text
    +     '</div>'
    +   '</div>'
    + '</div>';

  $('#chat').append(tpl);
}

function _updateMessage(id, text) {
  $('#chat [data-id="' + id + '"] .message-content')
    .html(text);
}

function _renderTimestamp(ts) {
  var tpl = ''
    + '<div class="message-ts-container">'
    +   '<div class="message-ts">'
    +     ts
    +   '</div>'
    + '</div>';

  $('#chat').append(tpl);
}

function setUserInfo(name, portrait) {
  config.userInfo.name = name;
  config.userInfo.portrait = portrait;
}

function setBotInfo(name, portrait) {
  config.botInfo.name = name;
  config.botInfo.portrait = portrait;
}

function showName(isShow) {
  config.showName = isShow;
}

function addTimestamp(ts) {
  _renderTimestamp(ts);
}

function addUserText(id, text) {
  userMessageQueue.push({ id: id, text: text });
  _renderMessage(id, text, MESSAGE_TYPE_USER);
}

function addBotText(id, text) {
  botMessageQueue.push({ id: id, text: text });
  _renderMessage(id, text, MESSAGE_TYPE_BOT);
}

function updateUserText(id, text) {
  var message = _utils.find(userMessageQueue, 'id', id);

  if (message) {
    message.text = text;
    _updateMessage(id, text);
  }
}

function updateBotText(id, text) {
  var message = _utils.find(botMessageQueue, 'id', id);

  if (message) {
    message.text = text;
    _updateMessage(id, text);
  }
}

var _utils = {
  find: function (arr, key, value) {
    if (arr == null || !arr.length) {
      return null;
    }

    var len = arr.length;

    for (var i = 0; i < len; i++) {
      if (arr[i][key] === value) {
        return arr[i];
      }
    }

    return null;
  },

  random: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
};

// test
$(function () {
  setBotInfo('机器人', 'http://we.plus.sogou:8888/static/c9cc8f7a/images/headshot.png');
  setUserInfo('用户', 'http://we.plus.sogou:8888/static/c9cc8f7a/images/headshot.png');

  $('.test-text')
    .on('click', 'button', function () {
      var type = $(this).attr('id') === 'bot-push'
        ? MESSAGE_TYPE_BOT
        : MESSAGE_TYPE_USER;

      var text = '';
      var id = _utils.random(0, 100000);

      var now = new Date();

      addTimestamp(now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds());

      if (type === MESSAGE_TYPE_BOT) {
        text = $('[name="bot-text"]').val();
        addBotText(id, text)
      }
      else {
        text = $('[name="user-text"]').val();
        addUserText(id, text)
      }

      setTimeout(
        function () {
          if (type === MESSAGE_TYPE_BOT) {
            updateBotText(id, 'default bot text');
          }
          else {
            updateUserText(id, 'default user text');
          }
        },
        1000
      );
    });
});
