/**
 * Created by 华 on 2015/3/3.
 */
define(function (require, exports, module) {
    var $ = require("jquery");
    var chat = {
        createSpeed: function (obj) {
            this.addClass("speed");
            obj = obj || {};
            obj.width = obj.width || 200;
            var a = $("<div class='a'></div>").css({"width": obj.width}).appendTo(this);
            var b = $("<div class='b'></div>").css({"width": 0}).appendTo(this);
            var c = $("<div class='c'></div>").css({"width": obj.width}).appendTo(this);
            c.text("0%");
            this.data("param", obj);
            var t = obj.value;
            obj.value = 0;
            this.speedChangeValue(t);
        },
        speedChangeValue: function (value) {
            var obj = this.data("param");
            obj.ovalue = obj.t || obj.value;
            obj.value = value;
            var b = this.find(".b"),
                c = this.find(".c"),
                f = (obj.ovalue < value), t = obj.ovalue;
            if (obj.st != 0) {
                clearInterval(obj.st);
                obj.st = 0;
            }
            var st = setInterval(function () {
                if (t === obj.value) {
                    clearInterval(st);
                    obj.st = 0;
                    return;
                }
                if (f) {
                    t++;
                } else {
                    t--;
                }
                obj.t = t;
                value = obj.width / 100 * t;
                value = Math.round(value);
                b.css({"width": value});
                c.text(t + "%");
            }, 100);
            obj.st = st;
        }
    };
    $.fn.extend(chat);
});