const smb2 = require("smb2"); //读取smb协议的共享文件
const fs = require("fs");

module.exports = {
    readFile: function(filename, domain, username, password) {
        // var folder = filename.substring(0, filename.lastIndexOf("\\"));
        // var smb2Client = new smb2({
        //     share: folder,
        //     domain: domain,
        //     username: username,
        //     password: password,
        // });
        // return new Promise((resolve, reject) => { //自定义readFile的回掉
        //     fs.readFile(filename, {
        //         encoding: "utf8",
        //         function(err, data) {
        //             if (err) {
        //                 reject(err);
        //             } else {
        //                 resolve(data)
        //             }
        //         }
        //     });
        // })
        return new Promise((resolve, reject) => {
            fs.readFile(filename, { encoding: "utf8" },
                function(err, data) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                })
        })
    },

    readFileStream: function(filename, domain, username, password) {
        return fs.readReadStream(filename)
    }
}