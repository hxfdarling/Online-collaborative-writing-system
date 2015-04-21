/**
 * Created by hua on 2014/11/18.
 */
define(function (require, explore, module) {
        var _focus = [
            {p: 100, t: 0.5},
            {p: 95, t: 3},
            {p: 90, t: 6},
            {p: 85, t: 10},
            {p: 80, t: 15},
            {p: 75, t: 21},
            {p: 70, t: 38},
            {p: 65, t: 35},
            {p: 60, t: 42},
            {p: 55, t: 50},
            {p: 50, t: 58},
            {p: 45, t: 66},
            {p: 40, t: 75},
            {p: 35, t: 85},
            {p: 30, t: 96},
            {p: 25, t: 108},
            {p: 20, t: 121},
            {p: 15, t: 135},
            {p: 10, t: 150},
            {p: 5, t: 165},
            {p: 3, t: 180},
            {p: 0, t: 200}
        ];
        var $ = require("jquery");
        require("util/chat");//加载chat插件哦
        var pad = require("pad");
        var guid = 1, usersFocus = {};
        var plot = require("util/plot");
        var api = require("model/api");
        explore.intervalTime = 300;

        explore.getBaseFocus = function getBaseFocus(time) {
            var i = _focus.length - 1;
            if (time > _focus[i].t) {
                return 0;
            }
            for (; i > 0; i--) {
                if (time <= _focus[i].t && time > _focus[i - 1].t) {
                    return _focus[i - 1].p;
                }
            }
            return 100;
        };
        /***
         * 计算专注度的算法
         * @param versions
         * @returns {*}
         */
        explore.getFocusValue = function getFocusValue(versions) {
            if (!versions || versions.length < 2)return 0;
            var i, temp, n = new Date();
            i = versions.length - 1;
            // temp = (n.getTime() - versions[0].timestamp) / 1000;
            temp = explore.intervalTime;
            temp = ( (i + 1) / temp) * 150;
//        n = _focus.length;
//        for (i = 0; i < n - 1; i++) {
//            if (temp > _focus[i] && temp <= _focus[i + 1]) {
//                return n - 2 - i;
//            }
//            if (i == 0 && temp <= _focus[0]) {
//                return n - 1;
//            }
            return parseInt(temp > 100 ? 100 : temp < 0 ? 0 : temp);
        };
        explore.getVersionsByAuthorId = function getVersionsByAuthorId(versions, authorId) {
            var i, result = [], n;
            n = versions.length;
            for (i = 0; i < n; i++) {
                if (versions[i].author === authorId) {
                    result.push(versions[i]);
                }
            }
            return result;
        };

        explore.getVersionsByTime = function getVersionsByTime(versions, start, end) {
            var i, result = [], n;
            n = versions.length;
            for (i = n - 1; i >= 0; i--) {
                if (versions[i].timestamp >= start && (!end || versions[i] < end)) {
                    result.unshift(versions[i]);
                } else {
                    break;
                }
            }
            return result;
        };
        explore.getVersionsByCount = function getVersionsByCount(versions, count) {
            var i, result = [], n;
            n = versions.length - count;
            n = n >= 0 ? n : 0;
            result = versions.slice(n);
            return result;
        };
        explore.addFocusChart = function addFocusChart($div, title, data, width, height) {
            var id = guid++;
            $("<div class='speed-title'></div>").text(title).appendTo($div);
            var t = $("<div></div>").attr("id", id).addClass("speed").appendTo($div);
            t.createSpeed({value: data});
            return id;
        };
        explore.updateConcentration = function updateConcentration(title, id, data) {
        };
        /***
         * 新版专注度处理函数，通过比较前一个时间的时间间隔
         * @param $div
         * @param versions
         */
        explore.addAllFocusChart2 = function addAllFocusChart2($div, versions) {
            var temp, curTime = new Date().getTime();
            $.each(versions, function (i, n) {
                temp = curTime - n.timestamp;
                temp /= 1000;
                temp = explore.getBaseFocus(temp);
                if (usersFocus[n.author.id]) {
                    $("#" + usersFocus[n.author.id].chartName).speedChangeValue(temp);
                } else {
                    usersFocus[n.author.id] = {
                        name: n.author.name,
                        chartName: explore.addFocusChart($div, n.author.name + "的专注度", temp)
                    }
                }
            });
        };
        /***
         * 通过一段时间中的版本号数量计算专注度
         * @param $div
         * @param versions
         * @param users
         */
        explore.addAllFocusChart = function addAllFocusChart($div, versions, users) {
            var temp;
//        versions = explore.getVersionsByTime(versions, new Date().getTime() - 10 * 60 * 1000);
            $.each(users, function (i, n) {
                if (versions && versions.length != 0) {
                    temp = explore.getVersionsByAuthorId(versions, n.id);
                    temp = explore.getFocusValue(temp);
                } else {
                    temp = 0;
                }
                if (usersFocus[n.id]) {
                    $("#" + usersFocus[n.id].chartName).speedChangeValue(temp);
                } else {
                    usersFocus[n.id] = {
                        name: n.name,
                        chartName: explore.addFocusChart($div, n.name + "的专注度", temp)
                    }
                }

            });
        };
        /***
         * 通过版本号数量计算每个人的专注的度
         * @param id
         * @param versions
         * @param users
         */
        explore.addContributionByVersions = function addContributionByVersions(id, versions, users) {
            var temp, v = [];
            $.each(users, function (i, n) {
                if (versions && versions.length != 0) {
                    temp = explore.getVersionsByAuthorId(versions, n.id);
                    v.push([n.name, temp.length])
                }
            });
            plot.pie(id, v, "按版本号的贡献占比");
        }
        /***
         *获取时间
         * @param versions
         * @returns {number}
         */
        explore.getTimeByVersions = function getTimeByVersions(versions) {
            var time = 0, i, t;
            for (i = 0; i < versions.length - 1; i++) {
                t = versions[i + 1].timestamp - versions[i].timestamp;
                t /= 1000;
                time += t * explore.getBaseFocus(t) / 100;
            }
            return time;
        };
        /***
         * 通过时间计算每个人的专注的度
         * @param id
         * @param versions
         * @param users
         */
        explore.addContributionByTime = function addContributionByTime(id, versions, users) {
            var temp, v = [];
            $.each(users, function (i, n) {
                if (versions && versions.length != 0) {
                    temp = explore.getVersionsByAuthorId(versions, n.id);
                    v.push([n.name, explore.getTimeByVersions(temp)]);
                }
            });
            plot.pie(id, v, "按参与时间的贡献占比");
        };
        /***
         * 拉取服务器的pad排行数据
         * @param id
         * @param versions
         * @param users
         */
        explore.getPadsWordAndTimeValue = function getPadsTimeValue(idT, idW, versions, users, gid, gname, pname) {
            var temp, w = 0, t = 0;
            $.each(users, function (i, n) {
                if (versions && versions.length != 0) {
                    temp = explore.getVersionsByAuthorId(versions, n.id);
                    t += explore.getTimeByVersions(temp);
//                    w += explore.getTextCountByAuthorId(versions, n.id);
                }
            });
            w = versions[versions.length - 1]["sumCount"] || 0;
            api.updatePadAndGroupValue(
                {
                    "timeValue": Math.round(t),
                    "wordValue": Math.round(w),
                    "pad.gid": gid,
                    "pad.gname": gname,
                    "pad.pname": pname
                }, function (json) {
                    console.log(json);
                    if (json.code == 3) {
                        $("#" + id).empty();
                        return;
                    }
                    var t = json.data, temp, series = [], ticksT = ["时间(分)"], ticksW = ["字数(个)"];
                    var dataT = [], dataW = [], bt, bw;
                    for (var i = 0; i < t.length; i++) {
                        if (t[i].status == -1) {
                            bt = t[i].timeValue;
                            bw = t[i].wordValue;
                            break;
                        }
                    }
                    for (var i = 0; i < t.length; i++) {
                        dataT.push([t[i].timeValue / 60]);
                        dataW.push([t[i].wordValue]);
                        switch (t[i].status) {
                            case -1:
                                temp = "最高值(" + t[i].gname + "小组)";
                                break;
                            case -2:
                                temp = "本组值";
                                break;
                            default :
                                temp = "平均值";
                                break;
                        }
                        series.push({label: temp});
                    }
                    plot.padsOrder({dataT: dataT, dataW: dataW, ticksW: ticksW, ticksT: ticksT, series: series}, "小组动态时间信息", "小组动态字数信息", idT, idW);
                });
        };

        /***
         * 获取字数
         * @param versions
         * @param authorId
         * @returns {Number}
         */
        explore.getTextCountByAuthorId = function getTextCountByAuthorId(versions, authorId) {
            var i, result = 0, n;
            n = versions.length;
            for (i = 0; i < n; i++) {
                if (versions[i].author === authorId) {
                    result += versions[i].textCount;
                }
            }
            return result;
        };


        /***
         * 通过字数计算每个人的专注的度
         * @param id
         * @param versions
         * @param users
         */
        explore.addContributionByText = function addContributionByText(id, versions, users) {
            var temp, v = [];
            $.each(users, function (i, n) {
                if (versions && versions.length != 0) {
                    v.push([n.name, explore.getTextCountByAuthorId(versions, n.id)]);
                }
            });
            plot.pie(id, v, "按字数的贡献占比");
        };
        var versionsIntervalTime = 600 * 1000;
        var addColor = "#00ff00", removeColor = "#ff0000", replaceColor = "#0000ff";
        explore.getAddByVersions = function getAddByVersions(versions) {
            var t = [];
            $.each(versions, function (i, n) {
                if (n.cmd == "add") {
                    t.push(n);
                }
            });
            return t;
        };
        explore.getRemoveVersions = function getRemoveByVersions(versions) {
            var t = [];
            $.each(versions, function (i, n) {
                if (n.cmd == "remove") {
                    t.push(n);
                }
            });
            return t;
        }
        explore.getReplaceVersions = function getReplaceVersions(versions) {
            var t = [];
            $.each(versions, function (i, n) {
                if (n.cmd == "replace") {
                    t.push(n);
                }
            });
            return t;
        };
        explore.getActionByVersions = function getActionByVersions(users, versions) {
            if (!versions || !versions.length)return [];
            var temp, x = [], sv = versions[0], add , remove, replace, y = [
                [0, ""]
            ], a = 0;
            $.each(users, function (i, n) {
                if (versions && versions.length != 0) {
                    temp = explore.getVersionsByAuthorId(versions, n.id);
                    add = explore.getAddByVersions(temp);
                    remove = explore.getRemoveVersions(temp);
                    replace = explore.getReplaceVersions(temp);
                    add = fn3(n, add, i + 1, addColor, "添加");
                    remove = fn3(n, remove, i + 1, removeColor, "删除");
                    replace = fn3(n, replace, i + 1, replaceColor, "替换");
                    x = x.concat(add);
                    x = x.concat(remove);
                    x = x.concat(replace);
                    y.push([i + 1, n.name]);
                    a = i + 1;
                }
            });
            y.push([a + 1, ""]);
            function fn(a, v, index, color, cmd) {
                var t = sv.timestamp, d = 0, c = 0, r = [];
                for (var i = 0; i < v.length; i++) {
                    if (v[i].timestamp <= t) {
                        d += v[i].timestamp;
                        c++;
                    } else {
                        t += versionsIntervalTime;
                        d = Math.round(c ? d / c : t);
                        c ? r.push([d, index, c , {label: a.name + "的" + cmd, color: color}]) : "";
                        d = c = 0;
                        i--;
                    }
                }
                t += versionsIntervalTime;
                d = Math.round(c ? d / c : t);
                c ? r.push([d, index, c  , {label: a.name + "的" + cmd, color: color}]) : "";

                return r;
            }

            function fn2(a, v, index, color, cmd) {
                var r = [], t = _focus[0].t * 1000, c = 1, m = 0;
                if (v.length > 1) {
                    for (var i = 1; i < v.length - 1; i++) {
                        if (v[i + 1].timestamp - v[i].timestamp > t && m > 50) {
                            c = 1;
                            m = 0;
                        } else {
                            m++;
                            c = 1;
                        }
                        r.push([v[i].timestamp, index, c, {label: a.name + "的" + cmd, color: color}]);
                    }
                } else if (v) {
                    r.push([v[0].timestamp, index, c, {label: a.name + "的" + cmd, color: color}]);
                }
                return r;
            }

            function fn3(a, v, index, color, cmd, shape) {
                var r = [], t = _focus[0].t * 1000, c = 1;
                for (var i = 1; i < v.length - 1; i++) {
                    r.push([v[i].timestamp, index, c, {name: a.name, cmd: cmd, label: a.name + "的" + cmd, color: color, shape: shape}]);
                }

                return r;
            }

            return {x: x, y: y};
        };

        explore.action = function action(data, selector, tooltip) {
            var data = explore.getActionByVersions(data.users, data.versions);
            console.log(data);
            plot.dote(data, "行为点状图", selector, tooltip);
        };

        explore.report_focus = function report_focus(users, versions, selector) {
            var temp, a = [], b = [], time = 10 * 60 * 1000;
            $.each(users, function (i, n) {
                if (versions && versions.length != 0) {
                    temp = explore.getVersionsByAuthorId(versions, n.id);
                    temp = fn(temp);
                    if (temp.length > 0) {
                        a.push(temp);
                        b.push({name: n.name, lineWidth: 1, showLine: true, showMarker: false});
                    }
                }
            });
            function fn(v) {
                var r = [], t;
                if (v.length > 1) {
                    for (var i = 1; i < v.length; i++) {
                        t = v[i].timestamp - v[i - 1].timestamp;
                        r.push([v[i].timestamp - Math.round(t / 2), explore.getBaseFocus((t) / 1000)]);
                    }
                }
                return r;
            }

            function fn2(v) {
                var r = [], t, a = 0, b = 0;
                for (var i = 0; i < v.length; i++) {

                }
                return r;
            }

            console.log(a);
            plot.focus({v: a, l: b}, "专注度图", selector);

        };
        explore.test = function test(selector) {
//            plot.focus([], "test", selector);
        }
    }
)
;