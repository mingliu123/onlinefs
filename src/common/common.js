const Base64 = require('js-base64').Base64;
const openTypeConfig = require("../config/opentypeconfig");
var $ = {};
$.string = { //后台解密
    secretkey: "1qaz2wsxE",
    decrypt: function(input) {
        var password = Base64.decode(Base64.decode(input));
        return password.substring(this.secretkey.length, password.length);
    },
    encrypt: function(input) {
        return Base64.encode(Base64.encode(this.secretkey + input));
    }
}

$.convert = {
    toFileSize: function(size) {
        var fileSize = size;
        if (fileSize < 1024) {
            return `${fileSize} b`;
        }
        fileSize = size / 1024;
        if (fileSize < 1024) {
            return `${fileSize} k`;
        }
        fileSize = size / 1024;
        if (fileSize < 1024) {
            return `${fileSize} M`;
        }
        fileSize = size / 1024;
        return `${fileSize} G`;

    }
}

$.config = {
    getOpenTypeConfig: function(extname) { //通过扩展名获取能够打开的文件
        var config = openTypeConfig.find(item => {
            return item.extname === extname
        });
        return config;
    }
}

module.exports = $;