const session = require("./session");
const $ = require("../common/common");
const fs = require("fs");
var streamLength = require("stream-length");

module.exports = class controller {
    constructor(request, response) {
        this.request = request;
        this.response = response;
    }
    json(data) {
        this.response.send(JSON.stringify(data));
        this.response.end();
    }

    setCookie(key, value, isExpire) {
        this.response.setHeader("set-cookie", `${key}=${value}${isExpire?"":(";expires=" + new Date("2229/1/1 1:1:1").toGMTString())};HttpOnly`);
    }
    getCookie(key) {
        var cookieStirng = this.request.headers["cookie"];
        if (cookieStirng !== undefined) {
            cookieStirng = cookieStirng.replace(/\s/g, "");
            var cookie = cookieStirng.split(";");
            var cookie = cookie.find((cookie) => {
                var cookieKeyValue = cookie.split("=");
                return cookieKeyValue[0] === key;
            });
            if (cookie) {
                return cookie.split("=")[1];
            }
            return null;
        }
        return null;
    }

    getCurrentUsername() {
        return $.string.decrypt(this.getCookie("auth"));
    }

    setSession(name, value) {
        session[name] = value;
    }
    getSession(name) {
        return session[name];
    }

    buffer(buffer) {
        this.response.write(buffer);
        this.response.end();
    }
    view(filename) {
        fs.readFile(filename, { encoding: "utf-8" }, (err, data) => {
            this.response.set("Content-Type", "text/html");
            this.response.send(data);
            this.response.end();
        })
    }

    content(context) {
        this.response.set("Content-Type", "text/plain");
        this.response.send(context);
        this.response.end();
    }

    stream(stream, contentType) {
        contentType = contentType || "application/octet-stream";
        streamLength(stream).then(size => {
            this.response.set("Content-type", contentType);
            this.response.set("Content-Length", size);
            this.response.set("Accept-Ranges", "bytes"); //是否允许断点续传
            this.response.set("Content-Ranges", `byte 0-${size}/${size}`); //result是length
            stream.on("data", data => {
                this.response.write(data);
            });
            stream.on("end", () => { //流结束关闭响应
                this.response.end();
            })
        })

    }
}