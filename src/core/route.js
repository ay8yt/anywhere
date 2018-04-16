const conf = require('../config/default');
const path = require('path');
const fs = require('fs');
const {promisify} = require("util");
const base64 = require('../util/file-base64');

//异步方法，包装成promise方法
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);

//压缩处理
const compress = require('../util/compress');
//部分请求
const range = require('../util/range');

async function route(req, res, conf){
	//根据请求的地址，返回请求的文件，首先获取请求地址
	let uri = req.url;
	//将命令行所在当前路径(本地磁盘路径)，与用户请求路径(/xxx)拼接起来
	let filepath = path.join(process.cwd(),uri);
	//打印出路径，即文件本地磁盘的真实路径
	// console.log(filepath.green);

	try {

		let state = await stat(filepath); //调用结果promisify包装的stat方法

		res.statusCode = 200;
		if(state.isFile()) { //如果是文件

			res.setHeader('Content-Type','text/plain;charset=utf8');

			//处理range请求，如果存在的话，code=206,如果不存在，code=200
			let {code, start, end} = range(state.size, req, res);
			let readstream = null;
			if(code == 206) {
				res.statusCode = 206;
				readstream = fs.createReadStream(filepath, {start, end});
			} else {
				readstream = fs.createReadStream(filepath)
			}
			//判断文件类型，决定是否压缩
			if(filepath.match(conf.compress)) {
				readstream = compress(readstream, req, res);
			}
			readstream.pipe(res);

		} else if(state.isDirectory()) { //文件夹读取
			res.setHeader('Content-Type','text/html;charset=utf8');
			let files = await readdir(filepath);

            if(!files || files.length==0) { //如果是空文件夹，直接返回提示
                res.end("该文件夹无内容!");
                return;
            }

			let temp = require("../templates/dir-list.art");

			let filelist = files.map((filename, index)=>{
				return {
					filename : filename,
					type : fs.statSync( path.join(process.cwd(),uri, filename) ).isDirectory() ? 'dir' : 'file'
				}
			})
			// console.log( path.join(__dirname,"../images/folder.png").red )
			let htmlstr = temp({
				folderimg: base64(path.join(__dirname,"../images/folder.png")),
				data:filelist,
				basePath: `http://${conf.hostname}:${conf.port}`,  //获取服务器地址及端口号
				currentPath: uri.replace(/([^\/])$/, "$1/"), //获取请求的当前路径， 例如请求http://localhost:9527/src/util, 则返回src/util
			});

			res.end( htmlstr );

		}
	} catch (e) {
		console.log(e.toString().red);
		res.statusCode = 404;
		res.setHeader('Content-Type','text/plain;charset=utf8');
		res.end(`${decodeURI(filepath)} 该地址不存在，请确保请求路径正确！`);
	}
}

module.exports = {
	route
}
