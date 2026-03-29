package com.gusmarg.tmetrage.services.utils;

import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

	@Value("${jwt.secret}")
	private String SECRET_KEY;
	@Value("${jwt.duration}")
	private Integer DURATION;
	
	private Key getSignKey(){
	    return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
	}

	public String generateToken(String email) {
		
	    return Jwts.builder()
	            .setSubject(email)
	            .setIssuedAt(new Date())
	            .setExpiration(new Date(System.currentTimeMillis() + DURATION))
	            .signWith(getSignKey())
	            .compact();
	}
	
    public String extractUsername(String token){

        return Jwts.parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}