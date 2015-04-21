package com.pad.dao.impl;

import java.io.Serializable;
import java.lang.reflect.ParameterizedType;
import java.util.List;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;

import com.pad.dao.BaseDao;

/**
 * BaseDaoImpl 定义DAO的通用操作的实现
 * 
 */
@SuppressWarnings("unchecked")
public class BaseDaoImpl<T> implements BaseDao<T> {

	private Class<T> clazz;

	/**
	 * 通过构造方法指定DAO的具体实现类
	 */
	public BaseDaoImpl() {
		ParameterizedType type = (ParameterizedType) this.getClass()
				.getGenericSuperclass();
		clazz = (Class<T>) type.getActualTypeArguments()[0];
		System.out.println("DAO的真实实现类是：" + this.clazz.getName());
	}

	/**
	 * 向DAO层注入SessionFactory
	 */
	protected SessionFactory sessionFactory;

	/**
	 * 获取当前工作的Session
	 */
	protected Session getSession() {
		return this.sessionFactory.getCurrentSession();
	}

	public SessionFactory getSessionFactory() {
		return sessionFactory;
	}

	public void setSessionFactory(SessionFactory sessionFactory) {
		this.sessionFactory = sessionFactory;
	}

	public String save(T entity) {

		return (String) this.getSession().save(entity);
	}

	public void update(T entity) {
		this.getSession().merge(entity);
	}

	public void delete(Serializable id) {
		this.getSession().delete(this.findById(id));
	}

	public void delete(T entity) {
		this.getSession().delete(entity);
	}

	public T findById(Serializable id) {
		return (T) this.getSession().get(this.clazz, id);
	}

	public List<T> findByHQL(String hql, Object... params) {
		Query query = this.getSession().createQuery(hql);
		for (int i = 0; params != null && i < params.length; i++) {
			query.setParameter(i, params);
		}
		return query.list();
	}

	public void merge(T entity) {
		// TODO Auto-generated method stub
		sessionFactory.getCurrentSession().clear();
		sessionFactory.getCurrentSession().update(entity);
	}
}
