package com.example.bestiario;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Classe principal.
 *
 * IMPORTANTE: ela fica na RAIZ do pacote (com.example.bestiario).
 * O @SpringBootApplication faz "component scan" a partir do pacote dela para baixo,
 * então encontra controller/, service/ e model/ automaticamente.
 *
 * Se ela estivesse em com.example.bestiario.application (como na AV1),
 * seria preciso: @SpringBootApplication(scanBasePackages = "com.example.bestiario")
 * Sintoma de esquecer: o projeto sobe, mas todo endpoint responde 404.
 */
@SpringBootApplication
public class BestiarioApplication {

    public static void main(String[] args) {
        SpringApplication.run(BestiarioApplication.class, args);
    }
}
