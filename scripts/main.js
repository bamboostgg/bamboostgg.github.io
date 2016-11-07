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
      if (!classes.contains('fullscreen')) {
        classes.add('fullscreen');
        classes.remove('footer');
      }
    };
    elem.close = function() {
      if (classes.contains('fullscreen')) {
        classes.remove('fullscreen');
        classes.add('footer');
      }
    };
    
    return elem;
  }();


  var game = function(canvas) {
    var startState = {
      ball: {
        height: 10,
        vx: 1,
        vy: 1,
        width: 10,
        x: 10,
        y: 10,
      },
      open: true,
      paused: false,
      paddleLeft: {
        height: 50,
        width: 10,
        y: null,
      },
      paddleRight: {
        height: 50,
        width: 10,
        y: null,
      },
      score: {
        left: 0,
        right: 0,
      },
      view: {
        min: 0,
      },
    };

    var state = Object.assign({}, startState);

    function animate() {
      if (!state.open || state.paused) {
        return;
      }
      resize();
      update();
      render();
      window.requestAnimationFrame(animate);
    }

    function close() {
      reset();
      state.open = false;
    };

    function open() {
      if (!state.open) {
        state.open = true;
        start();
      }
    };

    function start() {
      state.paused = false;
      window.requestAnimationFrame(animate);
    }

    function togglePause() {
      state.paused = !state.paused;
      if (!state.paused) {
        window.requestAnimationFrame(animate);
      }
    }

    function reset() {
      var ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      state = Object.assign({}, startState);
    };

    function resize() {
      var ctx = canvas.getContext('2d');
      if (canvas.height !== ctx.canvas.clientHeight){
        reset();
        canvas.height = ctx.canvas.clientHeight;
        state.paddleRight.y = canvas.height / 2 - state.paddleRight.height / 2;
        state.paddleLeft.y  = canvas.height / 2 - state.paddleLeft.height  / 2;
        state.ball.y        = canvas.height / 2 - state.ball.height        / 2;
        ctx = canvas.getContext('2d');
      };
      if (canvas.width !== ctx.canvas.clientWidth){
        reset();
        canvas.width = ctx.canvas.clientWidth;
        state.ball.x = canvas.width / 2 - state.ball.width / 2;
        ctx = canvas.getContext('2d');
      };
    }

    function update() {

      state.ball.x += state.ball.vx;
      state.ball.y += state.ball.vy;
    };

    function render() {

      var ctx = canvas.getContext('2d');

      // clear frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'white';
      ctx.font = "48px arial";

      // score
      ctx.fillText(
        state.score.left,
        canvas.width / 2 - 60,
        60
      );
      ctx.fillText(
        state.score.right,
        canvas.width / 2 + 36,
        60
      );
      // ball
      ctx.fillRect(
        state.ball.x,
        state.ball.y,
        state.ball.width,
        state.ball.height
      );

      // left paddle
      ctx.fillRect(
        4,
        state.paddleLeft.y - state.paddleLeft.height / 2,
        state.paddleLeft.width,
        state.paddleLeft.height
      );

      // right paddle
      ctx.fillRect(
        canvas.width - state.paddleRight.width - 4,
        state.paddleRight.y - state.paddleRight.height / 2,
        state.paddleRight.width,
        state.paddleRight.height
      );
    };
    
    function keyHandler(event) {
      console.log(event.key);
      switch(event.key) {
        case ' ':
          togglePause();
          return;
        default:
          return;
      }
    }

    return {
      close: close,
      keyHandler: keyHandler,
      open: open,
      reset: reset,
      resize: resize,
      render: render,
      start: start,
    };

  }(canvas);

  var openCloseListener = function(event) {
    switch(event.key) {
      case 'q':
        square.open();
        canvas.close();
        game.close();
        return;
      case 'Enter':
        square.close();
        canvas.open();
        game.open();
        return;
      default:
        return;
    }
  };

  
  var init = function() {
    square.close();
    canvas.open();
    document.body.addEventListener('keypress', openCloseListener);
    document.body.addEventListener('keypress', game.keyHandler);
    game.resize();
    game.render();
    setTimeout(game.start, 1000);
  }();
  return 'press "q" to quit and enter to open again'
};

var runOnce = function () {
  console.log(
    '   ____             __ \r\n  \/ __\/ ___ _  ___ \/ \/_ ___   ____\r\n \/ _\/  \/ _ `\/ (_-<\/ __\/\/ -_) \/ __\/\r\n\/___\/__\\_,_\/ \/___\/\\__\/ \\__\/ \/_\/   \r\n  \/ __\/  ___ _  ___ _  \/ \/        \r\n \/ _\/   \/ _ `\/ \/ _ `\/ \/_\/         \r\n\/___\/   \\_, \/  \\_, \/ (_)          \r\n       \/___\/  \/___\/               \n',
    'run "pong()" to start a game!'
  );
}();
