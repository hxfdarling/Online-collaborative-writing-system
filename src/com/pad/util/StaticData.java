package com.pad.util;

import java.util.Date;
import java.util.List;

import com.pad.entity.Pad;

public class StaticData {
	static public String copyright = "Copyright © 2015-2016 西南大学-教育技术 All rights reserved.";
	static private Date padUpdateDate;
	static private long pad_time = 10000;
	static private Date updateDBDate;
	static public long db_time = 10 * 60 * 1000;
	static public List<Pad> pads;

	/***
	 * 检查缓存的pads数据是需要重新取得
	 * 
	 * @return
	 */
	public static boolean needUpdate() {
		Date crDate = new Date();
		if (StaticData.padUpdateDate != null) {
			if (crDate.getTime() - StaticData.padUpdateDate.getTime() < pad_time) {
				return false;
			} else {
				StaticData.padUpdateDate = crDate;
				return true;
			}

		} else {
			StaticData.padUpdateDate = crDate;
			return true;
		}
	}

	/***
	 * 检查是否需要更新数据库实时化数据
	 * 
	 * @return
	 */
	public static boolean needUpdateDB() {
		Date crDate = new Date();
		if (StaticData.updateDBDate != null) {
			if (crDate.getTime() - StaticData.updateDBDate.getTime() < db_time) {
				return false;
			} else {
				StaticData.updateDBDate = crDate;
				return true;
			}

		} else {
			StaticData.updateDBDate = crDate;
			return true;
		}
	}
}
