
//window.alert();  //ESline检查会报错，因为指定了node环境，没有window

const http = require('http');

const conf = require('./config/default');

const server = http.createServer((req,res)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','text/html;charset=UTF-8');
    res.write('<html>')
    res.write('<body>hello，这是服务器返回的数据</body>');
    res.write('</html>')
    res.end();
})

server.listen(conf.port, conf.hostname, ()=>{
    let addr = `http://${conf.hostname}:${conf.port}`;
    console.info(`Server started at ${addr}`);
})
