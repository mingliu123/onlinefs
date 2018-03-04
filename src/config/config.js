module.exports = {
    port: 3001,
    static: {
        extension: ['html', 'js', 'css', 'png', 'ico', 'jpg', 'bmp', 'jpeg'],
        maxAge: '0d',
    },
    ad: {
        url: "ldap://47.100.13.189",
        user: "administrator@root.com",
        pass: "2wsx3edcR"
    },
    db: {
        host: "47.100.13.189",
        user: "root",
        password: "1qaz2wsxE",
        database: "onlinefs",
        connectTimeout: 1000000
    },
    uploadDir: "./src/view/upload",
    anonymous: [
        /\.js/,
        /login/,
        /\.css/,
        /\.png/,
        /\.gif/,
        /getVerificationCode/,
        /checkVerificationCode/,
    ]



}