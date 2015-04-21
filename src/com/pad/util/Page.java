package com.pad.util;

public class Page {
	public int currentPage;
	public int nextPage;
	public int pageSize = 20;
	public int totalPage;
	private long sum;

	public int getNextPage() {
		return nextPage;
	}

	public void setNextPage(int nextPage) {
		this.nextPage = nextPage;
	}

	public int getCurrentPage() {
		return currentPage;
	}

	public void setCurrentPage(int currentPage) {
		this.currentPage = currentPage;
	}

	public int getPageSize() {
		return pageSize;
	}

	public void setPageSize(int pageSize) {
		this.pageSize = pageSize;
	}

	public int getTotalPage() {
		return totalPage;
	}

	public void setTotalPage(int totalPage) {
		this.totalPage = totalPage;
	}

	public long getSum() {
		return sum;
	}

	public void setSum(long sum) {
		this.sum = sum;
		if (this.pageSize == 0) {
			this.pageSize = 30;
		}
		this.totalPage = (int) (this.sum / this.pageSize);
		this.totalPage += (this.sum % this.pageSize != 0 ? 1 : 0);
		System.out.println("page.setSum() function invorked and totalPage is "
				+ this.totalPage+"and sum is "+sum);
	}

}