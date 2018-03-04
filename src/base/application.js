const express = require("express");
const config = require("../config/config");
const routes = require("../routes/route");
const controllers = require("../controller");
var formidable = require('formidable');
const $ = require("../common/common");
const userService = require("../services/userService");
const fs = require("fs");


module.exports = class Application {
    constructor() {
        this.app = express(); //框架
    }

    setStatic() {
        this.app.use(express.static(__dirname + "/../view", { //利用框架内置中间件处理静态文件
            dotfiles: 'ignore',
            etag: false,
            extensions: config.static.extension,
            index: false,
            maxAge: config.static.maxAge,
            redirect: false,
            setHeaders: function(res, path, stat) {
                res.set("x-timestamp", Date.now());
            }
        }));
    }

    setGet() {
        this.app.get(/.*/, (request, response, next) => {
            request.data = request.query;
            next();
        });
    }

    setJson() {
        this.app.post(/.*/, (request, response, next) => {
            if (/text\/plain/.test(request.headers["content-type"])) {
                var data = "";
                request.on("readable", function() { //注册readable（流中有数据可供读取时）事件
                    request.setEncoding("utf8");
                    var temp = request.read();
                    if (temp && temp !== null) {
                        data += temp;
                    }
                });

                request.on("end", () => {
                    data = JSON.parse(data);
                    request.data = data;
                    next();
                });
            } else {
                next();
            }
        });
    }

    setFormData() {
        this.app.post(/.*/, (request, response, next) => {
            if (!/text\/plain/.test(request.headers["content-type"])) {
                var form = new formidable.IncomingForm();
                form.uploadDir = config.uploadDir;
                form.keepExtensions = true;
                form.parse(request, (err, fields, files) => {
                    request.data = fields;
                    request.files = files;
                    next();
                });
            } else {
                next();
            }
        });
    }
    setCheckAuthority() {
        this.app.use((request, response, next) => {
            for (let i in config.anonymous) {
                if (config.anonymous[i].test(request.url)) {
                    next();
                    return;
                }
            }
            let cookieString = request.headers["cookie"];
            if (!cookieString || cookieString === "") {
                response.statusCode = 401;
                throw error("Unanthorized");

            } else {
                cookieString = cookieString.replace(/\s/g, "");
                var key = "auth";
                var cookies = cookieString.split(";");
                var cookie = cookies.find((cookie) => {
                    var cookieKeyValue = cookie.split("=");
                    return cookieKeyValue[0] === key;
                });
                if (cookie) {
                    let auth = cookie.split("=")[1];
                    try {
                        let username = $.string.decrypt(auth);
                        new userService().getUserByUsername(username).then((result) => {
                            if (result && result.length >= 1) {
                                next()
                            } else {
                                response.statusCode = 401;
                                throw new Error("Unanthorized");
                            }
                        });
                    } catch (e) {
                        console.log(e);
                        response.statusCode = 401;
                        throw new Error("Unanthorized");
                    }
                } else {
                    response.statusCode = 401;
                    throw new Error("Unanthorized");
                }
            }
        });
    }
    setErrorHander() {
        this.app.use((error, request, response, next) => {
            response.set("Content-Type", "text/html");
            response.statusCode = response.statusCode !== 401 && response.statusCode !== 404 ? 500 : response.statusCode;
            var errorPagePath = `${__dirname}/../view/error/${response.statusCode}.html`;
            fs.readFile(errorPagePath, { encoding: "utf-8" }, (err, data) => {
                response.send(data);
                response.end();
            });


        })
    }
    start() {
        this.setCheckAuthority();
        this.setStatic();
        this.setGet();
        this.setJson();
        this.setFormData();
        for (let key in routes) {
            this.app.all(routes[key].url, (request, response) => { //app.all() 是一个特殊的路由方法，没有任何 HTTP 方法与其对应，它的作用是对于一个路径上的所有请求加载中间件。
                try {

                    var controller = new controllers[routes[key].controller](request, response);
                    controller[routes[key].action](request.data);
                } catch (e) {
                    throw e;
                }

            });
        }
        this.app.all(/.*/, (request, response) => {
            response.statusCode = 404;
            throw new Error("Not found");
        })
        this.setErrorHander();
        this.app.listen(config.port);
    }
}