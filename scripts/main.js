function pong(text) {

  var square = function() {
    var classes = document.getElementsByClassName('square')
      .item(0)
      .classList;
    return {
      open: function() {
        classes.contains('shrink')
        && classes.remove('shrink');
      },
      close:  function() {
        !classes.contains('shrink')
        && classes.add('shrink');
      },
    };
  }();

  var canvas = function() {
    var elem = document.getElementById('canvas');
    var classes = elem.classList;
    elem.open = function() {
      !classes.contains('fullscreen')
      && classes.add('fullscreen');
    };
    elem.close = function() {
      classes.contains('fullscreen')
      && classes.remove('fullscreen');
    };
    
    return elem;
  }();

  var openCloseListener = function(event) {
    switch(event.key) {
      case 'q':
        square.open();
        canvas.close();
        break
      case 'Enter':
        square.close();
        canvas.open();
        break;
      default:
        break;
    }
  };

  document.body.addEventListener('keypress', openCloseListener);
  
  var init = function() {
    square.close();
    canvas.open();
  }();
  return 'press "q" to quit and enter to open again'
};

var runOnce = function () {
  console.log(
    '   ____             __            \r\n  \/ __\/ ___ _  ___ \/ \/_ ___   ____\r\n \/ _\/  \/ _ `\/ (_-<\/ __\/\/ -_) \/ __\/\r\n\/___\/__\\_,_\/ \/___\/\\__\/ \\__\/ \/_\/   \r\n  \/ __\/  ___ _  ___ _  \/ \/        \r\n \/ _\/   \/ _ `\/ \/ _ `\/ \/_\/         \r\n\/___\/   \\_, \/  \\_, \/ (_)          \r\n       \/___\/  \/___\/               \n',
    'run "pong()" to start a game!'
  );
}();
