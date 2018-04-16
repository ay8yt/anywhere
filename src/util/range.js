
module.exports = (total, req, res) => {
	let range = req.headers['range'];
	if(!range) return {code ； 200};

	let matched = range.match(/bytes=(\d*)-(\d*)/);
	let [start, end, length] = [ matched[1],matched[2], matched[2]-matched[1] ];

	if(start > end || start < 0 || end > total) {
		return {code : 200}; //请求的数据大小错误，则返回全部内容
	}

	res.setHeader('Accept-Ranges', 'bytes');
	res.setHeader('Content-Range', `bytes ${start}-${end}/${total}`);
	res.setHeader('Content-Length', end-start);
	return {
		code: 206,
		start: parseInt(start),
		end: parseInt(end)
	}
}