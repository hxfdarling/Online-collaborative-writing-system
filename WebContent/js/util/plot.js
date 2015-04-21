/**
 * Created by hua on 2014/11/15.
 */
define(function (require, exports, module) {
    var $ = require("jquery");
    require("jqplot");
    require("pieRenderer");
    require("donutRenderer");
    require("categoryAxisRenderer");
    require("meterGaugeRenderer");
    require("bubbleRenderer");
    require("dateAxisRenderer");
    require("pointLabels");
    require("barRenderer");
    require("cursor");
    exports.concentration = function concentration(label, name, to, from, callback) {
        if (typeof from == "function") {
            callback = from;
            from = 0;
        }
        from = from ? from : 0;
        var flag = (to - from) > 0;
        var temp = flag ? (to - from) : (from - to);
        var count = temp / 0.4;
        temp = temp / count;
        var s1 = from == 0 ? [ temp ] : [ from ];
        var options = {
            seriesDefaults: {
                renderer: $.jqplot.MeterGaugeRenderer,
                rendererOptions: {
                    min: 0,
                    max: 9,
                    intervals: [ 3, 6, 9 ],
                    intervalColors: [ '#66cc66', '#E7E658', '#cc6666' ],
                    intervalInnerRadius: 0,
                    intervalOuterRadius: 40,
                    ringWidth: 2,
                    label: label,
                    labelPosition: 'bottom',
                    shadowAlpha: 0.2
                }
            }
        };
        var plot = $.jqplot(name, [ s1 ], options);
        var timer = setInterval(function () {
            if (flag) {
                s1[0] += temp;
                if (s1[0] > to) {
                    clearInterval(timer);
                    s1[0] = to;
                    plot.destroy();
                    plot = $.jqplot(name, [ s1 ], options);
                    if (callback && typeof callback == "function") {
                        callback();
                    }
                    return;
                }
            } else {
                s1[0] -= temp;
                if (s1[0] < to) {
                    clearInterval(timer);
                    s1[0] = to;
                    plot.destroy();

                    plot = $.jqplot(name, [ s1 ], options);
                    if (callback && typeof callback == "function") {
                        callback();
                    }
                    return;
                }
            }
            plot.destroy();

            plot = $.jqplot(name, [ s1 ], options);
        }, 16)
    };
    exports.pie = function pie(name, data, title) {
        var plot1 = $.jqplot(name, [ data ], {
            title: title,
            grid: {
                drawBorder: false,
                drawGridlines: true,
                background: '#ffffff',
                shadow: false
            },
            seriesDefaults: {
                shadow: true,
                renderer: $.jqplot.PieRenderer,
                rendererOptions: {
                    sliceMargin: 4,
                    showDataLabels: true
                }
            },
            legend: {
                show: true,
                // rendererOptions: {
                // numberRows: 1
                // },
                location: 'e'
            }

        })
    };
    exports.dote = function dote(data, title, selector, tooltip) {
        var plot2 = $.jqplot(selector, [ data.x ], {
            title: title,
            seriesDefaults: {
                renderer: $.jqplot.BubbleRenderer,
                rendererOptions: {
                    bubbleAlpha: 0.5,
                    highlightAlpha: 0.8,
                    showLabels: false,
                    autoscalePointsFactor: -0.2
                },
                shadow: true,
                shadowAlpha: 0.05
            },
            cursor: {
                show: true,
                zoom: true,
                showTooltip: false
            },
            axes: {
                yaxis: {
                    show: true,
                    ticks: data.y,
                    label: "参与者"
                },
                xaxis: {
                    show: true,
                    label: "时间",
                    renderer: $.jqplot.DateAxisRenderer,
                    tickOptions: {
                        formatString: data.x.length > 5 ? "%H:%M" : "%M:%S"
                    }
                }
            }
        });
        var v = $("#" + selector);
        v.bind('jqplotDataHighlight', function (ev, seriesIndex, pointIndex, data, radius) {
            var chart_left = v.offset().left, chart_top = v
                    .offset().top, x = plot2.axes.xaxis
                    .u2p(data[0]), // convert x axis unita to
            // pixels
                y = plot2.axes.yaxis.u2p(data[1]); // convert y
            // axis units to
            // pixels
            var color = 'rgb(50%,50%,100%)', t = $("#"
                + tooltip);
            var label = $.isPlainObject(data[3]) ? data[3].label
                : data[3];
            var date = new Date(data[0]);
            t.css({
                left: chart_left + x + radius - 35,
                top: chart_top + y + 10,
                position: "absolute",
                background: "gainsboro"
            });
            t.html((date.getMonth() + 1) + "月" + date.getDate()
                + "日" + date.getHours() + ":"
                + date.getMinutes() + ":"
                + date.getSeconds() + ":" + data[3].cmd);
            //
            t.show();
        });
        v.bind('jqplotDataUnhighlight', function (ev, seriesIndex, pointIndex, data) {
            var t = $('#' + tooltip);
            t.empty();
            t.hide();
        });
    };
    exports.focus = function focus(data, title, selector) {
        var plot3 = $.jqplot(selector, data.v, {
            title: title,
            axes: {
                yaxis: {
                    min: 0,
                    max: 100
                },
                xaxis: {
                    show: true,
                    renderer: $.jqplot.DateAxisRenderer,
                    tickOptions: {
                        formatString: "%H:%M"
                    }
                }
            },
            // Series options are specified as an array of objects, one object
            // for each series.
            series: data.l
        });
    };
    exports.padsOrder = function padOrder(data, titleT, titleW, idT, idW) {
        console.log(data);
        $("#" + idT).empty();
        $("#" + idW).empty();
        $.jqplot(idT, data.dataT, {
            title: titleT,
            seriesDefaults: {
                renderer: $.jqplot.BarRenderer,
                rendererOptions: {
//                    barDirection: 'horizontal',
                    fillToZero: true
                }
            },
            series: data.series,
            legend: {
                show: true,
                placement: 'outsideGrid',
                location: "s"
            },
            axes: {
                yaxis: {
                    tickOptions: {formatString: '%d分'}
                },
                xaxis: {
                    renderer: $.jqplot.CategoryAxisRenderer,
                    ticks: data.ticksT
//                    pad: 1.05,
                }
            }
        });
        $.jqplot(idW, data.dataW, {
            title: titleW,
            seriesDefaults: {
                renderer: $.jqplot.BarRenderer,
                rendererOptions: {
//                    barDirection: 'horizontal',
                    fillToZero: true
                }
            },
            series: data.series,
            legend: {
                show: true,
                placement: 'outsideGrid',
                location: "s"
            },
            axes: {
                yaxis: {
                    tickOptions: {formatString: '%d'}
                },
                xaxis: {
                    renderer: $.jqplot.CategoryAxisRenderer,
                    ticks: data.ticksW
//                    pad: 1.05,
                }
            }
        });

    }
});