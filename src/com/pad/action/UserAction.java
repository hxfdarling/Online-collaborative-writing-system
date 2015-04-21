package com.pad.action;

import java.io.IOException;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;
import net.sf.json.util.PropertyFilter;

import org.apache.struts2.interceptor.ServletResponseAware;
import org.apache.struts2.interceptor.SessionAware;

import com.opensymphony.xwork2.ActionSupport;
import com.pad.entity.User;
import com.pad.service.UserService;
import com.pad.util.StaticData;

public class UserAction extends ActionSupport implements SessionAware,
		ServletResponseAware {

	/**
	 * 
	 */
	private static final long serialVersionUID = -2955734156582786449L;

	private UserService userService;
	private Map<String, Object> session;
	private HttpServletResponse response;
	private JSONObject jo = new JSONObject();

	private User user;
	private String sessionId;

	/***
	 * 获取系统信息
	 */
	public void getSystemInfo() {
		System.out.print("获取系统信息");
		try {
			response.setCharacterEncoding("UTF-8");
			jo.put("status", "开发模式");
			jo.put("copyright", StaticData.copyright);

			String json = jo.toString();
			System.out.print(json);
			response.getWriter().write(json);

		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	/***
	 * 登录
	 */
	public void login() {
		if (user.getUsername() == null || user.getPassword() == null) {
			try {
				response.getWriter().write("false");
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			return;
		}
		try {
			response.setCharacterEncoding("UTF-8");
			if ((user = userService.checkUser(user)) != null) {
				System.out.print(user);
				user.setPassword("");
				session.put("status", "login_in");
				session.put("user", user);

				jo.put("message", "ok");
				jo.put("code", 0);
				JsonConfig cfg = new JsonConfig();
				cfg.setJsonPropertyFilter(new PropertyFilter() {
					public boolean apply(Object source, String name,
							Object value) {
						if (name.equals("groups")) {
							return true;
						} else {
							return false;
						}
					}
				});
				cfg.setExcludes(new String[] { "handler",
						"hibernateLazyInitializer" });
				jo.element("user", user, cfg);
				jo.put("status", true);
				jo.put("url", "pad.html");
				String json = jo.toString();
				System.out.print("登录成功" + json);
				response.getWriter().write(json);
			} else {
				jo.put("status", false);
				String json = jo.toString();
				response.getWriter().write(json);
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	/***
	 * 注册用户
	 * 
	 * @return
	 */
	public String register() {
		System.out.print("正在注册用户");
		System.out.print(user);
		if (user.getName() != null && user.getPassword() != null
				&& user.getUsername() != null) {
			userService.save(user);
		} else {
			System.out.println("信息不完整");
		}
		return "success";
	}

	/***
	 * 获取登录信息
	 */
	public void getInfo() {
		try {
			response.setCharacterEncoding("UTF-8");
			if ("login_in".equals(session.get("status"))) {
				user = (User) session.get("user");
				user.setPassword("");

				jo.put("status", true);
				jo.put("message", "ok");
				jo.put("code", 0);
				JsonConfig cfg = new JsonConfig();
				cfg.setJsonPropertyFilter(new PropertyFilter() {
					public boolean apply(Object source, String name,
							Object value) {
						if (name.equals("groups")) {
							return true;
						} else {
							return false;
						}
					}
				});
				cfg.setExcludes(new String[] { "handler",
						"hibernateLazyInitializer" });
				jo.element("user", user, cfg);
				jo.element("groups", user.groupsJson());
				String json = jo.toString();
				System.out.print(json);
				response.getWriter().write(json);

			} else {
				jo.put("message", "error");
				jo.put("code", 1);
				jo.put("status", false);
				String json = jo.toString();
				response.getWriter().write(json);
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	@Override
	public void setSession(Map<String, Object> arg0) {
		// TODO Auto-generated method stub
		session = arg0;

	}

	@Override
	public void setServletResponse(HttpServletResponse arg0) {
		// TODO Auto-generated method stub
		response = arg0;
	}

	public String getSessionId() {
		return sessionId;
	}

	public void setSessionId(String sessionId) {
		this.sessionId = sessionId;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public UserService getUserService() {
		return userService;
	}

	public void setUserService(UserService userService) {
		this.userService = userService;
	}
}
