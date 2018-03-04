(function() {
    $.component.loading.enable();
    $.http.get("/getUserInfo", function(result) {
        $.selector("#onlinefs-index-user-displayname").innerText = result.DisplayName;
        if (result.Photo && result.Photo != "") {
            $.selector("#onlinefs-index-user-photo").src = "../upload/" + result.Photo;
        }
        $.component.loading.disable();
    });
    $.selector("#onlinefs-index-user").addEventListener("click", function() {
        var dialog = new $.dialog({
            id: "onlinefschangephoto",
            title: "修改头像",
            button: "确认",
            innerHTML: "<onlinefs-photo id='photo'></onlinefs-photo>",
            style: "/photo/photo.css",
            script: "/photo/photo.js"
        });
        dialog.show();
    });
    $.component(function() {
        return {
            tagname: "onlinefs-page",
            template: "<div>{{state.context}}</div>",
            state: {
                context: "",
            },
            controller: function() {
                $.page.load("/manager/manager.html", "/manager/manager.js", function(result) {
                    this.setState({
                        context: result
                    })
                }.bind(this));
                // $.http.get("/manager/manager.html", function(result) {
                //     this.setState({
                //         context: result
                //     });
                //     var script = document.createElement("script");
                //     script.src = "/manager/manager.js";
                //     document.body.appendChild(script);
                // }.bind(this), "json", "html");
            }
        }
    })
})();