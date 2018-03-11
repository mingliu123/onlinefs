const controller = require("../base/controller");
const fileService = require("../services/fileService");
const sbmHelper = require("../common/sbmHelper");

module.exports = class folderController extends controller {
    constructor(request, response) {
        super(request, response);
    }

    getFileContext(vm) {
        new fileService().getFileById(vm.id).then(file => {
            if (vm.type === "txt") {
                sbmHelper.readFile(file.name, file.domain, file.username, file.password).then(data => {
                    this.content(data);
                }, err => {
                    throw err;
                })
            } else if (vm.type === "stream") {
                this.stream(sbmHelper.readFileStream(file.name, file.domain, file.username, file.password), vm.contentType);
            }
        })
    }

    getAudioList(vm) {
        new fileService().getFilesByFileType(1, vm.pageIndex, vm.pageSize, vm.sortType, vm.isAsc == 1).then(result => {
            this.json(result);
        })
    }
}