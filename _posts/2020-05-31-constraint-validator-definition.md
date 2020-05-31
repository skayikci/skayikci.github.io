---
layout: post
title: What is Java ConstraintValidator
date:  2020-05-31 14:55:00 +0200
categories: [Technical,Java]
---
<div class="header">
	<div class="row">
		<div class="column">
			<div class="volume_title">Vol #2</div>
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
				Remember we talked about ConstraintValidator testing previously? This time, I'll talk about how to implement ConstraintValidator so that you can easily make connection between them. 
			</div>
		</div>
	</div>
</div>
<div class="content">
	<div class="row">
		<div class="column">
			<div class="technologies_used">
				<ul class="technology_list">
					<li class="technology">Java 13</li>
					<li class="technology">Spring boot (data-jpa, web, devtools, starter-test)</li>
					<li class="technology">Lombok</li>
					<li class="technology">Model Mapper</li>
					<li class="technology">h2 In memory database</li>
					<li class="technology">Junit Vintage test</li>
				</ul>
			</div>
		</div>
	</div>
	<hr>
	<div class="row">
		<div class="column">
			<div class="main_text">
				<p>
					<ol>
						<li>
							It will be a long running article, are you ready? If not, you can jump ahead and find the source code:
					<a href="https://github.com/skayikci/examples-repo/tree/master/constraints" target="_blank">Here</a>. 
				</li>
					<li>
					There's a list on the top of this article, and you'll see that we'll need spring's data-jpa for our project. We use it to connect to any database (available to spring data library) and it will help us on the way, when we want to perform database operations (e.g. create, read, update and delete aka CRUD). There were also numerious other ways for connecting and operating on a database in dark times (and sadly we still need them to write native queries) such as JDBC (Java Database Connectivity) library.  
						</li>
						<li>
							Now that we have certain knowledge about what tools we're going to use for database, let's see for what database we'll use it for. As you can see in the technologies used section, we're going to connect to an inmemory database called h2. It comes really handy when you want to do POCs, or fast spikes on certain library or a framework. 
						</li>
						<li>
							Totaly unrelated but necessary, spring boot web library, to perform operations on REST controller level. This will be our entry point to our API. Users will be able to see and perform certain operations and manipulate database (not directly, but we'll come to that). 
						</li>
						<li>
							We'll use springboot devtools to perform live reload.
						</li>
						<li>
							We'll use Lombok for shortening our job for example, implementing Getter-Setters, toString, hashCode methods, basically the code you won't need unless you want to initialize something.
						</li>
						<li>
							Model mapper is a very strong library to perform 'hard copy' of a pojo to an entity and vice versa. We'll use it for mapping our properties from those classes so that we won't need to implement a model mapper class expilicitly.
						</li>
					</ol>
				</p>
				<hr>
				<p>
				Use case: For this scenario, we want to implement a feature that will control user input before we write it to our database, even before hitting to the service layer. (I'm assuming we're on the same page on layered software architecture for spring framework).
				</p>
				<p>
					Project creation: 
					<img src="{{site.baseurl}}{{"/assets/img/skayikci-constraint-validation-project-structure.png"}}">
				</p>
				<p>
				I always start with deciding the database structure, it gives me an overall architecture of what I want to perform.
				Adding h2 library to your gradle file will automatically create a database for you. To create your database, you'll need to create data.sql and schema.sql files. So I'll go ahead and create two files:
				<div class="path">/src/main/resources/schema.sql</div>
{% highlight sql lineos%}
DROP TABLE IF EXISTS TBL_USERS;
CREATE TABLE TBL_USERS
(
    id  NUMERIC AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(250) NOT NULL,
    surname  VARCHAR(250) NOT NULL,
    user_name     VARCHAR(250) DEFAULT NULL
);

{% endhighlight %}	
				<div class="path">/src/main/resources/data.sql</div>
{% highlight sql lineos%}
INSERT INTO TBL_USERS (name, surname, user_name)
VALUES ('Lorem', 'Ipsun', 'loremipsum'),
       ('Dolor', 'Sit', 'dolorsit'),
       ('Amet', 'Consectetur', 'ametconsectetur');

{% endhighlight %}	
				</p>
				<p>
					Let's write necessary information to our yml file so that we can connect to them from hibernate.
				<div class="path">/src/main/resources/application.yml</div>
{% highlight yml lineos%}
spring:
  #part-1
  datasource:
    url: jdbc:h2:mem:testdb
    # temporary data storage
    driverClassName: org.h2.Driver
    username: sa
    password: password
    platform: h2
    initialization-mode: embedded
  jpa:
    database-platform: org.hibernate.dialect.H2Dialect
    hibernate:
      ddl-auto: none

  #part-2
  h2:
    console:
      enabled: true
      path: /h2-console
      settings:
        trace: true
        web-allow-others: false
{% endhighlight %}	
					Here are the parts for this file:
					<ul>
						<li>Data source section is about connection properties of the database.</li>
						<li>
							<div class="yml-container">
								<div class="yml-property">url</div>
								<div class="yml-description"> Connection url for the JDBC connection. While we don't use JDBC, behind the curtains Hibernate needs this information to perform database operations.</div>
							</div>
						</li>
						<li>
							<div class="yml-container">
								<div class="yml-property">driverClassName</div>
								<div class="yml-description">Type of the driver you want to use for database connection.</div>
							</div>
						</li>
						<li>
							<div class="yml-container">
								<div class="yml-property">database-platform</div>
								<div class="yml-description">You can specify here which sql provider you want to use.</div>
							</div>
						</li>
						<li>
							<div class="yml-container">
								<div class="yml-property">ddl-auto</div>
								<div class="yml-description">If you want to control creating the schema and the data, then you need to set this property to none. For other options <a href="https://docs.spring.io/spring-boot/docs/current/reference/html/howto.html#howto-initialize-a-database-using-spring-jdbc" target="_blank">see here</a></div>
							</div>
						</li>
						<li>
							In part2, you can see the properties related to h2 database.
							<div class="yml-container">
								<div class="yml-property">enabled</div>
								<div class="yml-description">You can activate/deactivate h2 console and play around the database from http://localhost:8082/h2-console.</div>
							</div>
						</li>
					</ul>
				</p>
				<p>
					Now that we have some background information about the frameworks and libraries we used, let us now, see how to use it in our code.
					<hr>
					<p>
						We create the entity after we know how the table looks like, while stragiht forward, we still see some in depth usage of Lombok. (See @Data, @Getter and @Setter)
					</p>
{% highlight java lineos%}
//imports removed for clarity
@Data
@Table(name = "TBL_USERS")
@Entity
@Getter
@Setter
public class User {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY) // for testing
    private Long id;
    private String name;
    private String surname;
    private String userName;
}
{% endhighlight %}	
				</p>
				<p>
					We'll use JpaRepository to access database. We added existsUserByUserName method to validate if the user exists, and findAll as from its name, to find all users in the database. It comes really handy to use "exists" methods, and IntelliJ really helps you with this with its fantastic code completion.
{% highlight java lineos%}
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Page<User> findAll(Pageable pageable); // for better performance
    boolean existsUserByUserName(String userName); // for validation
}
{% endhighlight%}
				</p>
				<p>
					What's next is the service layer. We won't access to the Data layer directly. Unless you don't have a valid reason for it, we must use service layer for our business logic. I also use this class to convert to and from entity classes.
{% highlight java lineos%}
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    public Page<UserDTO> getAllUsers(Pageable pageable) {
        return mapToDTO(userRepository.findAll(pageable));
    }

    public boolean existsUserByUserName(String userName){
        return userRepository.existsUserByUserName(userName);
    }

    public UserDTO create(UserDTO userDTO) {
        return convertEntityToDTO(userRepository.save(convertDTOToEntity(userDTO)));
    }

    private Page<UserDTO> mapToDTO(Page<User> users) {
        return users.map(UserDTO::fromEntity);
    }

    private User convertDTOToEntity(UserDTO userDTO) {
        return modelMapper.map(userDTO, User.class);
    }

    private UserDTO convertEntityToDTO(User user) {
        return modelMapper.map(user, UserDTO.class);
    }
}

