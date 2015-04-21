package com.pad.filter;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.Random;

import javax.imageio.ImageIO;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet Filter implementation class ImageCodeFilter
 */
public class ImageCodeFilter implements Filter {

	/**
	 * Default constructor.
	 */
	public ImageCodeFilter() {
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see Filter#destroy()
	 */
	public void destroy() {
		// TODO Auto-generated method stub
	}

	/**
	 * @see Filter#doFilter(ServletRequest, ServletResponse, FilterChain)
	 */
	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain chain) throws IOException, ServletException {
		// TODO Auto-generated method stub
		// place your code here
		doGet((HttpServletRequest) request, (HttpServletResponse) response);
		// pass the request along the filter chain
	}

	/**
	 * @see Filter#init(FilterConfig)
	 */
	public void init(FilterConfig fConfig) throws ServletException {
		// TODO Auto-generated method stub
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		System.out.println("正在请求获取验证码....");
		response.addHeader("Cache-Control", "no-cache");
		response.setContentType("image/jpeg");
		BufferedImage bmp = buildImage(request);
		// 输出图片
		ImageIO.write(bmp, "jpeg", response.getOutputStream());
	}

	public BufferedImage buildImage(HttpServletRequest request) {
		String codeStr = "";
		BufferedImage image = new BufferedImage(100, 30,
				BufferedImage.TYPE_INT_RGB);
		Graphics graphics = image.createGraphics();
		int r = ((int) (Math.random() * (55) + 1)) + 200;
		int g = ((int) (Math.random() * (55) + 1)) + 200;
		int b = ((int) (Math.random() * (55) + 1)) + 200;
		Color color = new Color(r, g, b);
		graphics.setColor(color);
		graphics.fillRect(0, 0, 100, 30);
		for (int i = 0; i < 100; i++) {
			int x = new Random().nextInt(100);
			int y = new Random().nextInt(30);
			int width = new Random().nextInt(3);
			int height = new Random().nextInt(3);
			int or = new Random().nextInt(255);
			int og = new Random().nextInt(255);
			int ob = new Random().nextInt(255);
			Color c = new Color(or, og, ob);
			graphics.setColor(c);
			graphics.drawOval(x, y, width, height);
		}
		graphics.setFont(new Font("Courier New", Font.BOLD, 20));
		for (int i = 0; i < 4; i++) {
			int or = new Random().nextInt(255);
			int og = new Random().nextInt(255);
			int ob = new Random().nextInt(255);
			Color c = new Color(or, og, ob);
			graphics.setColor(c);
			int value = new Random().nextInt(9);
			int offsetX = i * 25 + 8;
			int offsetY = ((int) (Math.random() * (20) + 1)) + 10;
			codeStr += value;
			graphics.drawString(value + "", offsetX, offsetY);
		}
		request.getSession().setAttribute("sn", codeStr);
		return image;
	}
}
