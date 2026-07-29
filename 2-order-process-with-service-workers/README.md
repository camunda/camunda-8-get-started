# Getting Started with Camunda 8

This [demonstration project](https://github.com/camunda/camunda-8-get-started) allows you to get started with Camunda 8 - running a local instance of Camunda 8, deploying a process model from the Camunda Modeler, and starting an instance that is serviced by job workers using the Spring SDK (Java), the Node.js SDK (JavaScript), the Python SDK, or the C# SDK.

The Java, Node.js, and Python SDKs are officially supported and production-ready. The C# SDK is currently a **technical preview**.

Refer to the [Camunda Documentation](https://docs.camunda.io/docs/guides/getting-started-example/) for additional information.

## Download Demonstration Project

```bash
git clone https://github.com/camunda/camunda-8-get-started.git
```

## Download Camunder Modeler

The Camunda Modeler is a graphical tool for creating and editing BPMN process models.

Download the Camunda Modeler from the [Camunda download website](https://camunda.com/download/modeler/).

## Install `c8ctl`

```bash
npm install @camunda8/cli@alpha -g
```

## Start the local Camunda Cluster
JDK 21-25 Required.
```bash
c8ctl cluster start
```

## Start a process instance

1. Open Camunda Modeler
2. Open the file `bpmn/order-process.bpmn` from the example project.
3. Start a new process instance in the Modeler by clicking the Play icon in the bottom toolbar.

You can view the process instance in Operate, the visual operating tool, by going to [http://localhost:8080/operate](http://localhost:8080/operate). The login details are `demo`/`demo`.

There you will see an active process instance. (Note: when the workers are running, process instances will be completed immediately and further process instances will not appear as active).

## Run Node.js workers (if using JavaScript)

See [nodejs/README.md](nodejs/README.md) for details, including how to run the tests.

```bash
cd nodejs
npm i
npm start
```

## Run Java workers (if using Java)

See [java/README.md](java/README.md) for details, including how to run the tests.

```bash
cd java
mvn spring-boot:run
```

## Run Python workers (if using Python)

See [python/README.md](python/README.md) for details, including how to run the tests.

Requires Python 3.10+.

```bash
cd python
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

## Run C# workers (if using C#)

See [csharp/README.md](csharp/README.md) for details, including how to run the tests.

> **Technical preview**: the C# SDK is not yet officially supported for production use.

Requires the .NET 8 SDK (or later).

```bash
cd csharp
dotnet run
```

## Run it live in the browser (no cluster needed)

Want to see the process execute without installing a cluster at all? The
[browser/](browser/README.md) example runs a copy of this BPMN and the same
three task types entirely in your browser, on the WebAssembly build of the
nanobpm engine, with the worker code editable live in a Monaco editor.
(Requires Node.js 24+, unlike the Node.js worker stack above.)

```bash
cd browser
npm install
npm run dev
```

> This uses the open-source nanobpm engine, not the production Camunda 8 engine —
> a zero-setup way to *watch* a BPMN process run.
