# Getting Started with Camunda 8

This demonstration project allows you to get started with Camunda 8, running a local instance of Camunda 8, deploying a process model from the Camunda Modeler, and starting an instance that is serviced by job workers using either the Spring SDK (Java) or the Node.js SDK (Javascript).

## Download Camunder Modeler

The Camunda Modeler is a graphical tool for creating and editing BPMN process models.

Download the Camunda Modeler from the [Camunda download website](https://camunda.com/download/modeler/).

## Download C8Run

C8run is a self-contained Java application that runs Camunda 8 locally. 

Download the latest 8.8 release of c8run from [the c8run download page](https://downloads.camunda.cloud/release/camunda/c8run/).

See [here](https://docs.camunda.io/docs/self-managed/setup/deploy/local/c8run/) for information on prerequisites for running c8run.

## Start a process instance

1. Open Camunda Modeler
2. Open the file `bpmn/diagram_1.bpmn`
3. Start a new process instance

## Run Node.js workers

```bash
cd nodejs
npm i
npm start
```

## Run Java workers

```bash
cd java
mvn spring-boot:run
```

# Creating a new project from scratch

```
mkdir project
cd project
npm init -y
npx tsc --init
npm i @camunda8/sdk
```