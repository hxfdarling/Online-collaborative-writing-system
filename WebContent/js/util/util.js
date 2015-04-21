/**
 * Created by hua on 2014/10/29.
 */
define(function (require, exports, module) {
    //添加cookie
    function addCookie(name, value, expires, path, domain) {
        var str = name + "=" + escape(value);
        if (expires != "") {
            var date = new Date();
            date.setTime(date.getTime() + expires * 24 * 3600 * 1000);//expires单位为天
            str += ";expires=" + date.toGMTString();
        }
        if (path != "") {
            str += ";path=" + path;//指定可访问cookie的目录
        }
        if (domain != "") {
            str += ";domain=" + domain;//指定可访问cookie的域
        }
        document.cookie = str;
    }

    var jquery = require("jquery");
    var pad = require("pad");
    (function ($) {
        var methods = {
            body: $("body"),
            _show: function () {
                $(this).show();
                $(".gray-background").show();
            },
            _hidden: function () {
                $(".gray-background").hide();
                $(this).hide();
            },
            _grayBackground: function () {
                var gb = $("<div>");
                gb.addClass("gray-background");
                gb.appendTo(methods.body);
            },
            _drag: function (event) {
                var panel = this;
                var left = (window.scrollX
                    || document.body.scrollLeft)
                    + event.clientX - panel.width() / 2;
                var top = (window.scrollY
                    || document.body.scrollTop) - 10
                    + event.clientY;
                if (left < (window.innerWidth || document.body.clientWidth) - 60 && top < (window.innerHeight || document.body.clientHeight) - 50 && top > 0 && left > -50) {
                    panel.css({"left": left, "top": top});
                }

            },
            _init: function (data_option) {
                methods._grayBackground();
                return methods._dialog(data_option);
            },
            _message: function (content) {
                var panel = this;
                var data_option = this.data("data_option");
                content.html("<p>" + (data_option.message || " ") + "</p>");
                var ok = $("<a class='btn theme-background-color '>确定</a>").click(function (event) {
                    event.stopPropagation();
                    methods._hidden.call(panel);
                });
                var bar = $("<div>").addClass("tool-bar").append(ok).appendTo(content);
            },
            _self: function (content) {
                var panel = this;
                var data_option = this.data("data_option");
                if (data_option.content) {
                    var height = content.height() - 40;
                    var div = $("<div></div>").css({"height": height});
                    $(data_option.content).appendTo(div);
                    div.appendTo(content);
                }

                if (data_option.btn) {
                    var bar = $("<div>").addClass("tool-bar");
                    if (data_option.btn.ok) {
                        var ok = $("<a class='btn theme-background-color '>确定</a>").click(function (event) {
                            event.stopPropagation();
                            var flag;
                            if (data_option.btn.ok instanceof Function) {
                                flag = data_option.btn.ok.call(panel);
                            }
                            if (flag)
                                methods._hidden.call(panel);
                        });
                        bar.append(ok)
                    }
                    if (data_option.btn.cancel) {
                        var cancel = $("<a class='btn theme-background-color '>取消</a>").click(function (event) {
                            event.stopPropagation();
                            if (data_option.btn.cancel instanceof Function) {
                                data_option.btn.cancel.call(panel);
                            }
                            methods._hidden.call(panel);
                        });
                        bar.append(cancel)
                    }
                    bar.appendTo(content);
                }
            },
            _input: function (content) {
                var panel = this;
                var data_option = this.data("data_option");
                var height = content.height() / 2 - 33;
                content.html("<input class='ip' type='text' style='width: 80%;height: 26px;line-height: 26px;display: block;margin: 0 auto;margin-top:" + height + "px;'>");
                var ok = $("<a class='btn theme-background-color '>确定</a>").click(function (event) {
                    event.stopPropagation();
                    var input = $(".ip", panel);
                    var text = input.val();
                    input.val("");
                    if (data_option.getValue instanceof Function) {
                        data_option.getValue(text);
                    }
                    methods._hidden.call(panel);
                });
                var bar = $("<div>").addClass("tool-bar").append(ok).appendTo(content);
            },
            _dialog: function (data_option) {
                var panel = $("<div>");
                panel.addClass("panel them-border-color");
                panel.data("data_option", data_option);
                data_option.title = data_option.title || "提示";
                var div = $("<div>").addClass("msg_head theme-background-color ").append("<div class='title theme-background-color'>" + data_option.title + "</div>").append("<div class='close'>关闭</div>");
                div.appendTo(panel);
                var content = $("<div>");
                content.addClass("content");
                if (data_option.width) {
                    panel.css({"width": data_option.width});
                    content.css({"width": data_option.width});
                }
                if (data_option.height) {
                    content.css({"height": (data_option.height - 26)});
                    panel.css({"height": data_option.height});
                }
                var left = (window.scrollX
                    || document.body.scrollLeft)
                    + (window.innerWidth || document.body.clientWidth) / 2 - panel.width() / 2;
                var top = (window.scrollY
                    || document.body.scrollTop)
                    + (window.innerHeight || document.body.clientHeight) / 2 - panel.height() / 2;
                panel.css({"left": left, "top": top});
                $(".close", panel).on("click", function (event) {
                    event.stopPropagation();
                    methods._hidden.call(panel);
                });
                $(".msg_head", panel).on("mousedown", function () {
                    panel.data("drag", true);
                });
                $("body").on("mouseup", function () {
                    panel.data("drag", false);
                }).on("mousemove", function (event) {
                    var drag = panel.data("drag");
                    if (drag) {
                        methods._drag.call(panel, event);
                    }
                });
                switch (data_option.type) {
                    default :
                    case "message":
                        methods._message.call(panel, content);
                        break;
                    case "input":
                        methods._input.call(panel, content);
                        break;
                    case "self":
                        methods._self.call(panel, content);
                        break;
                }
                content.appendTo(panel);
                panel.appendTo(methods.body);
                if (data_option.callback && (data_option.callback instanceof Function)) {
                    data_option.callback.call(panel);
                }
                return panel;
            }
        }
        $.dialog = $.fn.dialog = function (method, data_option) {
            if (typeof method !== "string") {
                data_option = method;
                method = "init";
            }
            method = method || "init";
            switch (method) {
                case "init":
                    return   methods._init(data_option);
                case "show":
                    methods._show.call(this);
                    break;
            }
        }
        $.getSystemInfo = function (callback) {
            if ($.systemInfo) {
                callback($.systemInfo);
            } else {
                pad.ajax("getSystemInfo", {}, function () {
                    $.systemInfo = this;
                    callback(this);
                });
            }
        }
    })(jquery);
});