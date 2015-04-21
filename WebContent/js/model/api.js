/**
 * Created by hua on 2014/11/4.
 */
define(function (require, exports, module) {
    var $ = require("jquery");
    module.exports = {
        getUsers: function (groupId, success, error) {
            this.ajax("getUsers", {"group.groupId": groupId}, success, error);
        },
        addUserToGroup: function (groupId, username, success, error) {
            this.ajax("addUserToGroup", {"group.groupId": groupId, "user.username": username}, success, error);
        },
        removeUserFromGroup: function (groupId, username, success, error) {
            this.ajax("removeUserFromGroup", {"group.groupId": groupId, "user.username": username}, success, error);
        },
        checkUserIsCreater: function (groupId, username, success, error) {
            this.ajax("checkUserIsCreater", {"group.groupId": groupId, "user.username": username}, success, error);
        },
        updateGroupName: function (groupId, groupName, status, success, error) {
            this.ajax("updateGroupName", {"group.groupId": groupId, groupName: groupName, groupStatus: status}, success, error);

        },
        createGroup: function (groupName, status, success, error) {
            this.ajax("createGroup", {groupName: groupName, groupStatus: status}, success, error);
        },
        deleteGroup: function (groupId, success, error) {
            this.ajax("deleteGroup", {groupId: groupId}, success, error);
        },
        updatePadAndGroupValue: function (data, success, error) {
            this.ajax("updatePadAndGroupValue", data, success, error);
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
                            success(json);
                        }
                    } else {
                        if (error && error instanceof Function) {
                            error(json);
                        }
                    }
                }
            });
        }
    }
});