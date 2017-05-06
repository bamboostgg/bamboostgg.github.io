function liquidBackground() {
  var canvas = document.getElementById('background');
  var radius = Math.sqrt(
    Math.pow(canvas.height, 2) +
    Math.pow(canvas.width, 2)
  ) / 2;

  function resize() { 
    var ctx = canvas.getContext('2d');
    canvas.height = ctx.canvas.clientHeight;  
    canvas.width  = ctx.canvas.clientWidth;
    radius = Math.sqrt(
      Math.pow(canvas.height, 2) +
      Math.pow(canvas.width, 2)
    ) / 2;
  }

  function toRadians (angle) {
    return angle * (Math.PI / 180);
  }

  function animate(e) {
    var ctx = canvas.getContext('2d');

    var height = canvas.height;
    var width  = canvas.width;
    var theta  = toRadians(e.gamma);
    var tan = Math.tan(theta);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.beginPath();
    ctx.fillStyle = '#1D4350';
    ctx.arc(width/2, height/2, radius, -theta, -(theta - Math.PI));
    ctx.fill();
  }

  resize();
  window.ondeviceorientation = animate;
}