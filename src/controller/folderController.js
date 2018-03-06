const controller = require("../base/controller");
const folderService = require("../services/folderService");
const diskService = require("../services/diskService");
const $ = require("../common/common");

module.exports = class folderController extends controller {
    constructor(request, response) {
        super(request, response);
    }

    getShortcuts() {
        var username = this.getCurrentUsername();
        new folderService().getShortcutsByUsername(username).then(function(results) {
            this.json(results);
        }.bind(this));
    }

    getFolderInfo(vm) { //vm是url的参数
        if (vm.type === "disk") {
            new diskService().getDiskById(vm.folderId).then(result => { //箭头函数没有this; resolve(disk);把对象变成指定格式的数组
                var viewmodel = [];
                viewmodel.push({
                    id: result.Id,
                    title: `${result.Letter}:`,
                    type: "disk",
                    isActive: true
                });
                this.json(viewmodel); //返回
            });
        } else {
            new folderService().getFolderInfo(vm.folderId).then(result => {
                var viewmodel = [];
                result.forEach(function(item) {
                    viewmodel.push({
                        id: item.Id,
                        title: item.name,
                        type: "floder",
                        isActive: false,
                        parentFolderId: item.parentFolderId
                    });
                })
                var diskId = result[0].diskId;
                new diskService().getDiskById(diskId).then(result => { //箭头函数没有this; resolve(disk);把对象变成指定格式的数组
                    viewmodel.push({
                        id: result.Id,
                        title: `${result.Letter}:`,
                        type: "disk",
                        isActive: false
                    });

                    viewmodel.sort((x, y) => {
                        if (x.type === "disk") {
                            return -1;
                        } else if (y.type === "disk") {
                            return 1;
                        } else {
                            return x.parentFolderId - y.parentFolderId
                        }
                    });

                    viewmodel[viewmodel.length - 1].isActive = true;
                    this.json(viewmodel);

                })
            })
        }
    }

    getFiles(vm) {
        (vm.type === "disk" ? new diskService().getSubFoldersById(vm.folderId, vm.sortType, parseInt(vm.isAsc), vm.searchKey) :
            new folderService().getFileAndFoldersByFolderId(vm.folderId, vm.sortType, parseInt(vm.isAsc), vm.searchKey)).then(result => {
            var files = result.map(item => {
                item.version = item.type === 2 ? "" : `${item.version}.0`;
                item.size = item.type === 2 ? "" : $.convert.toFileSize(item.size);
                item.modifyTime = new Date(item.modifyTime).toLocaleString();
                var fileType = item.fileType;
                if (item.type === 1 && item.fileType === null) {
                    var name = item.name.split(".");
                    if (name.length > 1) {
                        fileType = name[length - 1];
                    } else {
                        fileType = "文件";
                    }
                }
                item.fileType = fileType;
                item.actions = this._getActions(item);
                return item;
            });
            this.json(files);
        })
    }

    _getActions(fileOrFolder) {
        var actions = [];
        var extname = "";
        if (fileOrFolder.type === 1) {
            var names = fileOrFolder.name.split(".");
            extname = names.length > 1 ? names[names.length - 1] : "";
        }
        var openConfig = $.config.getOpenTypeConfig(extname);
        actions.push({
            type: "open",
            isEnable: openConfig != undefined && openConfig != null,
            config: openConfig,
        });
        return actions;
    }
}