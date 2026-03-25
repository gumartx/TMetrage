package com.gusmarg.tmetrage.entities.enums;

public enum Platform {

    NETFLIX("Netflix"),
    PRIME_VIDEO("Prime Video"),
    DISNEY_PLUS("Disney+"),
    HBO_MAX("HBO Max"),
    APPLE_TV_PLUS("Apple TV+"),
    PARAMOUNT_PLUS("Paramount+"),
    CRUNCHYROLL("Crunchyroll"),
    GLOBOPLAY("Globoplay"),
    CINEMA("Cinema"),
    OUTRO("Outro");

    private final String nome;

    Platform(String nome) {
        this.nome = nome;
    }

    public String getNome() {
        return nome;
    }
}
