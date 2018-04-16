#! node

const yargs = require('yargs'); //引入yargs

//配置命令及参数，同时获取用户的命令行输入
const args = yargs
			.usage('anywhere [options]')
			.option('p', {
				alias: 'port',
				describe: '端口号',
				default: 9527
			})
			.option('h',{
				alias: 'hostname',
				describe: 'host',
				default: 'localhost'
			})
			.version()
			.help()
			.argv; 

const Server  = require('./app');

let ser = new Server(args).start();

const autoOpen = require('./util/auto-open-browser'); //引入自动打开浏览器模块
autoOpen(ser.url);
