---
layout: post
title: gRPC Java Server & Clients
date:  2020-06-15 20:55:00 +0200
categories: [Technical,Java]
---
<div class="header">
	<div class="row">
		<div class="column">
			<div class="volume_title">Vol #3</div>
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
				gRPC is not new (August 2016), yeah everything older than 2 years is not new! But it was new to me! So I decided to dive into it and shared my information from what I learned recently. 
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
					<li class="technology">Spring</li>
					<li class="technology">Gradle</li>
					<li class="technology">gRPC</li>
					<li class="technology">ruby (yes, Ruby!)</li>
				</ul>
			</div>
		</div>
	</div>
	<hr>
</div>

### tl;dr
Here is the code for [gRPC implementation:](https://github.com/skayikci/examples-repo) you'll see grpc-server, which is the server application, and grpc-clients which holds ruby and java clients. 

### What is RPC?
- Allows you to make calls not only in your own system but also in other systems (servers, address spaces, network connections).
- When Making RPC: 
    - Calling environment is suspended until it receives answer from the service. 
    - hen the service completes the execution of the request, it returns to the calling environment so that it can continue its operations, and server continues to wait for upcoming calls.

Following steps happen during a RPC:
1. Client invokes a client stub procedure, passes the parameters using the fields existing in this procedure. (Client stub exists in client’s own address space)
2. Client packs the message, converts the message to the common representation (also residing in the proc file). 
3. The client stub now being passed to transport layer and it’s been sent to remote server machine.
4. Remote server receives and transport layer passes the message to server stub, which unpacks the parameters and calls the desired method/server routine using the regular call mechanism.
5. When server completes procedure call, it returns to the server stub, which again packs/assigns the return values into the message. The server then transmit the message to transport layer.
6. Transport layer send the result message to client transport layer which hands back to the client stub.
7. The client stub unpacks the return parameters and execution returns to the caller.

### What is gRPC?
- Google owning RPC standard, for communiucation of services, clients in a much more designed and on a very good level of abstraction. You’ll never worry about the type you’re parsing, or what method you should call. You should know however, which procedures you need to perform before calling the method. 

### When to use gRPC?
Initially all micro services are connected with REST APIs. If any of the services are slow, the it will affect the whole system because REST does not supportt features like multiplexing or duplex streaming , REST APIs communicates each other with JSON, XML, etc. This makes the process very slow, memory consuming and non compressible. 

With gRPC , the services internal communicate each other, multiplexing, full duplex, and proto request/response makes gRPC much faster than REST. For now it is only internal communication but Google Works on grace-web to make it possible to work with external services too.

As general practice, we can use REST for external communication and gRPC for internal synchronous communication between internal microservices. Other snychronous messaging technologies such as RESTful services and GraphQL are more suitable for external facing services.

Steps to create gRPC?
By default, gRPC uses so called Protocol Buffers and it is structured around proto data format (it can also be defined as JSON). 

1. Define the structure of how your data will look like. A data is defined as “message”, and name-value pairs are called “fields”:
```
message Person {
	string name = 1;
	int32 i = 2;
	bool has_ponycopter = 3;
}
```
2. You can use “protoc” proto compiler to create data access classes in your preferred language (we’ll use java and ruby). You’ll see that protoc will generate access methods for each fields, (name(), set_name(), etc)
3. You define gRPC services in proto files with RPC method parameters and return types. 

```
service Greeter {
	rpc SayHello (HelloRequest) returns (HelloReply) {}
}

message HelloRequest {
	string name = 1;
}

message HelloResponse {
	string message = 1;
}
```

### build.gradle
We'll take advantage of Spring boot here. So first I go to one of my favourite websites: http://start.spring.io and create a project with following dependencies:
	- spring-boot-starter-web
	- lombok
	- devtools

And we hit the download button!👊

Now, we need to add certain dependencies of grpc to run our server, to generate our services, to understand grpc syntax and to create our grpc client (aka stub):
* grpc-netty
* grpc-services
* grpc-protobuf
* grpc-stub

Let's check  ([build.gradle](https://github.com/skayikci/examples-repo/blob/master/grpc-server/build.gradle)). The operation will be as follows: 
1. We'll need to create a proto file, which is a requirement for a standard gRPC implementation.
2. We'll generate and use created services in every client so we don't loose any data and we are always synched!

Next in gradle file:
*sourceSets* : we see here that there are directories showing where from read the proto file and where to write/generate the service files. 

*protobuf* : this is the part where we use the protoc - aka the proto compiler to compile our file and generate our services.

### hello.proto
In [hello.proto](https://github.com/skayikci/examples-repo/blob/master/grpc-server/src/main/proto/hello.proto) file, we're using the latest version for proto generation , if you leave it, it will use version 2. 
We'll end up with "rpc" path of the service, where we define our service method to perform a "SayHello" operation with "HelloRequest" and which will return a "HelloReply".  
Later in the file, we see that there are certain fields in request and response objects, we can think of them as DTOs.

### Let's generate services!
To generate services, we basically run this command:
```
gradle build
```
If you haven't done so, please download gradle, it is really handy. 
After we run this command, we see that a folder with following information has been created:
```
/generated-sources
	/main
		/grpc
			/com.example.grpcserver
				GreeterGrpc.java
		/java
			/com.example.grpcserver
				Hello.java
```

When we check the files, we see that there are not only related informations for the service methods but also the objects that will be used to perform those methods. *Hello.java* will keep the data objects, whereas *GreeterGrpc.java* will keep the methods for us to call.

### Why do I need them?
We need those "generated classes" to define what our service look like, what parameters it will need and what it will return after performing certain method.

So, I go ahead and create my own implementation of GreeterService (GreeterImplBase):
```java
public class GreeterServiceImpl extends GreeterGrpc.GreeterImplBase {  
  
    @Override  
  public void sayHello(  
            Hello.HelloRequest request, StreamObserver<Hello.HelloReply> responseObserver) {  
  
        String greeting = "Hello, " + request.getName();  
  
  Hello.HelloReply response = Hello.HelloReply.newBuilder()  
                .setMessage(greeting)  
                .build();  
  
  responseObserver.onNext(response);  
  responseObserver.onCompleted();  
  }  
}
```
We'll see that this is Reactive programming. We're getting an observer as an input then on it's next iteration, we send the response and then complete the observable. This also will give us the possibility to perform async operations (we don't need to wait for this operation to end).

### Service definition
As I said, we'll take advantage of Spring boot here, so once we don't need it, we simply hide its annotations and use gRPC - netty server for our application.
```java
//@SpringBootApplication  - hidden :)
public class GrpcServerApplication {  
  
   public static void main(String[] args) throws IOException, InterruptedException {  
      //SpringApplication.run(GrpcServerApplication.class, args);  - hidden :)
  Server server = ServerBuilder  
            .forPort(8080)  
            .addService(new GreeterServiceImpl()).build();  
  
  server.start();  
  server.awaitTermination();  
  }  
  
}
```

Running spring boot applications are easy, you just need to give the main class name to the ide and it will perform the rest. But hey, this is nothing but the same!
All we need to do is to configure correctly:
[Pic here]

### Client(s) 😎
We'll define two clients, one java, the other one will be ruby. Why? Because I want to! (And my second favourite language, that's why!😂)

