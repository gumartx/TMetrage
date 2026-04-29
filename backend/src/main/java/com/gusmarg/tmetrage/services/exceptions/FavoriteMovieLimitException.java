package com.gusmarg.tmetrage.services.exceptions;

public class FavoriteMovieLimitException extends RuntimeException {
	private static final long serialVersionUID = 1L;

	public FavoriteMovieLimitException(String msg) {
		super(msg);
	}
}
