

require('colors'); //增加命令行输出颜色，引入后直接使用
const template = require('art-template'); //art-template模板引擎，引入后直接使用
const http = require('http');
const compress = require('./util/compress');

const defaultConfig = require('./config/default');
const {route} = require('./core/route');



class Server {
	constructor(config) {
		this.conf = Object.assign({}, defaultConfig, config);
	}	

	start(){
		let server = http.createServer( (req,res) => {
			route(req,res,this.conf);
		});

		let url = `http://${this.conf.hostname}:${this.conf.port}`;
		this.url = url; 
		server.listen(this.conf.port, this.conf.hostname, ()=>{
		    console.info(`Server started at ${url}`.green);
		})
		return this;
	}
}

module.exports = Server;
