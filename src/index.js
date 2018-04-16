

require('colors'); //增加命令行输出颜色，引入后直接使用
const template = require('art-template'); //art-template模板引擎，引入后直接使用
const http = require('http');
const compress = require('./util/compress');

const conf = require('./config/default');
const {handle} = require('./core/route');

let server = http.createServer( (req,res) => {
	handle(req,res);
});

server.listen(conf.port, conf.hostname, ()=>{
    console.info(`Server started at http://${conf.hostname}:${conf.port}`.green )
})
