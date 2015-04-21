package com.pad.dao;

import java.io.Serializable;   
import java.util.List;   
  
/**  
 * BaseDAO 定义DAO的通用操作  
 *   
 */  
public interface BaseDao<T> {   
	/**  
	 * BaseDAO 保存
	 *   
	 */  
    public String save(T entity);   
    /**  
     * BaseDAO 更新
     *   
     */  
    public void update(T entity);
    /**  
     * BaseDAO update 合并的方式
     *   
     */  
    public void merge(T entity);
    /**  
     * BaseDAO 删除数据通过ID
     *   
     */  
    public void delete(Serializable id);   
    /**  
     * BaseDAO 删除实体
     *   
     */  
    public void delete(T entity);  
    /**  
     * BaseDAO 通过实体的ID查询  
     *   
     */  
    public T findById(Serializable id);   
    /**  
     * BaseDAO 查找，通过hql语句  
     *   
     */  
    public List<T> findByHQL(String hql, Object... params);   
  
}  
