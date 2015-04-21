package com.pad.action;

import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;
import net.sf.json.util.PropertyFilter;

import org.apache.struts2.interceptor.ServletResponseAware;
import org.apache.struts2.interceptor.SessionAware;

import com.opensymphony.xwork2.ActionSupport;
import com.pad.entity.Group;
import com.pad.entity.User;
import com.pad.service.GroupService;
import com.pad.service.UserService;

/**
 * @author 华
 * 
 */
public class GroupAction extends ActionSupport implements SessionAware,
		ServletResponseAware {
	/**
	 * 
	 */
	private static final long serialVersionUID = 917009922794248850L;
	private JSONObject jo = new JSONObject();
	private Map<String, Object> session;
	private HttpServletResponse response;
	private GroupService groupService;
	private UserService userService;

	private String groupId;
	private String groupName;
	private String groupStatus;
	private User user;
	private Group group;

	public void deleteGroup() {
		try {
			response.setCharacterEncoding("UTF-8");
			group = groupService.getById(groupId);
			user = (User) session.get("user");
			if (group.getCreateUser().getUsername().equals(user.getUsername())||user.getAuthority()==1) {
				groupService.delete(group);
				jo.put("message", "success");
				jo.put("code", 0);
				String json = jo.toString();
				response.getWriter().write(json);
			} else {
				jo.put("message", "user is't create group!");
				jo.put("code", 1);
				String json = jo.toString();
				response.getWriter().write(json);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void updateGroupName() {
		try {
			response.setCharacterEncoding("UTF-8");
			group = groupService.getById(group.getGroupId());
			user = (User) session.get("user");

			User cu = group.getCreateUser();
			if (cu.getUsername().equals(user.getUsername())||user.getAuthority()==1) {
				group.setName(groupName);
				group.setStatus(groupStatus);
				groupService.update(group);
				jo.put("message", "success~");
				jo.put("code", 0);
				String json = jo.toString();
				response.getWriter().write(json);
			} else {
				jo.put("message", "user is't create group!");
				jo.put("code", 1);
				String json = jo.toString();
				response.getWriter().write(json);
			}
		} catch (Exception e) {

		}
	}

	public void checkUserIsCreater() {
		group = groupService.getById(group.getGroupId());
		User cu = group.getCreateUser();
		user = (User) session.get("user");
		try {
			response.setCharacterEncoding("UTF-8");
			if (cu.getUsername().equals(user.getUsername())) {
				jo.put("message", "ok");
				jo.put("code", 0);
				String json = jo.toString();
				response.getWriter().write(json);
			} else {
				jo.put("message", "user is't create group!");
				jo.put("code", 1);
				String json = jo.toString();
				response.getWriter().write(json);
			}
		} catch (Exception e) {

		}
	}

	public void addUserToGroup() {
		try {
			response.setCharacterEncoding("UTF-8");
			group = groupService.getById(group.getGroupId());
			User fu = (User) session.get("user");
			if (!fu.getUsername().equals(group.getCreateUser().getUsername())) {
				jo.put("message", "user is't create group!");
				jo.put("code", 2);
				String json = jo.toString();
				response.getWriter().write(json);
				return;
			}
			user = userService.getUser(user.getUsername());
			if (group != null && user != null) {
				group.getUsers().add(user);
				groupService.update(group);

				jo.put("message", "ok");
				jo.put("code", 0);
				String json = jo.toString();
				response.getWriter().write(json);

			} else {
				jo.put("message", "user not fund!");
				jo.put("code", 1);
				String json = jo.toString();
				response.getWriter().write(json);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void removeUserFromGroup() {
		try {
			response.setCharacterEncoding("UTF-8");
			group = groupService.getById(group.getGroupId());
			User nc = (User) session.get("user");
			if (!group.getCreateUser().getUsername().equals(nc.getUsername())&&nc.getAuthority()!=1) {
				jo.put("message", "user is't admin for the group!");
				jo.put("code", 3);
				String json = jo.toString();
				response.getWriter().write(json);
				return;
			}
			// user = userService.getUser(user.getUsername());
			if (group != null && user != null) {
				int code = group.removeUserByUsername(user.getUsername());

				String msg;
				switch (code) {
				case 1:
					msg = "user not found";
					break;
				case 2:
					msg = "user was created the group";
					break;
				case 0:
				default:
					groupService.update(group);
					msg = "ok";
				}
				jo.put("message", msg);
				jo.put("code", code);
				String json = jo.toString();
				response.getWriter().write(json);

			} else {
				jo.put("message", "user not fund!");
				jo.put("code", 1);
				String json = jo.toString();
				response.getWriter().write(json);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void getUsers() {
		System.out.print("getUserByGroupId\n");
		try {
			response.setCharacterEncoding("UTF-8");
			if (group.getGroupId() != null) {
				JSONArray users = groupService.getById(group.getGroupId())
						.usersJson();
				jo.put("message", "ok");
				jo.put("code", 0);
				jo.element("users", users);
				String json = jo.toString();
				System.out.println("------getUsersByGroupId--------" + json);
				response.getWriter().write(json);
			} else {
				jo.put("status", false);
				String json = jo.toString();
				response.getWriter().write(json);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void createGroup() {
		System.out.println("正在创建组" + groupName);
		try {
			response.setCharacterEncoding("UTF-8");

			User user = (User) session.get("user");
			user = userService.getById(user.getAuthorId());
			if (user != null) {
				Set<Group> groups = user.getGroups();
				for (Group g : groups) {
					if (g.getName().equals(groupName)) {
						jo.put("status", 2);
						jo.put("message", "repeat");
						jo.put("code", 2);
						jo.put("groupId", g.getGroupId());
						String json = jo.toString();
						response.getWriter().write(json);
						return;
					}
				}
				Group group = new Group();
				group.setName(groupName);
				group.setStatus(this.groupStatus);
				Set<User> users = group.getUsers();
				users.add(user);
				group.setUsers(users);
				group.setCreateUser(user);
				String groupId = groupService.save(group);
				jo.put("status", 0);
				jo.put("message", "ok");
				jo.put("code", 0);
				jo.put("groupId", groupId);
				String json = jo.toString();
				response.getWriter().write(json);
			} else {
				jo.put("status", 1);
				jo.put("message", "error");
				jo.put("code", 1);
				String json = jo.toString();
				response.getWriter().write(json);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void getGroups() {
		try {
			response.setCharacterEncoding("UTF-8");
			User user = (User) session.get("user");
			JSONArray ja;
			if (user.getAuthority() == 1) {
				List<Group> gs = groupService.getByHQL("from Group order by groupId");

				JsonConfig cfg = new JsonConfig();
				cfg.setJsonPropertyFilter(new PropertyFilter() {
					public boolean apply(Object source, String name,
							Object value) {
						if (name.equals("users") || name.equals("createUser")) {
							return true;
						} else {
							return false;
						}
					}
				});
				cfg.setExcludes(new String[] { "handler",
						"hibernateLazyInitializer" });
				ja = JSONArray.fromObject(gs.toArray(), cfg);

			} else {
				user = userService.getById(user.getAuthorId());
				ja = user.groupsJson();
			}

			jo.put("status", true);
			jo.put("message", "ok");
			jo.put("code", 0);
			jo.element("rows", ja);
			String json = jo.toString();
			response.getWriter().write(json);
		} catch (Exception e) {

		}
	}

	public UserService getUserService() {
		return userService;
	}

	public void setUserService(UserService userService) {
		this.userService = userService;
	}

	public String getGroupId() {
		return groupId;
	}

	public void setGroupId(String groupId) {
		this.groupId = groupId;
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

	public HttpServletResponse getResponse() {
		return response;
	}

	public void setResponse(HttpServletResponse response) {
		this.response = response;
	}

	public Map<String, Object> getSession() {
		return session;
	}

	public GroupService getGroupService() {
		return groupService;
	}

	public void setGroupService(GroupService groupService) {
		this.groupService = groupService;
	}

	public String getGroupName() {
		return groupName;
	}

	public void setGroupName(String groupName) {
		this.groupName = groupName;
	}

	public Group getGroup() {
		return group;
	}

	public void setGroup(Group group) {
		this.group = group;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public String getGroupStatus() {
		return groupStatus;
	}

	public void setGroupStatus(String groupStatus) {
		this.groupStatus = groupStatus;
	}

}
