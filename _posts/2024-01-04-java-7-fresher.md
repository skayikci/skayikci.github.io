---
layout: post
title: Fresher Series
date:  2024-01-4 22:22 +0200
categories: [Technical,Freshers]
tags: [java 7, new features]
---

<div class="header">
	<div class="row">
		<div class="column">
			<div class="volume_title">Vol #1</div>
		</div>
	</div>
	<div class="row"> 
		<div class="column">
			<div class="last_updated">04.01.2024 22:58</div>
		</div>
	</div>
	<div class="row">
		<div class="column">
			<div class="summary">
				It's been a while since i wanted to go back and do a fresher, and see if i missed using a new feature, 
                which was available already. I saw already there are some, and maybe for you too.
			</div>
		</div>
	</div>
</div>
<div class="content">
	<div class="row">
		<div class="column">
			<div class="technologies_used">
				<ul class="technology_list">
					<li class="technology">Java 7</li>
				</ul>
			</div>
		</div>
	</div>
	<hr>
</div>

A lot will be some code examples here. So here they are:

 The most famous new features are as follows:
 1. Strings in switch
 2. Multiple exception handling
 3. Try with resources
 4. Enhanced For loop
 5. Type inference
 6. Diamond Operator
 7. Binary literals
 8. Underscore literals
 9. More precise rethrowing exceptions
 10. Simplified varargs method declarations

<hr>
#### Strings in switch

Beforehand it wasn't possible to use Strings in switch statements. We were able to use integers, and boolean for example:

```java

List<Integer> values = new ArrayList<Integer>();
values.add(1);
values.add(2);
values.add(3);
for (int i = 0; i < values.size(); i++) {
   Integer value = values.get(i);
   switch(value % 2) {
       case 0:
           System.out.println(value + " is an even number!!" );
           break;
       default:
           System.out.println(value + " is odd number!!!");
    }
}
```

with Java 7, we are able to write Strings in switch statements:

```java
List<String> strings = new ArrayList<String>();
strings.add("Accounting");
strings.add("IT");
strings.add("HR");
strings.add("Hi");

for (int i = 0; i < strings.size(); i++) {
    String value = strings.get(i);
    switch(value) {
        case "Accounting" :
            System.out.println("callAccounting()");
            break;
        case "IT":
            System.out.println("callIT()");
            break;
        case "HR":
            System.out.println("callHR()");
            break;
        default:
            System.out.println("Unknown department!");
    }
}
```
<hr>


#### Multiple exception handling

Our second topic is multiple exception handling. Before Java 7 you would only do:

```java
try {
     String[] stringArray = new String[2];
     stringArray[0] = "First String";
     stringArray[1] = "Second String";
     stringArray[2] = "Third String?"; // !some ides already warn you about the problem!

     // you will need to comment out the line above to throw this.
     stringArray[0] = null;
     System.out.println(Arrays.toString(stringArray[0].split(",")));
 } catch (IndexOutOfBoundsException ex) {
     // handle ex
     System.out.println("The operation for adding an element to array gets out of bounds");
     // warn the user with proper exception handling
     // return500(ex);
 } catch (NullPointerException ex) {
     // handle ex
     System.out.println("The operation for adding an element to array gets out of null pointer exception");
     // warn the user with proper exception handling
     // return500(ex);
 }
```
<hr>

#### Try with resources

Before java 7 we would need to close the open files (read resources) , for example in a 'finally' block:

```java

BufferedReader reader = new BufferedReader(new FileReader("example.txt"));
try {
    while (reader.ready()) {
        String line = reader.readLine();
        if (line.equals("EOF")) {
            break;
        }
        System.out.println(line);
    }
} catch (Exception ex) {
    System.out.println("Exception occurred! " + ex.getMessage());
} finally {
    reader.close();
    System.out.println("File is closed!");
}
```

Now after java 7 , it is possible to control the closing of the files in the try block.

```java
try (BufferedReader withResources = new BufferedReader(new FileReader("example2.txt"))) {
    while (withResources.ready()) {
        String line = withResources.readLine();
        if (line.equals("EOF")) {
            break;
        }
        System.out.println(line);
    }
} catch (Exception ex) {
    System.out.println("Exception occurred! " + ex.getMessage());
} finally {
    System.out.println("File is closed!");
}

```
<hr>
#### Enhanced for loop

