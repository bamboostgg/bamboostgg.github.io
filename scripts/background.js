function liquidBackground() {
  var canvas = document.getElementById('background');

  function resize() { 
      var ctx = canvas.getContext('2d');
      canvas.height = ctx.canvas.clientHeight;  
      canvas.width  = ctx.canvas.clientWidth;
  }

  function toRadians (angle) {
    return angle * (Math.PI / 180);
  }

  function animate(e) {
    var ctx = canvas.getContext('2d');

    var height = canvas.height;
    var width  = canvas.width
    var theta  = toRadians(e.gamma);
    var tan = Math.tan(theta);
    var adj = canvas.width/2;
    var opp = tan * adj;

    console.log({theta, tan, adj, opp})
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'white'; 
    ctx.moveTo(0    , height/2 + opp);
    ctx.lineTo(width, height/2 - opp);
    ctx.stroke();
    ctx.fill();
  }

  resize();
  window.ondeviceorientation = animate;
}