{% endhighlight%}					
				</p>
				<p>
					One step closer to our controller, the DTO is the main class we'll use to communicate between our API and UI. There is mainly one reason for now, that I can tell you is: security. You don't want to share or send Id or any other secure information from the request. Although too ideantical, you see that we don't use "id" field and we set a validator on userName. So that, if the user expects to create a user with the same username, will end up with an error.
{% highlight java lineos%}
@Getter
@Setter
public class UserDTO {
    String name;
    String surname;
    @UsernameUnique//for validation :)
    String userName;

    public static UserDTO fromEntity(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setUserName(user.getUserName());
        userDTO.setSurname(user.getSurname());
        userDTO.setName(user.getName());

        return userDTO;
    }
}
{% endhighlight%}
				</p>
				<p>
					Here we are, the last point. The API. You can also enrich the look or documentation with <a href="https://swagger.io/" target="_blank">swagger</a> . Here, I also used @RequiredArgsConstructor from Lombok. It will help you autowire the dependencies (for Dependency Injection), so that it will lazy load the classes for you. Of course, you need to write "private final" to make sure the state will not change for the class, during class initiation.
{% highlight java lineos%}
@RestController // for better responseBodies :)
@RequestMapping("/users")
@RequiredArgsConstructor // for better autowiring
public class UserController {