1. We'll generate the client project the same way we did with our server application. 
2. We'll generate the files the same way as we did for the server
3. We add the client application configuration as show on the picture above.
4. Then we'll use it in our Java client as follows:

```java
@Slf4j  
public class GrpcClient {  
  
    public static void main(String[] args) {  
        ManagedChannel channel = ManagedChannelBuilder.forAddress("localhost", 8080)  
                .usePlaintext()  
                .build();  
  
  GreeterGrpc.GreeterBlockingStub stub = GreeterGrpc.newBlockingStub(channel);  
  
  Hello.HelloReply helloResponse = stub.sayHello(Hello.HelloRequest.newBuilder()  
                .setName("Serhat")  
                .build());  
  
  log.info("GreeterClient received response: " + helloResponse.getMessage());  
  channel.shutdown();  
  }  
}
```
* ManagedChannelBuffer will create a connection between the client and the server. 
* We then create our stub (client, message)
* In our request, we just want to set the name
* We log the response
* We close the connection channel (and the client application)
* When we run this application we'll see the output as:
```bash
21:56:46.130 [main] INFO com.grpc.clients.GrpcClient - GreeterClient received response: Hello, Serhat
```
* On the server side:
```bash
21:56:46.112 [grpc-nio-worker-ELG-3-3] DEBUG io.grpc.netty.NettyServerHandler - [id: 0x424b1823, L:/127.0.0.1:8080 - R:/127.0.0.1:63767] INBOUND HEADERS: streamId=3 headers=GrpcHttp2RequestHeaders[:path: /grpcserver.Greeter/SayHello, :authority: localhost:8080, :method: *POST*, :scheme: http, te: trailers, content-type: application/grpc, user-agent: grpc-java-netty/1.30.0, grpc-accept-encoding: gzip] streamDependency=0 weight=16 exclusive=false padding=0 endStream=false
```
## We did it for Java, now Ruby
I wanted to take this challenge too, because not only I like Ruby, but also very handy in quick setup for your personal projects, so why not? Maybe in the future, you'll use it for your polyglot microservice 😁