Before java 7, you could only write for statements like this:
```java
List<String> strings = new ArrayList<String>();
strings.add("Accounting");
strings.add("IT");
strings.add("HR");
strings.add("Hi");
for (int i = 0; i < strings.size(); i++) {
    System.out.println("Value: " + strings.get(i));
}
```

Now it is possible to iterate over a list or an array in for-each manner:
see how clean and index-free it is?

```java
for (String value : strings) {
    System.out.println("Value: " + value);
}
```

<hr>

#### Type inference and diamond operator

Before java 7, you could only write generic types like this:

```java
List<String> strings = new ArrayList<String>();
strings.add("Accounting");
strings.add("IT");
strings.add("HR");
strings.add("Hi");
```
After java 7, you can also write it like this, as long as the compiler can infer the type:

```java
List<String> stringsInferred = new ArrayList<>();
stringsInferred.add("Accounting");
stringsInferred.add("IT");
stringsInferred.add("HR");
stringsInferred.add("Hi");
```

<hr>

#### Binary and underscore literals

```java
// beforehand you wouldn't be able to implement a binary directly from a field value,
// so you could only do it either with your own algorithm, or some string magic.
// with java 7:
int binaryFive = 0b101;
int humanReadableFive = 5;
System.out.println("Binary value: " + binaryFive);
System.out.println("Human readable value: " + humanReadableFive);
System.out.println("Is Binary value and Human readable value equal?: " + (binaryFive == humanReadableFive));

// you could also not read the numbers easily, if you have more than 6 figures.
int aBillion = 1000000000;
// with java 7 it is much more readable, isn't it?
int aBillionWithUnderscore = 1_000_000_000;
System.out.println("Previously : " + aBillion);
System.out.println("After Java 7 : " + aBillionWithUnderscore);
System.out.println("Is the previous and java 7 version equal? : " + (aBillion == aBillionWithUnderscore));
```

<hr>

#### Precise rethrowing exceptions
Before java 7 it was only possible to write the class "Exception" , even though you would throw more than one exception (not at once)

```java
public static void main(String[] args) throws Exception {
    //before();
    after();
}

private static void before() throws Exception { // ide nowadays also warns you, sonarlint plugin rocks!
    try {
        String[] strings = new String[1];
        strings[0] = "Hello";
       // strings[1] = "World?"; // this will throw index out of bounds exception for sure.

        // and this will throw a file not found exception
        BufferedReader reader = new BufferedReader(new FileReader("example.txt"));
        reader.close();
    } catch (Exception e) {
        throw e;
    }
}

private static void after() throws IOException, IndexOutOfBoundsException {
    try {
        String[] strings = new String[1];
        strings[0] = "Hello";
        strings[1] = "World?"; // this will throw index out of bounds exception for sure.

        // and this will throw a file not found exception
        BufferedReader reader = new BufferedReader(new FileReader("example.txt"));
        reader.close();
    } catch (Exception e) {
        throw e;
    }
}
```

<hr>

#### Simplified Varargs
```java
public static void main(String[] args) {
    // before java 7 you wouldn't be able to do this:
    List<String> strings = new ArrayList<>();
    strings.add("Accounting");
    strings.add("IT");
    strings.add("HR");
    strings.add("Hi");

    printer(strings);

    printingInputs("This");
    printingInputs("This", "is");
    printingInputs("This", "is", "how");
    printingInputs("This", "is", "how", "we");
    printingInputs("This", "is", "how", "we", "do");
    printingInputs("This", "is", "how", "we", "do", "it");
}

private static void printingInputs(String... strings) {
    System.out.println(Arrays.toString(strings));
}

@SafeVarargs
private static void printer(List<String>... strings) {
    System.out.println(strings[0].get(0));
}
```

That's a wrap! See you next time, and as always, let me know i did a mistake
<iframe src="https://giphy.com/embed/kd9BlRovbPOykLBMqX" width="480" height="480" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/OnceInHollywood-leonardo-dicaprio-leo-kd9BlRovbPOykLBMqX">via GIPHY</a></p>