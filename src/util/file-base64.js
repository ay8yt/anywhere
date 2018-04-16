
const fs = require('fs');

module.exports = (filepath)=>{
	let bits = fs.readFileSync(filepath);
	return new Buffer(bits).toString('base64');
}