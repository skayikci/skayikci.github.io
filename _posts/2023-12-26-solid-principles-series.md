---
layout: post
title: Solid principles series
date:  2023-12-26 20:56 +0200
categories: [Technical,SOLID]
tags: [solid, software architecture]
---
<div class="header">
	<div class="row">
		<div class="column">
			<div class="volume_title">Vol #1</div>
		</div>
	</div>
	<div class="row"> 
		<div class="column">
			<div class="last_updated">26.12.2023 20:58</div>
		</div>
	</div>
	<div class="row">
		<div class="column">
			<div class="summary">
				While I was working on the software , I saw that it is often disregarded, and I wanted to talk about this during the daily stand ups, retros and other team internal meetings. So I first dived into the details and discussed the advantages. Most of the team mates were on board with me, but 
                the management wasn't. And when the date came, for adding new features, we had to change a lot and guess what? The project postponed indefinitely. 
			</div>
		</div>
	</div>
</div>
<div class="content">
	<div class="row">
		<div class="column">
			<div class="technologies_used">
				<ul class="technology_list">
					<li class="technology">Java 21</li>
					<li class="technology">JUnit 5</li>
				</ul>
			</div>
		</div>
	</div>
	<hr>
</div>

### tl;dr 
Do you want to end up like this? Imagine this is not a story anymore, but your reality. How could you resolve the issues on the portion of the code without breaking the logic? And even not breaking the unit tests? Apply SOLID principles. Please keep in mind that you should already know about the basics about the OOP (encapsulation, inheritance, polymorphism, and abstraction)

### What is SOLID anyway?
SOLID is :
Single Resposibility
Open/Closed Principle
Liskov Substitution Principle
Interface Segregation Principle
Dependency Inversion Principle

On this first part, we will discuss about Single Responsibility and Open/Closed Principle.

### Single Responsibility
As the name implies, the responsibility of a class should have only one responsibility. 
Say you have a class, Shape. What would you expect from this class? 
<ul>
    <li>Calculate the are of the shape?</li>
    <li>Print the area?</li>
    <li>Define the logic behind the area calculation?</li>
</ul>

Exactly. None of the above. It just has to do exactly one of these, or maybe even take part of the polymorphism role.

### Open / Closed Principle
Text book definition says: "An interface should be open for extension but closed for modification"
So do whatever you can to comply with it, as it has some disadvantages (see below), for example:
<ul>
    <li>Use interfaces in order to move the methods to one place</li>
    <li>Apply static and dynamic polymorphism so you don't need to create separate objects for every different class</li>
</ul>

#### Disadvantages of OCP
In principle:
<ul>
    <li>You might still need some toggles according to your business case (switch, if, etc)</li>
    <li>You can't always achieve OCP since there will always be modifications for that "specific" interface</li>
    <li>What makes it hardest principle is, the dependencies we will create might take time to determine and resolve, so make sure to spend a "resonable" amount of time on it</li>
</ul>

Let's look at the following example:
```java
public class Shape {
    public enum ShapeType {
        CIRCLE, SQUARE
    }

    private ShapeType type;
    private double radius;
    private double side;

    public Shape(ShapeType type, double value) {
        this.type = type;
        if (type == ShapeType.CIRCLE) {
            this.radius = value;
        } else if (type == ShapeType.SQUARE) {
            this.side = value;
        }
    }

    public double calculateArea() {
        if (type == ShapeType.CIRCLE) {
            return Math.PI * Math.pow(radius, 2);
        } else if (type == ShapeType.SQUARE) {
            return Math.pow(side, 2);
        }
        return 0;
    }

    public static void main(String[] args) {
        Shape circle = new Shape(ShapeType.CIRCLE, 5);
        Shape square = new Shape(ShapeType.SQUARE, 4);

        System.out.println("Circle Area: " + circle.calculateArea());
        System.out.println("Square Area: " + square.calculateArea());
    }
}
```

The above class has everything opposite of SOLID. Namely, Single responsibility and Open Closed Principle.
<ul>
    <li>The class Shape makes area calculation</li>
    <li>The class Shape makes printing of results</li>
    <li>The class Shape checks different types of shapes accordingly</li>
    <li>The class Shape holds informations such as: radius or side, so it knows a lot about the shapes</li>
    <li>When you want to add a new type, say pentagon, you have to update the whole code and update it everywhere</li>
</ul>


### How did I approach this?
<ul>
    <li>Separated the class Shape from the full logic by modifying it as an interface</li>
    <li>Created the classes Circle, and Square implemented Shape interface, and moved the logic related to the class to it</li>
    <li>Created the Main class, so that for calling the methods and used polymorphism in order to comply with not implementing types everywhere (like enum etc)</li>
</ul>

### My solution
```java
public class Main {
    public static void main(String[] args) {
        Shape circle = new Circle(5);
        Shape square = new Square(4);

        System.out.println("Circle Area: " + circle.calculateArea());
        System.out.println("Square Area: " + square.calculateArea());
    }
}
```

```java
public interface Shape {
    double calculateArea();
}
```

```java
public class Square implements Shape {
    private final double side;

    public Square(double side) {
        this.side = side;
    }

    @Override
    public double calculateArea() {
        return Math.pow(side, 2);
    }
}
```

```java
public class Circle implements Shape {
    private final double radius;

    @Override
    public double calculateArea() {
        return Math.PI * Math.pow(radius, 2);
    }

    public Circle(double radius) {
        this.radius = radius;
    }
}
```

This still can be improved, but might create other dependencies, for example,
<ul>
    <li>Could create interface for creating area, like AreaCalculator, then implement it in Circle and Square</li>
    <li>Could create implementation for printing the results</li>
</ul>
But as stated in the above disadvantages, these would still create dependencies.

### How did I test this?
I have created an output stream captor to read from the log statement, and checked if the results are equal as before.

```java
class ShapeTest {

    private final PrintStream standardOut = System.out;
    private final ByteArrayOutputStream outputStreamCaptor = new ByteArrayOutputStream();

    @BeforeEach
    public void setUp() {
        System.setOut(new PrintStream(outputStreamCaptor));
    }

    @Test
    void shouldCalculateAreaOfCircleCorrectly() {
        // given - when
        // previously Shape.main(new String[]{});
        Main.main(new String[]{});

        // then
        assertTrue(outputStreamCaptor.toString().contains("Circle Area: 78.53981633974483"));
    }

    @AfterEach
    public void tearDown() {
        System.setOut(standardOut);
    }
}
```

Refs:

Accessed: 26.12.2023 The Open-Closed Principle Explained https://reflectoring.io/open-closed-principle-explained/
Accessed: 26.12.2023 SOLID part 2: The Open Closed Principle https://giannisakritidis.com/blog/The-Open-Closed-Principle/


