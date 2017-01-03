function pong() {
  var notCalled = true;
  var square = function() {
    var $outer   = document.getElementById('outer'),
        $graphic = document.getElementById('graphic'),
        $name    = document.getElementById('name'),
        $gitLink = document.getElementById('git-link'),
        $inLink  = document.getElementById('in-link'),
        $resLink = document.getElementById('res-link');

    var classes1 = $outer.classList,
        classes2 = $graphic.classList,
        classes3 = $name.classList,
        classes4 = $gitLink.classList,
        classes5 = $inLink.classList,
        classes6 = $resLink.classList;

    return {
      open: function() {
        classes1.contains('hidden')
        && classes1.remove('hidden');
        classes2.contains('hidden')
        && classes2.remove('hidden');
        classes3.contains('hidden')
        && classes3.remove('hidden');
        classes4.contains('hidden')
        && classes4.remove('hidden');
        classes5.contains('hidden')
        && classes5.remove('hidden');
        classes6.contains('hidden')
        && classes6.remove('hidden');
      },
      close:  function() {
        !classes1.contains('hidden')
        && classes1.add('hidden');
        !classes2.contains('hidden')
        && classes2.add('hidden');
        !classes3.contains('hidden')
        && classes3.add('hidden');
        !classes4.contains('hidden')
        && classes4.add('hidden');
        !classes5.contains('hidden')
        && classes5.add('hidden');
        !classes6.contains('hidden')
        && classes6.add('hidden');
      },
    };
  }();

  var canvas = function() {
    var elem = document.getElementById('canvas');
    var classes = elem.classList;
    elem.open = function() {
      if (classes.contains('hidden')) {
        classes.remove('hidden');
      }
    };
    elem.close = function() {
      if (!classes.contains('hidden')) {
        classes.add('hidden');
      }
    };
    
    return elem;
  }();

  var exit = function() {
    var elem = document.getElementById('exit');
    var classes = elem.classList;
    elem.open = function() {
      if (classes.contains('hidden')) {
        classes.remove('hidden');
      }
    };
    elem.close = function() {
      if (!classes.contains('hidden')) {
        classes.add('hidden');
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
          name: [
            'Mrs.Bump',
            'Mr.Bonk',
            'Dr.Boop',
            'Paddy',
          ][(Math.random() * 4) | 0],
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
      var ball   = state.ball;
      var bounds = state.bounds;
      var left   = state.paddleLeft;
      var right  = state.paddleRight;
      var nextX  = ball.x + ball.vx;
      var nextY  = ball.y + ball.vy;

      // player paddleMovement [keyboard]
      if (state.controls.currentKey) {
        switch (state.controls.currentKey) {
          case 'ArrowUp':
            right.y -=
              right.y - 5 < bounds.top ?
                right.y - bounds.top :
                5;
            break;
          case 'ArrowDown':
            right.y += 
              right.y + right.height + 5 > bounds.bottom ?
                right.y + right.height - bounds.bottom :
                5;
            break;
          default:
            break;
        };        
      }

      // player paddleMovement [cursor]
      if (state.controls.cursorY && !state.controls.currentKey) {
        var cursorY = state.controls.cursorY;
        if (cursorY < (bounds.top + right.height / 2)) {
          cursorY = bounds.top + right.height / 2;
        } else if (cursorY > bounds.bottom - right.height / 2) {
          cursorY = bounds.bottom - right.height / 2;
        }
        right.y = cursorY - right.height / 2;
      }


      // left paddleMovement
      if ((left.y + left.height / 2 - nextY ) > 0) {
        if((left.y + left.height / 2 - nextY ) < 4) {
          left.y -= 1;
        } else {
        left.y -=
          left.y - 4 < bounds.top ?
              left.y - bounds.top :
              4;
        }
      } else {
        if((left.y + left.height / 2 - nextY ) > -4) {
          left.y += 1;
        } else {
        left.y += 
          left.y + left.height + 4 > bounds.bottom ?
            left.y + left.height - bounds.bottom :
            4;
        }
      }

      // top & bottom barriers
      if (
        nextY < bounds.top ||
        nextY > bounds.bottom - ball.height
      ) {
        ball.vy = -ball.vy;
      }

      // left bound
      if (nextX < left.width) {
        // paddle hit
        if (
          nextY + ball.height > left.y &&
          nextY < left.y + left.height
        ) {
          ball.vx = -ball.vx
          ball.vx *= 1.05;
          ball.vy = (
            nextY
            + ball.height / 2
            - left.y
            - left.height / 2
            ) / 4;
          return;
        }
        // score
        ball.vy = 3.5;
        ball.vx = -ball.vx;
        state.score.right += 1;
        if (state.score.right > 2) {
          state.paused = true;
          state.winner = 'You';
          return;
        }
        ball.y = canvas.height / 2 - ball.height / 2;
        ball.x = canvas.width  / 2 - ball.width  / 2;
        return;
      }

      // right bound
      if (nextX > (canvas.width - right.width - ball.width)) {
        // paddle hit
        if (
          nextY + ball.height > right.y &&
          nextY < right.y + right.height
        ) {
          ball.vx = -ball.vx;
          ball.vx *= 1.025;
          ball.vy = (
            nextY
            + ball.height / 2
            - right.y
            - right.height / 2
            ) / 4;

          return;
        }
        // score
        ball.vy = 3.5;
        ball.vx = -ball.vx;
        state.score.left += 1;
        if (state.score.left > 2) {
          state.paused = true;
          state.winner = "Me";
          return;
        }
        ball.y = canvas.height / 2 - ball.height / 2;
        ball.x = canvas.width  / 2 - ball.width  / 2;
        return;
      }

      ball.x += ball.vx;
      ball.y += ball.vy;

    };

    function render() {

      var ctx = canvas.getContext('2d');

      // clear frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle   = 'white';
      ctx.font        = "48px arial";
      ctx.strokeStyle = 'white';
      ctx.lineWidth   = '4';

      // win state
      if (state.winner) {
        ctx.fillText(
          state.winner === 'You' ? 'You Win!' : 'You Lose' ,
          canvas.width  / 2 - 24 * (8) / 2,
          canvas.height / 2 
        );
        setTimeout(closeAll, 1200);
        return;
      }


      // shorthand
      var ball   = state.ball;
      var bounds = state.bounds;
      var left   = state.paddleLeft;
      var right  = state.paddleRight;

      // score
      ctx.fillText(
        state.score.left,
        canvas.width / 2 - 60,
        bounds.top - 10
      );
      ctx.fillText(
        state.score.right,
        canvas.width / 2 + 36,
        bounds.top - 10
      );
      ctx.font = "24px arial";
      ctx.fillText(
        left.name,
        canvas.width / 2 - (6 + left.name.length * 12) ,
        bounds.top - 58
      );
      ctx.fillText(
        'You',
        canvas.width / 2 + 30,
        bounds.top - 58
      );

      // bounds
      ctx.beginPath();
      ctx.moveTo(0           , bounds.top);
      ctx.lineTo(canvas.width, bounds.top);
      ctx.moveTo(canvas.width, bounds.bottom);
      ctx.lineTo(0           , bounds.bottom);
      ctx.stroke();

      // ball
      ctx.fillRect(
        ball.x,
        ball.y,
        ball.width,
        ball.height
      );

      // left paddle
      ctx.fillRect(
        4,
        left.y,
        left.width,
        left.height
      );
      // right paddle
      ctx.fillRect(
        canvas.width - right.width - 4,
        right.y,
        right.width,
        right.height
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
      event.preventDefault();
      state.controls.cursorY = event.touches.item(0).clientY;
    };

    function touchEndHandler(event) {
      event.preventDefault();
      state.controls.cursorY = null;
    };

    function touchMoveHandler(event) {
      event.preventDefault();
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
      touchEndHandler: touchEndHandler,
      touchMoveHandler: touchMoveHandler,
      open: open,
      reset: reset,
      resize: resize,
      render: render,
      start: start,
    };
  }(canvas);

  var closeAll = function() {
    square.open();
    canvas.close();
    exit.close();
    game.close();

    document.removeEventListener('keypress', openCloseListener);
    document.removeEventListener('keydown', game.keyDownHandler);
    document.removeEventListener('keyup', game.keyUpHandler);
    document.removeEventListener('mousedown', game.mouseDownHandler);
    document.removeEventListener('mousemove', game.mouseMoveHandler);
    document.removeEventListener('mouseup', game.mouseUpHandler);
    document.removeEventListener('touchstart', game.touchStartHandler);
    document.removeEventListener('touchmove', game.touchMoveHandler);
    document.removeEventListener('touchend', game.touchEndHandler);
  }
  var openAll = function() {

    square.close();
    canvas.open();
    exit.open();
    game.resize();
    game.render();

    document.addEventListener('keypress', openCloseListener);
    document.addEventListener('keydown', game.keyDownHandler);
    document.addEventListener('keyup', game.keyUpHandler);
    document.addEventListener('mousedown', game.mouseDownHandler);
    document.addEventListener('mousemove', game.mouseMoveHandler);
    document.addEventListener('mouseup', game.mouseUpHandler);
    document.addEventListener('touchstart', game.touchStartHandler);
    document.addEventListener('touchmove', game.touchMoveHandler);
    document.addEventListener('touchend', game.touchEndHandler);

    setTimeout(game.start, 1000);
  }

  var openCloseListener = function(event) {
    switch(event.key) {
      case 'q':
        closeAll();
        return;
      case 'Enter':
        openAll();
        return;
      default:
        return;
    }
  };
  
  if (notCalled) {
    document.getElementById('exit').addEventListener('mouseup', closeAll);
    document.getElementById('exit').addEventListener('touchend', closeAll);
    window.addEventListener('resize', game.resize);
    notCalled = false;
  }
  openAll();

  console.log('use the arrow keys to move up and down!\npress "q" to quit, space to toggle pause, and enter to reopen')
};