package com.gusmarg.tmetrage.dto;

import java.time.LocalDate;

import com.gusmarg.tmetrage.dto.enums.Period;
import com.gusmarg.tmetrage.entities.enums.Platform;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class RatingFilterDTO {

	private Platform platform;
	@Min(1)
	@Max(5)
	private Integer score;
	private Period period;
	private LocalDate startDate;
	private LocalDate endDate;
}
