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
import javax.servlet.http.HttpServletResponseWrapper;

import com.pad.entity.User;

public class UserFilter implements Filter {
	public FilterConfig config;

	@Override
	public void destroy() {
		// TODO Auto-generated method stub
		this.config = null;
	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain chain) throws IOException, ServletException {
		// TODO Auto-generated method stub
		HttpServletRequest hrequest = (HttpServletRequest) request;
		HttpServletResponseWrapper wrapper = new HttpServletResponseWrapper(
				(HttpServletResponse) response);
		System.out.println("url:" + hrequest.getRequestURI());
		String logonStrings = config.getInitParameter("logonStrings");
		String includeStrings = config.getInitParameter("includeStrings");
		String redirectPath = hrequest.getContextPath()
				+ config.getInitParameter("redirectPath");
		String disabletestfilter = config.getInitParameter("disabletestfilter");
		if (disabletestfilter.toUpperCase().equals("Y")) {
			chain.doFilter(request, response);
			return;
		}
		String[] logonList = logonStrings.split(";");
		String[] includeList = includeStrings.split(";");

		if (!UserFilter.isContains(hrequest.getRequestURI(), includeList)) {
			chain.doFilter(request, response);
			return;
		}

		if (UserFilter.isContains(hrequest.getRequestURI(), logonList)) {
			chain.doFilter(request, response);
			return;
		}

		User user = (User) hrequest.getSession().getAttribute("user");
		if (user == null) {
			wrapper.sendRedirect(redirectPath);
			return;
		} else {
			chain.doFilter(request, response);
			return;
		}
	}

	@Override
	public void init(FilterConfig arg0) throws ServletException {
		// TODO Auto-generated method stub
		this.config = arg0;
	}

	public static boolean isContains(String container, String[] regx) {
		boolean result = false;

		for (int i = 0; i < regx.length; i++) {
			if (container.indexOf(regx[i]) != -1) {
				return true;
			}
		}
		return result;
	}

}
