package com.pad.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.pad.entity.User;
import com.pad.service.impl.UserServiceImpl;

/**
 * Servlet Filter implementation class CheckFilter
 */
public class CheckFilter implements Filter {
	private UserServiceImpl userServiceImpl;

	public UserServiceImpl getUserServiceImpl() {
		return userServiceImpl;
	}

	public void setUserServiceImpl(UserServiceImpl userServiceImpl) {
		this.userServiceImpl = userServiceImpl;
	}

	/**
	 * Default constructor.
	 */
	public CheckFilter() {
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see Filter#destroy()
	 */
	public void destroy() {
		// TODO Auto-generated method stub
	}

	/**
	 * @see Filter#doFilter(ServletRequest, ServletResponse, FilterChain)
	 */
	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain chain) throws IOException, ServletException {
		// TODO Auto-generated method stub
		// place your code here

		// pass the request along the filter chain
		// HttpServletRequest req = (HttpServletRequest) request;
		// HttpServletResponse res = (HttpServletResponse) response;
		doGet((HttpServletRequest) request, (HttpServletResponse) response);
	}

	/**
	 * @see Filter#init(FilterConfig)
	 */
	public void init(FilterConfig fConfig) throws ServletException {
		// TODO Auto-generated method stub
	}

	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub

		String operation = request.getParameter("operation");
		System.out.println("CheckFilter---" + operation);
		try {
			if (!"".equals(operation) && operation != null) {
				if (operation.equals("checksn")) {// 验证码检测
					String pstCfmCode = request.getParameter("snCode");
					String sn = (String) request.getSession()
							.getAttribute("sn");
					if (pstCfmCode.equals(sn)) {
						response.getOutputStream().print("true");
					} else {
						response.getOutputStream().print("false");
					}
				} else if (operation.equals("email")) {
					User user = new User();
					String username = request.getParameter("user.username");
					user.setUsername(username.trim());
					System.out.println("username is " + username);
					boolean status = userServiceImpl.checkExistUser(user);
					System.out.println(status);
					if (status) {
						response.getOutputStream().print("false");
					} else {
						response.getOutputStream().print("true");
					}
				}
			}
		} catch (Exception e) {
			System.out.println("catch exception .....");
			e.printStackTrace();
		}
	}

}
