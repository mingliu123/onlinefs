(function() {
    function getContextLineCount() {
        var height = $.selector(".onlinefs-opentxt-body").clientHeight;
        return Math.ceil(height / 28);
    }

    function setIndex(lineHeight) {
        var html = "";
        for (var i = 0; i < lineHeight; i++) {
            html += "<span>" + (i + 1) + "</span>"
        }
        $.selector(".onlinefs-opentxt-index").innerHTML = html
    }
    window.addEventListener("resize", function() {
        setIndex(0); //将索引变成0，使body 的内容不随索引而改变
        var lineCount = getContextLineCount();
        setIndex(lineCount);
    })
    var lineCount = getContextLineCount();
    setIndex(lineCount);

    function getFileContext(id) {
        $.component.loading.enable();
        $.http.get("/getFileContext?type=txt&id=" + id, function(result) {
            $.selector(".onlinefs-opentxt-body").innerHTML = result;
            setIndex(0); //将索引变成0，使body 的内容不随索引而改变
            var lineCount = getContextLineCount();
            setIndex(lineCount);
        }, "json", "html")
        $.component.loading.disable();
    }
    getFileContext($.queryString.id);
})();