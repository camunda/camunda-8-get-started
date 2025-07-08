# Getting Started with Camunda 8

This [demonstration project](https://github.com/camunda/camunda-8-get-started) allows you to get started with Camunda 8 - running a local instance of Camunda 8, deploying a process model from the Camunda Modeler, and starting an instance that is serviced by job workers using either the Spring SDK (Java) or the Node.js SDK (Javascript).

## Download Demonstration Project

```bash
git clone https://github.com/camunda/camunda-8-get-started.git
```

## Download Camunder Modeler

The Camunda Modeler is a graphical tool for creating and editing BPMN process models.

Download the Camunda Modeler from the [Camunda download website](https://camunda.com/download/modeler/).

## Download Camunda 8 Run

Camunda 8 Run is a self-contained Java application that runs Camunda 8 locally. 

Download the latest 8.8 release of Camunda 8 Run from [the download page](https://downloads.camunda.cloud/release/camunda/c8run/).

Camunda 8 Run requires JDK 21-23.

See [here](https://docs.camunda.io/docs/self-managed/setup/deploy/local/c8run/) for more information on running Camunda 8 Run.

Start Camunda 8 Run. 

## Start a process instance

1. Open Camunda Modeler
2. Open the file `bpmn/diagram_1.bpmn` from the example project.
3. Start a new process instance in the Modeler by clicking the Play icon in the bottom toolbar.

You can view the process instance in Operate, the visual operating tool, by going to [http://localhost:8080/operate](http://localhost:8080/operate). The login details are `demo`/`demo`.

There you will see an active process instance. (Note: when the workers are running, process instances will be completed immediately and further process instances will not appear as active).

## Run Node.js workers (if using JavaScript)

```bash
cd nodejs
npm i
npm start
```

## Run Java workers (if using Java)

```bash
cd java
mvn spring-boot:run
```

