---
layout: post
title: A closer look to Java ConstraintValidator testing
date:  2020-05-17 01:35:00 +0200
categories: [Technical,Java]
---
<div class="header">
	<div class="row">
		<div class="column">
			<div class="volume_title">Vol #1</div>
		</div>
	</div>
	<div class="row"> 
		<div class="column">
			<div class="last_updated"></div>
		</div>
	</div>
	<div class="row">
		<div class="column">
			<div class="summary">
				There are many ways to write unit tests for ConstraintValidator, in this volume, I'll talk about
				how to do it in spring boot environment. 
			</div>
		</div>
	</div>
</div>
<div class="content">
	<div class="row">
		<div class="column">
			<div class="technologies_used">
				<ul class="technology_list">
					<li class="technology">Java</li>
					<li class="technology">Spring boot test</li>
				</ul>
			</div>
		</div>
	</div>
	<hr>
	<div class="row">
		<div class="column">
			<div class="main_text">
				<p>
					Constraint validator implementation is somewhat a hard topic to think/use of I think. It gives you certain advantages and disadvantages. I'll share my knowledge about that and update this post when I have time. I didn't want to miss that chance to share this knowledge, when I have enough courage to do so :)
					But now, let's just talk about testing constraint validator testing.
				</p>
				<p>
					Here is how I used the validator on my dto class:
{% highlight java lineos%}
import com.project.entities.validation.UsernameUnique;
import java.util.UUID;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@EqualsAndHashCode
@ToString()
@NoArgsConstructor
public class UserDTO {

    @NotEmpty
    @Size(min = 5, max = 45)
    @UsernameUnique
    private String username;

    //...trimmed for clarity
}
{% endhighlight %}	
				</p>
				<p>
					Now that we have our validator, we can use to test it:
{% highlight java lineos%}
import com.project.dto.UserDTO;
import com.project.repositories.UserRepository;
import com.project.validation.UserDtoHelper;
import java.util.Set;
import javax.validation.ConstraintViolation;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.validation.beanvalidation.SpringConstraintValidatorFactory;
import org.springframework.web.context.WebApplicationContext;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.when;

@SpringBootTest
public class UsernameUniqueValidatorTest {

    @MockBean
    UserRepository userRepository;
    private LocalValidatorFactoryBean validator;
    @Autowired
    private WebApplicationContext webApplicationContext;

    @BeforeEach
    public void setUp() {
        SpringConstraintValidatorFactory springConstraintValidatorFactory
                = new SpringConstraintValidatorFactory(webApplicationContext.getAutowireCapableBeanFactory());
        validator = new LocalValidatorFactoryBean();
        validator.setConstraintValidatorFactory(springConstraintValidatorFactory);
        validator.setApplicationContext(webApplicationContext);
        validator.afterPropertiesSet();
    }

    @Test
    public void shouldCreateUserForNonExistingUsername() {
        // given
        UserDTO userDTO = UserDtoHelper.getNextUserDto();
        // when
        when(userRepository.existsUserByUsername(userDTO.getName())).thenReturn(false);
        Set<ConstraintViolation<UserDTO>> constraintViolations =
                validator.validate(userDTO);

        // then
        assertEquals(0, constraintViolations.size());
    }

    @Test
    public void shouldFailCreateUserForExistingUsername() {
        // given
        String userName = "test-user";
        UserDTO userDTO = UserDtoHelper.getNextUserDto();
        // when
        userDTO.setUsername(userName);
        when(userRepository.existsUserByUsername(userName)).thenReturn(true);
        Set<ConstraintViolation<UserDTO>> constraintViolations =
                validator.validate(userDTO);

        // then
        assertEquals(1, constraintViolations.size());
    }

}
{% endhighlight%}
				</p>
			</div>
		</div>
	</div>
</div>


