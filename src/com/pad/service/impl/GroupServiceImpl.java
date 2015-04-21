package com.pad.service.impl;

import com.pad.dao.GroupDao;
import com.pad.entity.Group;
import com.pad.service.GroupService;

public class GroupServiceImpl extends BaseServiceImpl<Group> implements
		GroupService {
	private GroupDao groupDao;

	public GroupDao getGroupDao() {
		return groupDao;
	}

	public void setGroupDao(GroupDao groupDao) {
		setBaseDaoImpl(groupDao);
		this.groupDao = groupDao;
	}

}
