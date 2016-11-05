let express = require('express');
let path = require('path');
let app = express();

const port = process.env.PORT || 3000;

const server = () => {
  console.log(`server running on port ${port} in ${process.env.NODE_ENV} mode in ${__dirname}`);
  app.listen(port);
  app.get('/', function(req,res) {
    res.sendfile(`${__dirname}/../client/index.html`);
  });
};

server();

