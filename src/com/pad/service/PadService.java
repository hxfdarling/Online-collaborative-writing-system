package com.pad.service;

import java.util.List;

import com.pad.entity.Pad;

public interface PadService extends BaseService<Pad> {
	public List<Pad> updatePadAndGroup(Pad pad);
}
