package com.pad.service.impl;

import com.pad.dao.UserDao;
import com.pad.entity.User;
import com.pad.service.UserService;

public class UserServiceImpl extends BaseServiceImpl<User> implements
		UserService {
	private UserDao userDao;

	public UserDao getUserDao() {
		return userDao;
	}

	public void setUserDao(UserDao userDao) {
		setBaseDaoImpl(userDao);
		this.userDao = userDao;
	}

	public User checkUser(User user) {
		// TODO Auto-generated method stub
		return userDao.checkUser(user);
	}

	public Boolean checkExistUser(User user) {
		// TODO Auto-generated method stub
		return userDao.checkExistUser(user);
	}

	@Override
	public User getUser(String userName) {
		// TODO Auto-generated method stub
		return userDao.getUser(userName);
	}

}
