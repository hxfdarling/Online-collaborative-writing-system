package com.pad.service.impl;

import java.io.Serializable;
import java.util.List;

import com.pad.dao.BaseDao;
import com.pad.service.BaseService;

public class BaseServiceImpl<T> implements BaseService<T> {

	/**
	 * 注入BaseDao
	 */
	protected BaseDao<T> baseDaoImpl;

	public void setBaseDaoImpl(BaseDao<T> baseDaoImpl) {
		this.baseDaoImpl = baseDaoImpl;
	}

	public String save(T entity) {
		if (baseDaoImpl == null) {
			System.out.println("null baseDaoImpl");
		}
		return baseDaoImpl.save(entity);
	}

	public void update(T entity) {
		baseDaoImpl.update(entity);
	}

	public void merge(T entity) {
		baseDaoImpl.merge(entity);
	}

	public void delete(Serializable id) {
		baseDaoImpl.delete(id);
	}

	public T getById(Serializable id) {
		return baseDaoImpl.findById(id);
	}

	public List<T> getByHQL(String hql, Object... params) {
		return baseDaoImpl.findByHQL(hql, params);
	}

	@Override
	public void delete(T entity) {
		// TODO Auto-generated method stub
		baseDaoImpl.delete(entity);
	}

}
