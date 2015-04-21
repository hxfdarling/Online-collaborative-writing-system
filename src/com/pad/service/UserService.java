package com.pad.service;

import com.pad.entity.User;

public interface UserService extends BaseService<User> {
	public User checkUser(User user);

	public Boolean checkExistUser(User user);
	public User getUser(String userName);
}
