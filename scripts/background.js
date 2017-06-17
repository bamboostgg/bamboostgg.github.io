function liquidBackground() {
  var canvas = document.getElementById('background');
  var radius = setRadius();
  var alpha;

  function setRadius() {
    return Math.sqrt(
      Math.pow(canvas.height * 1.5, 2) +
      Math.pow(canvas.width * 1.5, 2)
    ) / 2;
  }

  function resize() { 
    var ctx = canvas.getContext('2d');
    canvas.height = ctx.canvas.clientHeight;  
    canvas.width  = ctx.canvas.clientWidth;
    radius = setRadius()
  }

  function toRadians (angle) {
    return angle * (Math.PI / 180);
  }

  function animate(e) {
    if (!alpha) {
      alpha = e.alpha;
    }

    var ctx = canvas.getContext('2d');

    var vUnit = canvas.height / 3;
    var width = canvas.width;
    var theta = toRadians(
      e.gamma * e.beta /90
      + (alpha - e.alpha) * (1 - e.beta / 90)
    );
    var tan = Math.tan(theta);
    var top = vUnit + vUnit * (e.beta / 90);

    ctx.fillStyle = '#1D4350';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(width/2, top, radius, -theta, -(theta - Math.PI));
    ctx.fill();

    if (location.search.match('debug=1')) {
      ctx.font = "16px San Serif";
      ctx.fillStyle = "#FFF";
      ctx.fillText('alpha ' + e.alpha , 10, canvas.height - 75);
      ctx.fillText('beta '  + e.beta  , 10, canvas.height - 50);
      ctx.fillText('gamma ' + e.gamma , 10, canvas.height - 25);
    }
  }

  resize();

  if (!window.DeviceOrientationEvent) {
      animate({
        alpha: 0,
        gamma: 0,
        beta: 45,
      })
  }

  window.ondeviceorientation = animate;
}