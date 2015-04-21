/**
 * Created by 华 on 2014/8/19. 表单验证
 */
define(function (require, exports, module) {
    var jQuery = require("jquery");
    (function ($) {
        var methods = {
            flag: 0,
            form: null,
            init: function () {
                var form = this;
                methods.form = this;
                methods.flag = $(form).data("flag");
                $(document).on("click", ".formError", function () {
                    if ($(this).attr("class").search(/formError/)) {
                        $(this).fadeOut("fast");
                    }
                });
                methods.attach(form);
            },
            attach: function (form) {
                form.on("blur",
                    "[validate]:not([type=checkbox]):not([type=radio])",
                    methods.onFieldEvent);
                form.on("click",
                    "[validate][type=checkbox],[ validate][type=radio]",
                    methods.onFieldEvent);
            },
            submit: function () {
                var $all = $("[validate]", this);
                methods.form = this;
                methods.flag = $(this).data("flag");
                var flag = true;
                try {
                    for (var i = 0; i < $all.length; i++) {
                        var $field = $all[i];
                        if (!methods.validate($($field))) {
                            flag = false;
                        }
                    }
                } catch (e) {
                }
                if (methods.flag > 0) {
                    return false;
                }
                return flag;
            },
            required: function ($field) {
                try {
                    var value = $field.val().replace(" ", "");
                    if (value == '') {
                        methods.show($field, "必须填写值");
                        return false;
                    } else {
                        methods.hide($field);
                    }
                } catch (e) {
                }
                return true;
            },
            minLength: function ($field, minLength) {
                try {
                    var num = parseInt(minLength);
                    if ($field.val().length < num) {
                        methods.show($field, "最小长度为:" + num);
                        return false;
                    } else {
                        methods.hide($field);
                        return true;
                    }
                } catch (e) {

                }
            },
            ajax: function ($field, url) {
                var data = {};
                data[$field.attr("name")] = $field.val();
                if ($field.data("value") != $field.val()) {
                    $field.data("value", $field.val());
                    methods.show($field, "正在验证，稍后", "load");
                    $.ajax({
                        url: url,
                        type: 'post',
                        data: data,
                        complete: function (XMLHttpRequest, textStatus) {
                            if (XMLHttpRequest.status == 200) {
                                var message = $field.attr("message").split(",");
                                console.log(message);
                                if (XMLHttpRequest.responseText == "true") {
                                    methods.show($field, message[0] || "数据验证通过",
                                        "pass");

                                    if (methods.flag > 0) {
                                        methods.flag--;
                                        $(methods.form).data("flag", methods.flag);
                                    }
                                } else {
                                    methods
                                        .show($field, message[1]
                                            || "数据不可用，重新输入");
                                    methods.flag++;
                                    $(methods.form).data("flag", methods.flag);
                                }
                            }
                        }
                    });
                }
                return true;
            },
            maxLength: function ($field, maxLength) {
                try {
                    var num = parseInt(maxLength);
                    if ($field.val().length > num) {
                        methods.show($field, "最大长度为:" + num);
                        return false;
                    } else {
                        methods.hide($field);
                        return true;
                    }
                } catch (e) {

                }
            },
            number: function ($field) {
                var value = $field.val();
                if (value && /\D/.test(value)) {
                    methods.show($field, "请输入数字!");
                    return false;
                } else {
                    methods.hide($field);
                }
                return true;
            },
            email: function ($field) {
                var reg = /^[a-zA-Z][\w|_|\d|\.]{0,}@[\w\\d]+\.[\w|\d|\.]+$/;
                if (!reg.test($field.val())) {
                    methods.show($field, "电子邮箱格式错误");
                    return false;
                } else {
                    methods.hide($field);
                }
                return true;
            },
            date: function ($field) {
                var value;
                try {
                    value = $field.val();
                    if (value) {
                        console.log(value);
                        var reg = /^[\d]{4}-[\d]{2}-[\d]{2}$/;
                        if (!reg.test(value.trim())) {
                            console.log("时间格式错误");
                            methods.show($field, "时间格式错误");
                            return false;
                        } else {
                            methods.hide($field);
                        }
                    } else {
                        methods.hide($field);
                    }
                    return true;
                } catch (e) {
                    throw new Error("时间验证错误");
                }
            },
            validate: function ($field) {
                var $validate = $field.attr("validate").split(",");
                for (var i = 0, len = $validate.length; i < len; i++) {
                    var temp = $validate[i].split(/:/);
                    if (temp.length > 1) {
                        switch (temp[0]) {
                            case "minLength":
                                if (!methods.minLength($field, temp[1])) {
                                    return false;
                                }
                                break;
                            case "maxLength":
                                if (!methods.maxLength($field, temp[1])) {
                                    return false;
                                }
                                break;
                            case "ajax":
                                if (!methods.ajax($field, temp[1])) {
                                    return false;
                                }
                                break;
                        }
                    } else {
                        switch (temp[0]) {
                            case "required":
                                if (!methods.required($field)) {
                                    return false;
                                }
                                break;
                            case "email":
                                if (!methods.email($field)) {
                                    return false;
                                }
                                break;
                            case "number":
                                if (!methods.number($field)) {
                                    return false;
                                }
                                break;
                            case "date":
                                if (!methods.date($field)) {
                                    return false;
                                }
                                break;
                        }
                    }
                }
                return true;
            },
            onFieldEvent: function () {
                var $field = $(this);
                methods.validate($field);

            },
            buildPrompt: function (field, promptText, type, ajaxed) {
                var prompt = $('<div>');
                prompt.addClass(methods.getClassName(field.attr("id"))
                    + "formError");
                prompt.addClass("formError");
                switch (type) {
                    case "pass":
                        prompt.addClass("greenPopup");
                        break;
                    case "load":
                        prompt.addClass("blackPopup");
                        break;
                    default:
                }
                if (ajaxed)
                    prompt.addClass("ajaxed");
                $('<div>').addClass("formErrorContent").html(promptText).appendTo(
                    prompt);
                var positionType = field.attr("positionType") || "topRight";
                var arrow = $('<div>').addClass("formErrorArrow");
                switch (positionType) {
                    case "bottomLeft":
                    case "bottomRight":
                        prompt.find(".formErrorContent").before(arrow);
                        arrow
                            .addClass("formErrorArrowBottom")
                            .html(
                            '<div class="line1"><!-- --></div><div class="line2"><!-- --></div><div class="line3"><!-- --></div><div class="line4"><!-- --></div><div class="line5"><!-- --></div><div class="line6"><!-- --></div><div class="line7"><!-- --></div><div class="line8"><!-- --></div><div class="line9"><!-- --></div><div class="line10"><!-- --></div>');
                        break;
                    case "topLeft":
                    case "topRight":
                        arrow
                            .html('<div class="line10"><!-- --></div><div class="line9"><!-- --></div><div class="line8"><!-- --></div><div class="line7"><!-- --></div><div class="line6"><!-- --></div><div class="line5"><!-- --></div><div class="line4"><!-- --></div><div class="line3"><!-- --></div><div class="line2"><!-- --></div><div class="line1"><!-- --></div>');
                        prompt.append(arrow);
                        break;
                }
                prompt.css({
                    "opacity": 0
                });
                field.before(prompt);
                var pos = methods.getPosition(field, prompt);
                prompt.css({
                    'position': 'absolute',
                    "top": pos.topPosition,
                    "left": pos.leftPosition,
                    "marginTop": pos.marginTopSize,
                    "opacity": 0
                }).data("callerField", field);
                return prompt.animate({
                    "opacity": 0.87
                });
            },
            getPosition: function (field, promptElmt) {
                var promptTopPosition, promptleftPosition, marginTopSize;
                var fieldWidth = field.width();
                var fieldLeft = field.position().left;
                var fieldTop = field.position().top;
                var fieldHeight = field.height();
                var promptHeight = promptElmt.height();
                promptTopPosition = promptleftPosition = 0;
                marginTopSize = -promptHeight;
                var positionType = field.attr("positionType") || "topRight";
                switch (positionType) {
                    default:
                    case "topRight":
                        promptleftPosition += fieldLeft + fieldWidth - 27;
                        promptTopPosition += fieldTop;
                        break;
                    case "topLeft":
                        promptTopPosition += fieldTop;
                        promptleftPosition += fieldLeft;
                        break;

                    case "bottomLeft":
                        promptTopPosition = fieldTop + field.height() + 5;
                        marginTopSize = 0;
                        promptleftPosition = fieldLeft;
                        break;
                    case "bottomRight":
                        promptleftPosition = fieldLeft + fieldWidth - 27;
                        promptTopPosition = fieldTop + field.height() + 5;
                        marginTopSize = 0;
                        break;
                }
                return {
                    "topPosition": promptTopPosition + "px",
                    "leftPosition": promptleftPosition + "px",
                    "marginTopSize": marginTopSize + "px"
                };
            },
            getClassName: function (classname) {
                if (classname)
                    return classname.replace(/:/g).replace(/\./g);
                else {
                    return "validate";
                }
            },
            hide: function ($field) {
                var prompt = $field.prev("."
                    + methods.getClassName($field.attr("id")) + "formError");
                if (prompt) {
                    prompt.fadeOut("fast");
                }
            },
            show: function ($field, promptText, type, ajax) {
                if (!$field.data("prompted")) {
                    methods.buildPrompt($field, promptText, type, ajax);
                    $field.data("prompted", true);
                } else {
                    var prompt = $field
                        .prev("." + methods.getClassName($field.attr("id"))
                            + "formError");
                    prompt.removeClass("greenPopup");
                    prompt.removeClass("blackPopup");
                    switch (type) {
                        case "pass":
                            prompt.addClass("greenPopup");
                            break;
                        case "load":
                            prompt.addClass("blackPopup");
                            break;
                        default:
                    }
                    if (promptText) {
                        $(".formErrorContent", prompt).html(promptText);
                    }
                    prompt.fadeIn("fast");
                }

            }
        }
        $.fn.validForm = function (method) {
            var form = $(this);
            if (!form[0]) {
                return;
            }
            if (method) {
                switch (method) {
                    case "submit":
                        return methods.submit.apply(form);
                        break;
                }
            } else {
                methods.init.apply(form);
            }
        }
    })(jQuery);
})
