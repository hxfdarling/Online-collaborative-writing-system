package com.pad.util;

import java.util.HashSet;
import java.util.Set;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import com.pad.entity.User;

public class JSON {
	public static void main(String[] args) {
		JSONObject jo = new JSONObject();
		jo.put("status", true);
		JSONArray ja = new JSONArray();
		Set<User> us = new HashSet<User>();
		ja.addAll(us);
		jo.element("users", ja);
		String st = jo.toString();
		System.out.print(st);
	}
}
