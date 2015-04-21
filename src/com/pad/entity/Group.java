package com.pad.entity;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import net.sf.json.JSONArray;
import net.sf.json.JsonConfig;
import net.sf.json.util.PropertyFilter;

import com.pad.util.DateUtil;

public class Group implements Serializable, Comparable<Group> {
	/**
	 * 
	 */
	private static final long serialVersionUID = -5643641067404991764L;
	private String groupId;
	private String name;
	private User createUser;
	private String createTime;
	private String status;
	private String createUesrName;
	private Set<User> users = new HashSet<User>();

	public String getCreateUesrName() {
		return createUesrName;
	}

	public void setCreateUesrName(String createUesrName) {
		this.createUesrName = createUesrName;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public int removeUserByUsername(String userName) {
		boolean f = false;
		User t = null;
		if (createUser.getUsername().equals(userName)) {
			return 2;
		}
		for (User u : users) {
			if (userName.equals(u.getUsername())) {
				f = true;
				t = u;
				break;
			}
		}
		if (f) {
			users.remove(t);
		} else {
			return 1;
		}
		return 0;
	}

	public Group() {
		createTime = DateUtil.dateToString(new Date());
	}

	public String getCreateTime() {
		return createTime;
	}

	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}

	public User getCreateUser() {
		return createUser;
	}

	public void setCreateUser(User createUser) {
		this.createUser = createUser;
		this.createUesrName = createUser.getName();
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getGroupId() {
		return groupId;
	}

	public void setGroupId(String groupId) {
		this.groupId = groupId;
	}

	public Set<User> getUsers() {
		return users;
	}

	public void setUsers(Set<User> users) {
		this.users = users;
	}

	public JSONArray usersJson() {
		List<User> us = new ArrayList<User>(users);
		Collections.sort(us);

		JsonConfig cfg = new JsonConfig();
		cfg.setJsonPropertyFilter(new PropertyFilter() {
			public boolean apply(Object source, String name, Object value) {
				if (name.equals("authorId") || name.equals("name")
						|| name.equals("username")) {
					return false;
				} else {
					return true;
				}
			}
		});
		cfg.setExcludes(new String[] { "handler", "hibernateLazyInitializer" });

		JSONArray ja = JSONArray.fromObject(users.toArray(), cfg);
		return ja;
	}

	@Override
	public int compareTo(Group o) {
		// TODO Auto-generated method stub
		if (this.name.codePointAt(0) < o.name.codePointAt(0)) {
			return -1;
		} else if (this.name.codePointAt(0) > o.name.codePointAt(0)) {
			return 1;
		} else {
			if (this.name.length() > o.name.length()) {
				return 1;
			} else if (this.name.length() < o.name.length()) {
				return -1;
			}
		}
		return 0;
	}
}
