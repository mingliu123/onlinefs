const sqlHelper = require("../common/sqlHelper");
module.exports = class diskService {
    getDisks() {
        return sqlHelper.query("select id,concat(name,'(',letter,':)') as name from onlinefs_disks");
    }

    getDiskById(diskId) { //返回一个对象
        return new Promise((resolve, reject) => {
            return sqlHelper.query(`select * from onlinefs_disks where id = ${diskId}`).then(result => {
                var disk = result[0]; //sql语句执行的结果使数组
                resolve(disk); //成功
            });
        });

    }
}