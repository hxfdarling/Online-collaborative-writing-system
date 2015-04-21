/**
 * Created by hua on 2014/11/2.
 */
define(function (require, exports, module) {
    var $ = require("jquery");
    module.exports = {
        createAuthorIfNotExistsFor: function (name, authorId, callback) {
            this.getJSON(seajs.padDomainApi + "createAuthorIfNotExistsFor",
                {apikey: seajs.apikey, name: name, authorMapper: authorId},
                callback);

        },
        createGroupIfNotExistsFor: function (authorId, callback) {
            this.getJSON(seajs.padDomainApi + "createGroupIfNotExistsFor", {apikey: seajs.apikey, groupMapper: authorId}, callback);
        },
        createGroupPad: function (groupID, padName, text, callback) {
            if (text instanceof Function) {
                callback = text;
                text = "welcome";
            }
            this.getJSON(seajs.padDomainApi + "createGroupPad", {apikey: seajs.apikey, padName: padName, groupID: groupID, text: text}, callback);
        },
        deleteGroup: function (groupID, callback) {
            this.getJSON(seajs.padDomainApi + "deleteGroup", {apikey: seajs.apikey, groupID: groupID}, callback);
        },
        deletePad: function (padID, callback) {
            this.getJSON(seajs.padDomainApi + "deletePad", {apikey: seajs.apikey, padID: padID}, callback);
        },
        createSession: function (groupID, authorID, validUntil, callback) {
            if (validUntil instanceof Function) {
                callback = validUntil;
                validUntil = new Date().getTime() / 1000 + 2 * 60 * 60;
            }
            this.getJSON(seajs.padDomainApi + "createSession", {apikey: seajs.apikey, groupID: groupID, authorID: authorID, validUntil: validUntil}, callback)
        },
        listPads: function (groupID, callback) {
            this.getJSON(seajs.padDomainApi + "listPads", {apikey: seajs.apikey, groupID: groupID}, callback);
        },
        /**
         * 设置cookie
         * @param name
         * @param value
         * @param callback
         */
        setCookie: function (name, value, callback) {
            var data = {};
            data[name] = value;
            this.getJSON("http://" + window.padDomainIP + "/session", data, callback);
        },
        padUsers: function (padID, callback) {
            this.getJSON(seajs.padDomainApi + "padUsers", {apikey: seajs.apikey, "padID": padID}, callback);
        },
        padUsersCount: function (padID, callback) {
            this.getJSON(seajs.padDomainApi + "padUsersCount", {apikey: seajs.apikey, "padID": padID}, callback);
        },
        listAuthorsOfPad: function (padID, callback) {
            this.getJSON(seajs.padDomainApi + "listAuthorsOfPad", {apikey: seajs.apikey, "padID": padID}, callback);
        },
        listAuthorsObjOfPad: function (padID, callback) {
            this.getJSON(seajs.padDomainApi + "listAuthorsObjOfPad", {apikey: seajs.apikey, "padID": padID}, callback);
        },
        setPassword: function (padID, password, callback) {
            this.getJSON(seajs.padDomainApi + "setPassword", {apikey: seajs.apikey, "padID": padID, "password": password}, callback);
        },
        getAllVersions: function (padID, callback) {
            this.getJSON(seajs.padDomainApi + "getAllVersions", {apikey: seajs.apikey, "padID": padID}, callback);
        },
        getVersionsByTime: function (padID, start, end, callback) {
            this.getJSON(seajs.padDomainApi + "getVersionsByTime", {apikey: seajs.apikey, "padID": padID, start: start, end: end}, callback);

        },
        getLastVersionsByUser: function (padID, author, callback) {
            this.getJSON(seajs.padDomainApi + "getLastVersionsByUser", {apikey: seajs.apikey, "padID": padID, "author": author}, callback);

        },
        getReadOnlyID: function (padID, callback) {
            this.getJSON(seajs.padDomainApi + "getReadOnlyID", {apikey: seajs.apikey, "padID": padID}, callback);

        },
        getPadID: function (readOnlyID,callback) {
            this.getJSON(seajs.padDomainApi + "getPadID", {apikey: seajs.apikey, "readOnlyID": readOnlyID}, callback);

        },
        getJSON: function (url, data, callback) {
            $.getJSON(url + "?jsonp=?&", data, function (json) {
                if (callback && callback instanceof Function) {
                    callback.call(json);
                }
            });
        },
        ajax: function (url, data, success, error) {
            $.ajax({
                url: url,
                type: 'post',
                dataType: "json",
                data: data,
                complete: function (xhr) {
                    var json = JSON.parse(xhr.responseText);
                    if (xhr.status == 200) {
                        if (success && success instanceof Function) {
                            success.call(json);
                        }
                    } else {
                        if (error && error instanceof Function) {
                            error.call(json);
                        }
                    }
                }
            });
        }
    }
});