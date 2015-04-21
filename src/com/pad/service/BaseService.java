package com.pad.service;

import java.io.Serializable;   
import java.util.List;   
  
/**  
 * BaseService 定义Service的通用操作  
 *   
 */  
public interface BaseService<T> {   
  
    public String save(T entity);   
  
    public void update(T entity); 
    public void merge(T entity); 
  
    public void delete(Serializable id);   
    public void delete(T entity); 
    public T getById(Serializable id);   
  
    public List<T> getByHQL(String hql, Object... params);   
}  
