function init() {
  console.log(
    '   ____             __ \r\n  \/ __\/ ___ _  ___ \/ \/_ ___   ____\r\n \/ _\/  \/ _ `\/ (_-<\/ __\/\/ -_) \/ __\/\r\n\/___\/__\\_,_\/ \/___\/\\__\/ \\__\/ \/_\/   \r\n  \/ __\/  ___ _  ___ _  \/ \/        \r\n \/ _\/   \/ _ `\/ \/ _ `\/ \/_\/         \r\n\/___\/   \\_, \/  \\_, \/ (_)          \r\n       \/___\/  \/___\/               \n',
    'run "pong()" to start a game!'
  );
  function secretKnock(){
    var count = 0;
    return function() {
      count++;
      if (count > 4) {
        pong();
        count = 0;
      };
    }
  }

  function backgroundHandler (backgroundClass) {
    return function () {
      if (document.body.classList.contains(backgroundClass)){
        return;
      }
      document.body.className = "container fullscreen " + backgroundClass;
    }
  }

  document.getElementById('title').addEventListener('click', secretKnock());
  document.getElementById('labels')
    .addEventListener('mouseleave', function(){
      setTimeout(backgroundHandler('background-cubes'), 500)
    });
  document.getElementById('label1').addEventListener('click', backgroundHandler('background-circuits'));
  document.getElementById('label2').addEventListener('click', backgroundHandler('background-curves'));
  document.getElementById('label3').addEventListener('click', backgroundHandler('background-aztec'));
  document.getElementById('label1').addEventListener('touchstart', backgroundHandler('background-circuits'));
  document.getElementById('label2').addEventListener('touchstart', backgroundHandler('background-curves'));
  document.getElementById('label3').addEventListener('touchstart', backgroundHandler('background-aztec'));
};

init();
