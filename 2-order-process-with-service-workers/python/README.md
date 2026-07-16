# Python worker

Job workers for the order-process example, built on `camunda-orchestration-sdk`. **Officially supported, production-ready.**

See the [parent README](../README.md) for the full walkthrough (starting the local cluster, deploying and starting the process instance from Camunda Modeler). This README only covers the Python-specific setup.

Full step-by-step guide: [docs.camunda.io/docs/guides/getting-started-example](https://docs.camunda.io/docs/guides/getting-started-example/) (Python/C# additions pending merge in [camunda/camunda-docs#9403](https://github.com/camunda/camunda-docs/pull/9403); the URL is stable).

## Prerequisites

- Python 3.10+
- pip

## Run

```bash
cd python
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

Stop with Ctrl+C.

## Test

```bash
cd python
source .venv/bin/activate
pip install -r requirements-test.txt
pytest
```

`camunda-orchestration-sdk` has no ephemeral-engine test harness yet (unlike java/nodejs's `camunda-process-test`), so `test_workers.py` drives the real REST API — it requires a running local cluster (`c8ctl cluster start`) before you run `pytest`.
