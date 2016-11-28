var runOnce = function () {
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
  document.getElementById('title').addEventListener('click', secretKnock());
}();
