package com.pad.dao;

import com.pad.entity.User;




public interface UserDao extends BaseDao<User>{
	public User checkUser(User user);
	public Boolean checkExistUser(User user);
	public User getUser(String userName);
}
