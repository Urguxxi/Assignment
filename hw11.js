var http = require("http");
var url = require("url");
var path = require("path");
var mime = require("mime");
var fs = require("fs");
var urlencode = require('urlencode');

//创建服务器
http.createServer(function(req, res) {
    var pathname = url.parse(req.url).pathname; //解析请求和文件名
    pathname = urlencode.decode(pathname, 'utf-8');
    // if (pathname == "/favicon.ico") return;
    finalpath = __dirname + pathname; //构造绝对路径

    fs.exists(finalpath, function(exists) {
        //检查路径是否存在
        if (exists) {
            //如果路径指向文件夹
            if (fs.statSync(finalpath).isDirectory()) {
                fs.readdir(finalpath, function(err, files) {
                    if (err) {
                        res.writeHead(200, { "Content-Type": 'text/plain' });
                        res.end("<h1>404 page cannot be found</h1>");
                        //打开文件夹出现错误
                        // HTTP 状态码: 404 : NOT FOUND
                        // Content Type: text/html
                    } else {
                        var html = "<head><meta charset='utf-8'></head>";
                        var files = fs.readdirSync(finalpath);
                        for (var i in files) {
                            //遍历文件
                            var filename = files[i];
                            html += "<div ><h2><a href='http://127.0.0.1:8088" +
                                pathname + '/' + filename + "'>" + filename + "</a></h2></div>";
                        } //打印内容名
                        res.writeHead(200, { 'content-type': 'text/html' });
                        res.end(html);
                    }
                });
            //如果路径指向文件
            } else if (fs.statSync(finalpath).isFile()) {
                fs.readFile(finalpath, function(err, data) {
                    if (err) { res.end("Cannot read file..."); } else {
                        res.writeHead(200, { "Content-Type": mime.getType(path.basename) });
                        res.end(data);
                    }
                })
            //找不到对应文件夹和文件
            } else {
                res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
                res.end("<h1>404 page cannot be found!</h1>");
            }
        }
    })
}).listen(8088);