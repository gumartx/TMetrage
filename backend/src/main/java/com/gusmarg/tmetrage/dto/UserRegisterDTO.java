package com.gusmarg.tmetrage.dto;

import com.gusmarg.tmetrage.entities.User;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserRegisterDTO {

    @NotBlank(message = "Nome é requerido")
	@Size(max = 50, message = "Nome de perfil pode ter no máximo 50 caracteres")
    private String name;
    @NotBlank(message = "Nome de perfil é requerido")
	@Size(max = 25, message = "Nome de perfil pode ter no máximo 25 caracteres")
    @Pattern(regexp = "^\\S+$", message = "Nome de perfil não pode conter espaços")
    private String profileName;
    @NotBlank(message = "Email é requerido")
    @Email(message = "Formato de email inválido")
    @Pattern(
    	    regexp = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$",
    	    message = "Email deve conter um domínio válido (exemplo: email@gmail.com)"
    	)
    private String email;
	@NotBlank(message = "Senha é requerido")
	@Size(min = 6, message = "Senha precisa ter no mínimo 6 caracteres")
    private String password;
	
    public UserRegisterDTO(User entity) {
		name = entity.getName();
		profileName = entity.getProfileName();
		email = entity.getEmail();
		password = entity.getPassword();
	}
    
}
