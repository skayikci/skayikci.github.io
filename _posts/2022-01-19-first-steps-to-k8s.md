---
layout: post
title: First steps to kubernetes
date:  2022-01-19 09:40:00 +0200
categories: [Technical,k8s]
tags: [kubernetes, k8s]
---

<div class="header">
	<div class="row"> 
		<div class="column">
			<div class="last_updated"></div>
		</div>
	</div>
	<div class="row">
		<div class="column">
			<div class="summary">
				I know, I'm a bit late to enter the wonders of kubernetes, but never say never. So I took the privilege to join the course from kodekloud and will try to in this miniseries what I've learned so far in the beginner's course. I'll assume that, you're the total beginner, like me. But it'd be nice if you have at least some knowledge about docker containers. 
			</div>
		</div>
	</div>
</div>
<div class="content">
	<div class="row">
		<div class="column">
			<div class="technologies_used">
				<ul class="technology_list">
					<li class="technology">Kubernetes</li>
				</ul>
			</div>
		</div>
	</div>
	<hr>
</div>

### First things first
I'm not going to fill here with a lot of information, instead I'll try to put as less as possible, and try to write in parts. 
In the first part, I want to focus on creating the first pod. 
For that, you'll need:
- A YAML file
- local kubernetes setup
- If you have a cloud setup already, it would also be great. I'd actually give kodekloud a try and use it.

#### How to setup kubernetes locally?
If you already have a MAC, this will be easy for you, since I'll focus the setup on MAC. For the rest, please follow the [official documentation](https://minikube.sigs.k8s.io/docs/start/).
- Go to the webpage https://minikube.sigs.k8s.io/docs/start/
- Download minikube : it is local Kubernetes , and makes it easy to learn and develop for it.
- Start your cluster : 
  ```bash
	$> minikube start
  ```
- Talk to your cluster:
  ```bash
	$> kubectl get po -A
  ```
- And enjoy.
- PS: Don't forget to stop it (minikube stop) once you're done with it, as it consumes memory.

### Buzzwords
It's all about buzzwords, right? That sticks to our minds, which talks to us, and gives us some ideas about what the main thing looks like.
You'll hear mostly about:
- YAML files
- Images
- Pods
- Nodes
- Services
- Controllers

What are these? What do they do? Let's talk about them one by one.

### Fundamentals
#### What problem does Kubernetes solve?
Kubernetes is not new (found in ), it was first used withing Google, then open sourced on ... But why should we use it?
1. Users expect zero downtime: 
   The application should stay up and running 24/7. When you work with a container orchestration like kubernetes, you can schedule nodes or
   processes accross many machines. This allows you to make the system much more robust.
2. Deploy without downtime:
   As operation engineers don't want to ring the alarms all the time, or getting customer calls about downtimes, they want a secure way to
   deploy the application.
3. Efficient way of using the cloud resources:
   This is probably the most important in the eyes of a financial department. They don't want to pay too much at the end of the month, the bills 
   of the cloud infrastucture. They want less amount of usage. Kubernetes ensures, that you can control what resources are on idle, not used. This
   way you can save the company from paying loads of money.
4. Improved reliability:
   With self-healing mechanisms, you'll see that the application is always running as you configured. Say, you want to setup a 2 instace service,
   you can configure that and Kubernetes will ensure even though one service goes down, the new service will take its place.
5. Automized scaling:
   Kubernetes, with its internal services, creates pods automatically and adds them to your nodes, whenever you've got to handle additional load.


#### YAML files
If you're a backend developer, and dealing with Spring boot applications and don't use the properties extensions, YAML files are a very good option to create structured configurations. They're actually consisting of: strings, arrays and lists. 

The importance here is that the indentation. If you don't care about it, you won't be able to run the application.
##### Comments
Comments are handy, when you want to look back and remind yourself what you've done :wink:
```yaml
# This is a comment
```

##### Datatypes
```yaml
john: this a string
# this is an array
tasks: ["build", "test", "run"] 
# this is also an array
days:
    - "Monday"
    - "Tuesday"
# this is a dictionary
# see that it is combination of array and key-value pairs
foo:
    bar:
        - drink
        - soda-pop
        - water
```

##### YAML files in kubernetes
In all YAML files, there is a standard (required) structure. The others are either optional or you write the pieces once you need them.

```yaml
apiVersion:
kind:
metadata:
spec:
```
<div class="content">
    <div class="row">
        <div class="column">
			<div class="codeProperties">
				<ul class="propertyList">
					<li><div class="property">apiVersion</div><div class="propertyDefinition">The version of the Kubernetes API that you want to use to create the object</div></li>
                    <li><div class="property">kind</div><div class="propertyDefinition">Type of the object</div></li>
                    <li><div class="property">metadata</div><div class="propertyDefinition">A unique name to identify the object, includes a name string, a UID and optional namespace</div></li>
                    <li><div class="property">spec</div><div class="propertyDefinition">State of the object: containers, memory requirements, port settings, storage volumes, etc.</div></li>
				</ul>
			</div>
		</div>
    </div>
</div>

##### A real world example
1. We'll create our first pod using yaml file. Let's call the file as pod.yaml and add the following properties.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-demo
  labels:
    purpose: demonstrate-command
spec:
  containers:
  - name: nginx
    image: nginx
  restartPolicy: Never

```
2. It's good and all that, but how do I run it, you say?
```bash
kubectl create -f pod.yaml
```

3. How about if I want to create the same pod without using a yaml file?
```bash
kubectl run nginx --image=nginx --restart=Never
```
Once you run this command, if you're not already running an nginx server, you'll see the following log:
```bash
pod/nginx created
```

4. Don't forget to remove the pods when you're done with them.
```bash
kubectl delete pod nginx
```

Refs:
- https://www.mirantis.com/blog/introduction-to-yaml-creating-a-kubernetes-deployment/
- https://www.fairwinds.com/blog/what-problems-does-kubernetes-solve