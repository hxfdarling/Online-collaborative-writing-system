/**
 * Created by hua on 2014/10/29.
 */
define(function (require, exports, module) {
    var jQuery = require("jquery");
    (function ($) {
        var methods = {
            init: function () {
                var data = this.data("data"), columns = data.columns, tr, td, i, len = columns.length;
                tr = "<tr class='table-header'>";
                for (i = 0; i < len; i++) {
                    if (columns[i].hidden)continue;
                    tr += "<td>" + columns[i].title + "</td>";
                }
                tr += "</tr>";
                tr = $(tr);
                tr.appendTo(this);
                methods.load.apply(this);
            },
            load: function () {
                var data = this.data("data"), columns = data.columns, tr, td, i, j, len = columns.length, list = this;
                methods.removeAll.call(this);
                if (data.url) {
                    $.getJSON(data.url, {}, _load);
                }
                else if (data.rows) {
                    _load(data.rows);
                }
                function _load(json) {
                    var rows = json.rows;
                    if (rows.length > 0) {
                        list.data("rows", rows);
                        for (j = 0; j < rows.length; j++) {
                            tr = "<tr>";
                            for (i = 0; i < len; i++) {
                                if (columns[i].hidden)continue;
                                tr += "<td>" + rows[j][columns[i].field] + "</td>";
                            }
                            tr += "</tr>";
                            tr = $(tr);
                            tr.attr("index", j);
                            tr.appendTo(list);
                        }
                        $("tr:odd", list).addClass("odd");
                        $("tr:even", list).addClass("even")
                        $("tr:eq(0)", list).removeClass("odd").removeClass("even").addClass("over");
                        $("tr:gt(0)", list).on("click", function () {
                            $("tr", list).removeClass("selected");
                            var tr = $(this).addClass("selected");
                            if (data.onSelect) {
                                data.onSelect.call(list, rows, tr.attr("index"), tr);
                            }
                        })
                    }
                }
            },

            add: function () {

            },
            update: function () {

            },
            removeAll: function () {
                $("tr:gt(0)", this).remove();
            },
            remove: function (callback) {
                var data = this.data("data"), columns = data.columns, tr, index, i, j, len = columns.length, list = this;
                tr = $("tr.selected", list);
                if (tr.length == 0) {
                    alert("没有选择任何数据");
                    return;
                }
                index = tr.attr("index");
                if (callback instanceof  Function) {
                    callback.call(tr, list.data("rows"), index);
                }
                tr.remove();
            }
        }
        $.fn.list = function (method, data) {
            var list = $(this);
            if (typeof method == "object") {
                data = method;
                method = "init";
            }
            method = method || "init";
            switch (method) {
                case "init":
                    list.data("data", data);
                    methods.init.apply(list);
                    break;
                case "remove":
                    methods.remove.call(list, data);
                    break;
                case "reload":
                    if (data) {
                        var t = list.data("data");
                        t.rows = data;
                        list.data("data", t);
                    }
                    methods.load.call(list);
                    break;
                case "clear":
                    break;
                case "update":
                    break;
            }
        }
    })(jQuery);

});