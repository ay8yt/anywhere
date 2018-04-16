
const {createGzip, createDeflate} = require('zlib');

module.exports = (readstream, req, res) => {
	//从request中取出浏览器支持的压缩类型
	const acceptEncoding = req.headers['accept-encoding'];

	if(!acceptEncoding || !acceptEncoding.match(/\b(gzip|deflate)\b/) ){
		return readstream; //若不支持直接返回
	} 
	else if(acceptEncoding.match(/\bgzip\b/)) { 
		res.setHeader('Content-Encoding', 'gzip');
		return readstream.pipe(createGzip());
	} 
	else if(acceptEncoding.match(/\bdeflate\b/)) {
		res.setHeader('Content-Encoding', 'deflate');
		return readstream.pipe(createDeflate());
	}
}