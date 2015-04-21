/**
 * Created by 华 on 2014/8/31.
 */
seajs.config({
//    base: "/WebContent/js",
    base: "/pad/js",
    alias: {
        "jquery": "jquery/jquery-1.8.2",
        "pad": "model/pad",
        "jqplot": "jqplot/jquery.jqplot",
        "pieRenderer": "jqplot/jqplot.pieRenderer",
        "donutRenderer": "jqplot/jqplot.donutRenderer",
        "categoryAxisRenderer": "jqplot/jqplot.categoryAxisRenderer",
        "barRenderer": "jqplot/jqplot.barRenderer",
        "pointLabels": "jqplot/jqplot.pointLabels",
        "meterGaugeRenderer": "jqplot/jqplot.meterGaugeRenderer",
        "handler": "model/handler",
        "bubbleRenderer": "jqplot/jqplot.bubbleRenderer.js",
        "dateAxisRenderer": "jqplot/jqplot.dateAxisRenderer.js",
        "cursor":"jqplot/jqplot.cursor.js"
    },
    paths: {
    },
    vars: {

    },
    map: {

    }
});
window.padDomainIP = "localhost";
window.padDomainBasicURL = "http://" + window.padDomainIP + ":80";
seajs.padDomainApi = window.padDomainBasicURL + "/api/1.2.10/";
seajs.apikey = "8f2f95ba0babc4a151d970b8acfbc00869cf3dce5b5ca6893343303d86049cd8";
