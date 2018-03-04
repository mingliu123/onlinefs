(function() {
    $.component(function() {
        return {
            tagname: "onlinefs-photo",
            template: "<div>\
            <input type ='text' value='{{state.filename}}' readonly />\
            <button>选择文件</button>\
            <input type ='file' onChange = '$.choose(this.value,this.files[0])' accept = 'image/*'/>\
         </div>\
         <img src='{{state.newPhoto}}'/>",
            state: {
                file: "",
                filename: "",
                newPhoto: $.selector("#onlinefs-index-user-photo").src
            },
            controller: function() {

            },
            choose: function(value, file) {
                if (/\.jpg$|\.png$|\.bmp$|\.jpeg$/.test(value)) {
                    var reader = new FileReader();
                    reader.onload = function() {
                        this.setState({
                            newPhoto: reader.result
                        })
                    }.bind(this);
                    reader.readAsDataURL(file); //读取本地文件
                    this.setState({
                        filename: value,
                        file: file,

                    });
                }
            }
        }
    });
    $.dialog.subscribe("onlinefschangephoto", "submit", function() {
        $.component.loading.setState({ isLoading: true });
        $.http.post("/changePhoto", { photo: $.component.photo.state.file }, function(result) {
            $.component.loading.setState({ isLoading: false });
            if (result.isSuccess) {
                $.message.success("修改头像成功！");
                $.component.onlinefschangephoto.close();
                $.http.get("/getUserInfo", function(result) {
                    $.selector("#onlinefs-index-user-displayname").innerText = result.DisplayName;
                    if (result.Photo && result.Photo != "") {
                        $.selector("#onlinefs-index-user-photo").src = "../upload/" + result.Photo;
                    }
                })
            } else {
                $.message.error("修改头像失败，请重试！");

            }
        }, "formData");
    });
})();