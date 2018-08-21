var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var fs = require("fs");
var app = express();

app.get('*', function(req, res, next) {
    let url = req.url === '/' ? "./public/index.html" : "./public" + req.url;

	fs.readFile(url, (error, data) => {
		if(!error) {
			res.writeHead(200);
			res.write(data);
			res.end();
		}
		else {
			res.writeHead(404, {'Content-Type':'text/plain'});
			res.end();
		}
	})
})

app.post("/upload",function(req,res,next){
    const form = new formidable.IncomingForm();

    form.uploadDir = "./public";

    form.parse(req, function(err, fields, files) {
        const oldpath = files.file.path;
        const extname = files.file.name;
        const newpath = "./public/" + extname;

        fs.rename(oldpath, newpath, function(err) {
            if(err) {
                res.send({errno:1,data:[]});
            };
            const myPath = newpath.replace("./public", "http://localhost:3000");

            res.send({path: myPath})
        });
    });
})


const server = app.listen(3000, function () {
    const host = server.address().address;
    const port = server.address().port;
  
    console.log('Example app listening at http://%s:%s', host, port);
});