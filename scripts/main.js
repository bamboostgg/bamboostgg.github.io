function pong() {
  var notCalled = true;
  var square = function() {
    var elem = document.getElementsByClassName('square').item(0)
    var classes = elem.classList;
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
    function startState() {
      return {
        ball: {
          height: 10,
          vx: 3.5,
          vy: 3.5,
          width: 10,
          x: 10,
          y: 10,
        },
        controls: {
          currentKey: null,
          cursorY: null,
        },
        bounds: {
          top: null,
          bottom: null,
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
        winner: null,
      };
    };

    var state = startState();

    function animate() {
      if (!state.open || state.paused) {
        return;
      }
      var ctx = canvas.getContext('2d');
      if (
        canvas.height !== ctx.canvas.clientHeight ||
        canvas.width  !== ctx.canvas.clientWidth
      ) {
        resize();
      }
      update();
      render();
      window.requestAnimationFrame(animate);
    }

    function close() {
      reset();
      state.open = false;
      canvas.height = 100;  
    };

    function open() {
      if (!state.open) {
        resize();
        reset();
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
      state = startState();
      state.bounds.top    = canvas.height / 5;
      state.bounds.bottom = canvas.height / 5 * 4; 
      state.paddleRight.y = canvas.height / 2 - state.paddleRight.height / 2;
      state.paddleLeft.y  = canvas.height / 2 - state.paddleLeft.height  / 2;
      state.ball.y        = canvas.height / 2 - state.ball.height        / 2;
      state.ball.x        = canvas.width  / 2 - state.ball.width         / 2;
    };

    function resize() {
      var ctx = canvas.getContext('2d');
      canvas.height = ctx.canvas.clientHeight;  
      canvas.width  = ctx.canvas.clientWidth;
      reset();
    };

    function update() {
      var nextX = state.ball.x + state.ball.vx;
      var nextY = state.ball.y + state.ball.vy;

      // player paddleMovement [keyboard]
      if (state.controls.currentKey) {
        switch (state.controls.currentKey) {
          case 'ArrowUp':
            state.paddleRight.y -=
              state.paddleRight.y - 5 < state.bounds.top ?
                state.paddleRight.y - state.bounds.top :
                5;
            break;
          case 'ArrowDown':
            state.paddleRight.y += 
              state.paddleRight.y + state.paddleRight.height + 5 > state.bounds.bottom ?
                state.paddleRight.y + state.paddleRight.height - state.bounds.bottom :
                5;
            break;
          default:
            break;
        };        
      }

      // player paddleMovement [cursor]
      if (state.controls.cursorY && !state.controls.currentKey) {
        var cursorY = state.controls.cursorY;
        if (cursorY < (state.bounds.top + state.paddleRight.height / 2)) {
          cursorY = state.bounds.top + state.paddleRight.height / 2;
        } else if (cursorY > state.bounds.bottom - state.paddleRight.height) {
          cursorY = state.bounds.bottom - state.paddleRight.height / 2;
        }
        state.paddleRight.y = cursorY - state.paddleRight.height / 2;
      }


      // left paddleMovement
      if ((state.paddleLeft.y + state.paddleLeft.height / 2 - nextY ) > 0) {
        state.paddleLeft.y -=
          state.paddleLeft.y - 4 < state.bounds.top ?
              state.paddleLeft.y - state.bounds.top :
              4;
      } else {
        state.paddleLeft.y += 
          state.paddleLeft.y + state.paddleLeft.height + 4 > state.bounds.bottom ?
            state.paddleLeft.y + state.paddleLeft.height - state.bounds.bottom :
            4;
      }

      // top & bottom barriers
      if (
        nextY < state.bounds.top ||
        nextY > state.bounds.bottom - state.ball.height
      ) {
        state.ball.vy = -state.ball.vy;
      }

      // left bound
      if (nextX < state.paddleLeft.width) {
        // paddle hit
        if (
          nextY + state.ball.height  > state.paddleLeft.y &&
          nextY < state.paddleLeft.y + state.paddleLeft.height
        ) {
          state.ball.vx = -state.ball.vx
          state.ball.vx *= 1.025;
          state.ball.vy *= 1.025;
          return;
        }
        // score
        state.score.right += 1;
        if (state.score.right > 9) {
          state.paused = true;
          state.winner = 'You';
          return;
        }
        state.ball.y = canvas.height / 2 - state.ball.height / 2;
        state.ball.x = canvas.width  / 2 - state.ball.width  / 2;
        return;
      }

      // right bound
      if (nextX > (canvas.width - state.paddleRight.width - state.ball.width)) {
        // paddle hit
        if (
          nextY + state.ball.height   > state.paddleRight.y &&
          nextY < state.paddleRight.y + state.paddleRight.height
        ) {
          state.ball.vx = -state.ball.vx;
          state.ball.vx *= 1.025;
          state.ball.vy *= 1.025;
          return;
        }
        // score
        state.score.left += 1;
        if (state.score.left > 9) {
          state.paused = true;
          state.winner = 'I';
          return;
        }
        state.ball.y = canvas.height / 2 - state.ball.height / 2;
        state.ball.x = canvas.width  / 2 - state.ball.width  / 2;
        return;
      }

      state.ball.x += state.ball.vx;
      state.ball.y += state.ball.vy;

    };

    function render() {

      var ctx = canvas.getContext('2d');

      // clear frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle   = 'white';
      ctx.font        = "48px arial";
      ctx.strokeStyle = 'white';
      ctx.lineWidth   = '4';

      if (state.winner) {
        ctx.fillText(
          state.winner + ' win!',
          canvas.width  / 2 - 24 * (state.winner.length + 4) / 2,
          canvas.height / 2 
        );
        setTimeout(function(){ close(); canvas.close(); square.open(); }, 1200);
        return;
      }

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

      // bounds
      ctx.beginPath();
      ctx.moveTo(0           , state.bounds.top);
      ctx.lineTo(canvas.width, state.bounds.top);
      ctx.moveTo(canvas.width, state.bounds.bottom);
      ctx.lineTo(0           , state.bounds.bottom);
      ctx.stroke();

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
        state.paddleLeft.y,
        state.paddleLeft.width,
        state.paddleLeft.height
      );
      // right paddle
      ctx.fillRect(
        canvas.width - state.paddleRight.width - 4,
        state.paddleRight.y,
        state.paddleRight.width,
        state.paddleRight.height
      );
    };
    
    function keyDownHandler(event) {
      switch(event.key) {
        case ' ':
          togglePause();
          return;
        case 'ArrowDown':
          state.controls.currentKey = event.key;
          return;
        case 'ArrowUp':
          state.controls.currentKey = event.key;
          return;
        default:
          return;
      }
    };

    function keyUpHandler(event) {
      state.controls.currentKey = null;
    };

    function mouseDownHandler(event) {
      state.controls.cursorY = event.clientY;
    };

    function mouseUpHandler(event) {
      state.controls.cursorY = null;
    };

    function mouseMoveHandler(event) {
      if (state.controls.cursorY) {
        state.controls.cursorY = event.clientY;
      }
    };

    function touchStartHandler(event) {
      state.controls.cursorY = event.touches.item(0).clientY;
    };

    function touchEndHandler(event) {
      state.controls.cursorY = null;
    };

    function touchMoveHandler(event) {
      if (state.controls.cursorY) {
        state.controls.cursorY = event.touches.item(0).clientY;
      }
    };

    return {
      close: close,
      keyDownHandler: keyDownHandler,
      keyUpHandler: keyUpHandler,
      mouseDownHandler: mouseDownHandler,
      mouseMoveHandler: mouseMoveHandler,
      mouseUpHandler: mouseUpHandler,
      touchStartHandler: touchStartHandler,
      touchEndHandler: touchStartHandler,
      touchMoveHandler: touchMoveHandler,
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
  
  if (notCalled) {
    document.body.addEventListener('keypress', openCloseListener);
    document.body.addEventListener('keydown', game.keyDownHandler);
    document.body.addEventListener('keyup', game.keyUpHandler);
    document.body.addEventListener('mousedown', game.mouseDownHandler);
    document.body.addEventListener('mousemove', game.mouseMoveHandler);
    document.body.addEventListener('mouseup', game.mouseUpHandler);
    document.body.addEventListener('touchstart', game.touchStartHandler);
    document.body.addEventListener('touchmove', game.touchMoveHandler);
    document.body.addEventListener('touchend', game.touchEndHandler);
    notCalled = false;
  }
  square.close();
  canvas.open();
  game.resize();
  game.render();
  setTimeout(game.start, 1000);

  console.log('use the arrow keys to move up and down!\npress "q" to quit, space to toggle pause, and enter to reopen')
};

var runOnce = function () {
  console.log(
    '   ____             __ \r\n  \/ __\/ ___ _  ___ \/ \/_ ___   ____\r\n \/ _\/  \/ _ `\/ (_-<\/ __\/\/ -_) \/ __\/\r\n\/___\/__\\_,_\/ \/___\/\\__\/ \\__\/ \/_\/   \r\n  \/ __\/  ___ _  ___ _  \/ \/        \r\n \/ _\/   \/ _ `\/ \/ _ `\/ \/_\/         \r\n\/___\/   \\_, \/  \\_, \/ (_)          \r\n       \/___\/  \/___\/               \n',
    'run "pong()" to start a game!'
  );
  function secretKnock(){
    var count = 0;
    return function() {
      console.log(count);
      count++;
      if (count > 4) {
        pong();
        count = 0;
      };
    }
  }
  document.getElementsByClassName('title').item(0).addEventListener('click', secretKnock());
}();
