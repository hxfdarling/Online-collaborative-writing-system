package com.pad.dao;

import com.pad.entity.Pad;

public interface PadDao extends BaseDao<Pad> {
	public Pad getPad(Pad pad);

	/***
	 * 更具时间删除超时的数据
	 * 
	 * @param time
	 */
	public void deletePad(long time);
}
