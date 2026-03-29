package com.gusmarg.tmetrage.utils;

import java.security.SecureRandom;

public class PasswordGenerator {

    private static final String CHARACTERS =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    public static String generatePassword(int length){

        SecureRandom random = new SecureRandom();

        StringBuilder password = new StringBuilder();

        for(int i = 0; i < length; i++){
            int index = random.nextInt(CHARACTERS.length());
            password.append(CHARACTERS.charAt(index));
        }

        return password.toString();
    }

}