    private final UserService userService;

    @GetMapping
    public Page<UserDTO> getAllUsers(Pageable pageable) {
        return userService.getAllUsers(pageable);
    }

    @PostMapping
    public ResponseEntity<String> createUser(@Valid @RequestBody UserDTO userDTO) {
        userService.create(userDTO);
        return ResponseEntity.ok().build();
    }

}

{% endhighlight%}
				</p>
				<p>
					Now that we have everything to write something to the database, we need to validate them, right? There's the classes for it. I'm using ConstraintValidator from javax package so that the library will contain necessary information to validate the certain field. But we need to point out where it should look at, a field? a method? a class? In UserDto.java, you already saw the annotation. So that we need to annotate in a class, which field we want to validate.
{% highlight java lineos%}
@Component
@RequiredArgsConstructor
public class UsernameUniqueValidator implements ConstraintValidator<UsernameUnique, String> {

    private final UserService userService;

    @Override
    public boolean isValid(String userName, ConstraintValidatorContext context) {
        return !userService.existsUserByUserName(userName); // guess what happens if the user exists :)
    }
}

{% endhighlight%}	
				<p>
					This is how we should defined our annotation. Of course, for example I put the "Targets". But we will only need Field for our example, because we only want to validate userName.
{% highlight java lineos%}
@Target({ FIELD, METHOD, PARAMETER, ANNOTATION_TYPE })
@Retention(RUNTIME)
@Constraint(validatedBy = UsernameUniqueValidator.class)
@Documented
public @interface UsernameUnique {
    String message() default "Username already exists";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

{% endhighlight%}	
				</p>	
				</p>
				<hr>
				<p>
					That's it...We learned how to write custom validations and how to use them. Even on the first volume, we wrote a test for it (there's the same test in the project). Now that we learned it, let's try it!..
				</p>
				<div style="width:100%;height:0;padding-bottom:69%;position:relative;"><iframe src="https://giphy.com/embed/raLs6VW04mYDe" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/gifs/moonlighting-david-addison-maddie-hayes-raLs6VW04mYDe">via GIPHY</a></p>
			</div>
		</div>
	</div>
</div>


