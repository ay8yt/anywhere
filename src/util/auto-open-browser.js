
const {exec} = require('child_process'); //引入子进程处理模块

module.exports = (url)=>{ 
	switch(process.platform) {
		case 'darwin' : exec(`open ${url}`); break; //mac系统
		case 'win32' : exec(`start ${url}`); break; //windows系统
	}
}