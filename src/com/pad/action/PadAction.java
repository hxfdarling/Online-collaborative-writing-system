package com.pad.action;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;
import net.sf.json.util.PropertyFilter;

import org.apache.struts2.interceptor.ServletResponseAware;
import org.apache.struts2.interceptor.SessionAware;

import com.opensymphony.xwork2.ActionSupport;
import com.pad.entity.Pad;
import com.pad.entity.User;
import com.pad.service.PadService;
import com.pad.service.UserService;

public class PadAction extends ActionSupport implements SessionAware,
		ServletResponseAware {
	/**
* 
*/
	private static final long serialVersionUID = 917009922794248850L;
	private JSONObject jo = new JSONObject();
	private Map<String, Object> session;
	private HttpServletResponse response;
	private PadService padService;
	private UserService userService;
	private Pad pad;
	private String timeValue;
	private String wordValue;

	/***
	 * 拉取pad活跃度数据
	 */
	public void updatePadAndGroupValue() {
		System.out.println("更新小组数据");
		try {
			response.setCharacterEncoding("UTF-8");

			User user = (User) session.get("user");
			if (user != null) {
				pad.setWordValue(Integer.parseInt(wordValue));
				pad.setTimeValue(Integer.parseInt(timeValue));
				List<Pad> pads = padService.updatePadAndGroup(pad);
				int code = 0;
				String msg = "ok";
				if (pads != null) {

					Pad ap = pads.get(1);
					if (ap.getStatus() < 2) {
						code = 3;
						msg = "在线编辑状态的文章很少！";
					}

					JsonConfig cfg = new JsonConfig();
					cfg.setJsonPropertyFilter(new PropertyFilter() {
						public boolean apply(Object source, String name,
								Object value) {
							return false;
						}
					});
					cfg.setExcludes(new String[] { "handler",
							"hibernateLazyInitializer" });
					JSONArray ja = JSONArray.fromObject(pads.toArray(), cfg);
					jo.element("data", ja);
				} else {
					code = 2;
					msg = "当前无法获取数据";
				}

				jo.put("status", 0);
				jo.put("message", msg);
				jo.put("code", code);
				String json = jo.toString();
				response.getWriter().write(json);
			} else {
				jo.put("status", 1);
				jo.put("message", "user login over");
				jo.put("code", 1);
				String json = jo.toString();
				response.getWriter().write(json);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public Pad getPad() {
		return pad;
	}

	public void setPad(Pad pad) {
		this.pad = pad;
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

	public JSONObject getJo() {
		return jo;
	}

	public void setJo(JSONObject jo) {
		this.jo = jo;
	}

	public HttpServletResponse getResponse() {
		return response;
	}

	public void setResponse(HttpServletResponse response) {
		this.response = response;
	}

	public PadService getPadService() {
		return padService;
	}

	public void setPadService(PadService padService) {
		this.padService = padService;
	}

	public UserService getUserService() {
		return userService;
	}

	public void setUserService(UserService userService) {
		this.userService = userService;
	}

	public Map<String, Object> getSession() {
		return session;
	}

	public String getTimeValue() {
		return timeValue;
	}

	public void setTimeValue(String timeValue) {
		this.timeValue = timeValue;
	}

	public String getWordValue() {
		return wordValue;
	}

	public void setWordValue(String wordValue) {
		this.wordValue = wordValue;
	}

}