So again,  go to main directory and push:
```bash
grpc_tools_ruby_protoc -I ../../protos --ruby_out=/ruby --grpc_out=/ruby /proto/hello.proto
```
This will generate the service and data object files in the same directory as my *client to be* ruby file.
```ruby
#!/usr/bin/env ruby  
  
$LOAD_PATH.unshift(File.expand_path(__dir__))  
  
require 'grpc'  
require 'hello_services_pb'  
  
def main  
  user = ARGV.size > 0 ? ARGV[0] : 'world'  
  hostname = ARGV.size > 1 ? ARGV[1] : 'localhost:8080'  
  stub = Grpcserver::Greeter::Stub.new(hostname, :this_channel_is_insecure)  
  begin  
    message = stub.say_hello(Grpcserver::HelloRequest.new(name: user)).message  
    p "Greeting: #{message}"  
  rescue GRPC::BadStatus => e  
    abort "ERROR: #{e.message}"  
  end  
end  
  
main
```
* We'll use the grpc library therefore we added grpc, and hello_services_rb is the service definition.
* We'll pass 'world' to our service 
* our hostname will be localhost:8080 (where our server runs)
* We create an instance of our stub
* We call our say_hello method 
* We print the message
* And finally we handle any error occured.

How do I run it? (Make sure the server is running 😁)
```bash
ruby grpc-client.rb
```
And what does it show?

```bash
"Greeting: Hello, world"
```
Some adventure, huh?
<div style="width:100%;height:0;padding-bottom:56%;position:relative;"><iframe src="https://giphy.com/embed/btNkbIlH9B02Y" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/gifs/dress-adventure-middle-btNkbIlH9B02Y">via GIPHY</a></p>




Refs:
- Accessed: 14.06.2020 15:15 [Remote Procedure Call (RPC) in Operating System](https://www.geeksforgeeks.org/remote-procedure-call-rpc-in-operating-system)
- Accessed: 14.06.2020 15:53 [Why gRPC for Inter-Microservice Communication](https://dzone.com/articles/why-grpc-for-inter-microservice-communication)
- Accessed: 14.06.2020 15:45 [RPC Vs Simple Procedure Call - Georgia Tech - Advanced Operating Systems](https://www.youtube.com/watch?v=gr7oaiUsxSU)
- Accessed: 14.06.2020 15:00 [Overview, grpc](https://www.grpc.io/docs/what-is-grpc/introduction/)


