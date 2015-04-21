/**
 * Created by hua on 2014/11/13.
 */
define(function (require, exports, module) {
    var $ = require("jquery");
    var canvas = {
            canvasCreate: function createCanvas(width, height) {
                return $("<canvas></canvas>").css({"width": width || 200, "height": height || 200, border: "1px solid gray"}).appendTo(this);
            },
            canvasDrawColh: function drawColh(width, height) {
                var canvas = this.get(0);
                this.data("area", {width: width, height: height});
                if (canvas == null)
                    return null;
                var context = canvas.getContext('2d');
                var g = context.createLinearGradient(0, 0, 0, height);
                g.addColorStop(0, 'rgb(255,0,0)'); //红
                g.addColorStop(0.5, 'rgb(0,255,0)');//绿
                g.addColorStop(1, 'rgb(0,0,255)'); //蓝
                context.fillStyle = g;
                context.fillRect(0, 0, width, height);
                context.clearRect(0, 150, 50, 50);
                return this;
            },
            canvasClearHeight: function clearHeight(height) {
                var area = this.data("area");
                var canvas = this.get(0);
                if (canvas == null)return null;
                var context = canvas.getContext("2d");
                context.clearRect(0, 0, area.width, height);
                return this;
            },
            canvasDown: function canvasUP(from, to, time) {
                if (from > to)return this;
                var _this = this;
                var canvasClearHeight = this.canvasClearHeight;
                canvasClearHeight.call(_this, from);
                var count = time / 17 || 1, arg, temp;
                temp = (to - from) / count;
                arg = from;
                var timer = setInterval(function () {

                    canvasClearHeight.call(_this, arg);
                    count--;
                    if (count <= 0) {
                        clearInterval(timer);
                        canvasClearHeight.call(_this, to);
                    }
                    arg += temp;
                }, 17);
            },
            canvasUp: function canvasDown(from, to, time) {
                if (to > from)return this;
                var _this = this;
                var canvasClearHeight = this.canvasClearHeight;
                var canvasDrawColh = this.canvasDrawColh;
                var area = this.data("area");
                canvasClearHeight.call(_this, from);
                var count = time / 17 || 1, arg, temp;
                temp = (from - to) / count;
                arg = from;
                var timer = setInterval(function () {
                    canvasDrawColh.call(_this, area.width, area.height);
                    canvasClearHeight.call(_this, arg);
                    count--;
                    if (count <= 0) {
                        clearInterval(timer);
                        canvasDrawColh.call(_this, area.width, area.height);
                        canvasClearHeight.call(_this, to);
                    }
                    arg -= temp;
                }, 17);
            },
            canvasAnimation: function animation(time, callback) {
                var _this = this;
                callback = this[callback];
                this.data("time", time);
                var arg = [].slice.call(arguments, 2);
                var count = time / 17 || 1;
                var temp = arg = arg.map(function (value) {
                    return value / count;
                });
                var i = 1;
                var timer = setInterval(function () {
                    callback.apply(_this, arg);
                    count--;
                    i++;
                    if (count <= 0) {
                        clearInterval(timer);
                    }
                    arg = temp.map(function (value) {
                        return value * i;
                    });
                }, 17);
            }
        }
        ;
    $.fn.extend(canvas);
})
;