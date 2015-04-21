package com.pad.util;

import java.util.Date;

import javax.servlet.ServletContext;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.web.context.ServletContextAware;

import com.pad.entity.User;
import com.pad.service.impl.UserServiceImpl;

public class InitListener implements InitializingBean, ServletContextAware {
	private UserServiceImpl userServiceImpl;

	public UserServiceImpl getUserServiceImpl() {
		return userServiceImpl;
	}

	public void setUserServiceImpl(UserServiceImpl userServiceImpl) {
		this.userServiceImpl = userServiceImpl;
	}

	public void contextInitialized() {
		// TODO Auto-generated method stub
		try {
			System.out.println("系统正在初始化！稍后");
			User user = new User();
			user.setAuthority(0);
			user.setPassword("liuhua");
			user.setUsername("admin@pad.com");
			user.setRegisttime(DateUtil.dateToString(new Date()));
			user.setName("admin");
			user.setAuthority(1);

			if (!userServiceImpl.checkExistUser(user))
				userServiceImpl.save(user);

		} catch (Exception e) {
			// System.out.println("遇到异常，这是系统初始化异常请忽略");
			e.printStackTrace();
		}

	}

	@Override
	public void setServletContext(ServletContext arg0) {
		// TODO Auto-generated method stub
		contextInitialized();
	}

	@Override
	public void afterPropertiesSet() throws Exception {
		// TODO Auto-generated method stub

	}

}
