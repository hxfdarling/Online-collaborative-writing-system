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

public class User implements Serializable, Comparable<User> {
	/**
	 * 
	 */
	private static final long serialVersionUID = -8512268362277953345L;

	private String authorId;
	private String name;
	private String username;
	private String password;
	private String registtime;// yyyy-MM-dd-HH-mm-ss
	private int authority = 10;
	private Set<Group> groups = new HashSet<Group>();

	public String toString() {
		return "user:" + this.name + ":" + this.username + ":" + this.password;
	}

	public Set<Group> getGroups() {
		return groups;
	}

	public void setGroups(Set<Group> groups) {
		this.groups = groups;
	}

	public User() {
		this.registtime = DateUtil.dateToString(new Date());
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getAuthorId() {
		return authorId;
	}

	public void setAuthorId(String authorId) {
		this.authorId = authorId;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getRegisttime() {
		return registtime;
	}

	public void setRegisttime(String registtime) {
		this.registtime = registtime;
	}

	public int getAuthority() {
		return authority;
	}

	public void setAuthority(int authority) {
		this.authority = authority;
	}

	public JSONArray groupsJson() {
		List<Group> gs = new ArrayList<Group>(groups);
		Collections.sort(gs);
		JsonConfig cfg = new JsonConfig();
		cfg.setJsonPropertyFilter(new PropertyFilter() {
			public boolean apply(Object source, String name, Object value) {
				if (name.equals("users") || name.equals("createUser")) {
					return true;
				} else {
					return false;
				}
			}
		});
		cfg.setExcludes(new String[] { "handler", "hibernateLazyInitializer" });
		JSONArray ja = JSONArray.fromObject(gs.toArray(), cfg);
		return ja;
	}

	@Override
	public int compareTo(User o) {
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
