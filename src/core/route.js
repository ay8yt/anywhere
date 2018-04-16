const conf = require('../config/default');
const path = require('path');
const fs = require('fs');
const {promisify} = require("util");

//异步方法，包装成promise方法
const stat = promisify(fs.stat); 
const readdir = promisify(fs.readdir);

//压缩处理
const compress = require('../util/compress');
//部分请求
const range = require('../util/range');

async function handle(req, res){
	//根据请求的地址，返回请求的文件，首先获取请求地址
	let uri = req.url;
	//将命令行所在当前路径，与用户请求路径拼接起来
	let filepath = path.join(process.cwd(),uri);
	console.log(filepath.green);

	try {

		let state = await stat(filepath);
		
		res.statusCode = 200;
		if(state.isFile()) { //文件读取
			res.setHeader('Content-Type','text/plain;charset=utf8');

			
			let {code, start, end} = range(state.size, req, res);

			let readstream = fs.createReadStream(filepath)
			//判断文件类型，决定是否压缩
			if(filepath.match(conf.compress)) {
				readstream = compress(readstream, req, res);
			}
			readstream.pipe(res);

		} else if(state.isDirectory()) { //文件夹读取
			res.setHeader('Content-Type','text/html;charset=utf8');
			let files = await readdir(filepath);
			let temp = require("../templates/dir-list.art");

			let filelist = files.map((filename, index)=>{
				return {
					filename : filename,
					type : fs.statSync( path.join(process.cwd(),uri, filename) ).isDirectory() ? 'dir' : 'file'
				}
			})

			console.log(filelist)
			let htmlstr = temp({
				data:filelist,
				basePath: path.basename(uri)  //获取当前请求地址
			});

			// console.log(files, path.basename(uri));
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
	handle
}