package com.pad.dao.impl;

import org.hibernate.Query;

import com.pad.dao.UserDao;
import com.pad.entity.User;

public class UserDaoImpl extends BaseDaoImpl<User> implements UserDao {

	public User checkUser(User user) {
		// TODO Auto-generated method stub
		User u = null;
		Query query = this.getSession().createQuery(
				"from User where username=:name and password=:pass");
		query.setString("name", user.getUsername());
		query.setString("pass", user.getPassword());
		Object obj = query.uniqueResult();
		if (obj != null) {
			u = (User) obj;
		}
		return u;
	}

	public Boolean checkExistUser(User user) {
		// TODO Auto-generated method stub
		Query query = this.getSession().createQuery(
				"from User where username=:name ");
		System.out.println(query.toString());
		query.setString("name", user.getUsername());
		Object obj = query.uniqueResult();
		if (obj != null) {
			return true;
		}
		return false;
	}

	@Override
	public User getUser(String userName) {
		// TODO Auto-generated method stub
		Query query = this.getSession().createQuery(
				"from User where username=:name ");
		System.out.println(query.toString());
		query.setString("name", userName);
		return (User) query.uniqueResult();
	}
}
