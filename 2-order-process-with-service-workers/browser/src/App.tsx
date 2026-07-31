import { useCallback, useMemo, useRef, useState } from "react";
import {
  BpmnRuntimeView,
  useBojtos,
  type JobHandler,
} from "@nanobpm/bojtos-react";
import Editor from "@monaco-editor/react";
import {
  AppHeader,
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@camunda/design-system";
import orderProcessBpmn from "./order-process.bpmn?raw";
import {
  compileHandler,
  SEED_VARIABLES,
  WORKER_DEFS,
} from "./workers";

/** Milliseconds the token pauses on each task, so the run is watchable. */
const BEAT = 850;
const FALLBACK_PROCESS_ID = "process1";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Stringify a worker's return value for the activity log without letting a
 * user-edited handler (e.g. one returning a circular object) throw and break the
 * run loop — this is a live-edit playground.
 */
function safeStringify(value: unknown, space?: number): string {
  try {
    return JSON.stringify(value ?? {}, null, space);
  } catch {
    return "[unserializable value]";
  }
}

function parseSeedVariables(source: string): Record<string, unknown> {
  const parsed = JSON.parse(source);
  if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") {
    throw new Error("Seed variables must be a JSON object.");
  }
  return parsed as Record<string, unknown>;
}

function summarizeSeed(source: string): string {
  const oneLine = source.replace(/\s+/g, " ").trim();
  return oneLine.length > 72 ? `${oneLine.slice(0, 72)}…` : oneLine;
}

interface LogEntry {
  id: number;
  kind: "start" | "task" | "done" | "vars" | "error";
  text: string;
}

export function App() {
  const [workerSources, setWorkerSources] = useState<string[]>(() =>
    WORKER_DEFS.map((d) => d.source),
  );
  const [seedSource, setSeedSource] = useState(() =>
    JSON.stringify(SEED_VARIABLES, null, 2),
  );

  const {
    phase,
    error,
    processIds,
    snapshot,
    createInstance,
    stepWorkers,
    reset,
  } = useBojtos({ bpmn: orderProcessBpmn });

  const [activeTab, setActiveTab] = useState(WORKER_DEFS[0].type);
  const [running, setRunning] = useState(false);
  const [showInputEditor, setShowInputEditor] = useState(false);
  const [compileError, setCompileError] = useState<string | null>(null);
  const [inputError, setInputError] = useState<string | null>(null);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [displayVars, setDisplayVars] = useState<Record<string, unknown>>({});

  const runningRef = useRef(false);
  const logIdRef = useRef(0);
  const logListRef = useRef<HTMLDivElement>(null);

  const pushLog = useCallback((kind: LogEntry["kind"], text: string) => {
    setLog((prev) => [...prev, { id: logIdRef.current++, kind, text }].slice(-40));
    queueMicrotask(() => {
      const el = logListRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }, []);

  const setSource = useCallback((index: number, value: string) => {
    setWorkerSources((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }, []);

  const run = useCallback(async () => {
    if (phase !== "ready" || runningRef.current) return;
    setInputError(null);
    setCompileError(null);

    let seedVariables: Record<string, unknown>;
    try {
      seedVariables = parseSeedVariables(seedSource);
    } catch (e) {
      setInputError(e instanceof Error ? e.message : String(e));
      return;
    }

    // Compile every editor first, so a syntax error is reported before we touch
    // the engine (and we can point at the offending worker).
    const workers: Record<string, JobHandler> = {};
    try {
      WORKER_DEFS.forEach((def, i) => {
        const handler = compileHandler(workerSources[i] ?? def.source);
        workers[def.type] = async (job) => {
          pushLog("task", `▶ ${def.label} — running ${def.type}`);
          const out = await handler(job);
          if (out && typeof out === "object") {
            setDisplayVars((prev) => ({ ...prev, ...(out as object) }));
          }
          pushLog(
            "vars",
            `↳ returned ${safeStringify(out)}`,
          );
          return out;
        };
      });
    } catch (e) {
      setCompileError(e instanceof Error ? e.message : String(e));
      return;
    }

    runningRef.current = true;
    setRunning(true);
    setLog([]);
    setDisplayVars({ ...seedVariables });
    try {
      // Fresh engine each run so completedInstances starts at 0.
      reset();
      const pid = processIds[0] ?? FALLBACK_PROCESS_ID;
      pushLog("start", `Order received — starting "${pid}"`);
      let snap = createInstance(pid, JSON.stringify(seedVariables));
      await sleep(BEAT);

      let guard = 0;
      while (runningRef.current && snap && snap.completedInstances < 1 && guard++ < 50) {
        const round = await stepWorkers(workers);
        snap = round?.snapshot ?? snap;
        if (!round || round.handled === 0) break;
        await sleep(BEAT);
      }

      if (snap && snap.completedInstances >= 1) {
        pushLog("done", "Order shipped ✅ — process instance completed");
      } else if (snap && snap.incidentElementIds.length > 0) {
        pushLog("error", "A worker failed — incident raised (see the red task)");
      }
    } finally {
      runningRef.current = false;
      setRunning(false);
    }
  }, [
    phase,
    seedSource,
    workerSources,
    processIds,
    createInstance,
    stepWorkers,
    reset,
    pushLog,
  ]);

  const stop = useCallback(() => {
    runningRef.current = false;
    setRunning(false);
    reset();
    setLog([]);
    setDisplayVars({});
  }, [reset]);

  const activeIds = snapshot?.activeElementIds ?? [];
  const incidentIds = snapshot?.incidentElementIds ?? [];
  const variables = displayVars;

  const statusBadge = useMemo(() => {
    if (phase === "loading")
      return <Badge variant="neutral">Booting engine…</Badge>;
    if (phase === "error") return <Badge variant="danger">Engine error</Badge>;
    if (running) return <Badge variant="info">Running…</Badge>;
    if (incidentIds.length > 0)
      return <Badge variant="danger">Incident</Badge>;
    if (snapshot && snapshot.completedInstances >= 1)
      return <Badge variant="success">Completed</Badge>;
    return <Badge variant="neutral">Ready</Badge>;
  }, [phase, running, incidentIds.length, snapshot]);

  return (
    <div className="c4-ui app-shell">
      <AppHeader
        appName="Order process"
        trailing={
          <span className="app-subtitle">running in your browser</span>
        }
        actions={
          <a
            className="header-link"
            href="https://github.com/camunda/camunda-8-get-started"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        }
      />

      <main id="main" className="layout">
        <section className="intro">
          <h1>The order process, running live on WebAssembly</h1>
          <p>
            This is the same BPMN and the same three service workers as the{" "}
            <code>nodejs/</code> example — but there is no Camunda 8 cluster here.
            The real nanobpm engine executes the process in your browser. Edit a
            worker's JavaScript and input values, hit <strong>Run</strong>, and
            watch the token move and the variables change.
          </p>
          <div className="controls">
            <Button onClick={run} disabled={phase !== "ready" || running}>
              ▶ Run
            </Button>
            <Button variant="secondary" onClick={stop} disabled={phase !== "ready"}>
              ↺ Reset
            </Button>
            {statusBadge}
            <button
              type="button"
              className="seed seed-button"
              onClick={() => setShowInputEditor((v) => !v)}
              disabled={running}
              title="Try changing input values and re-running"
            >
              <span className="seed-edit-icon" aria-hidden="true">✎</span>{" "}
              input: <code>{summarizeSeed(seedSource)}</code>
            </button>
          </div>
          {showInputEditor && (
            <div className="inline-input-editor">
              <div className="editor-meta editor-meta-actions">
                <div>
                  <strong>Input parameters</strong>{" "}
                  <code>JSON object</code>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => setShowInputEditor(false)}
                  size="sm"
                >
                  Done
                </Button>
              </div>
              <div className="editor-wrap">
                <Editor
                  height="120px"
                  defaultLanguage="json"
                  value={seedSource}
                  onChange={(v) => setSeedSource(v ?? "{}")}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 13,
                    scrollBeyondLastLine: false,
                    tabSize: 2,
                    automaticLayout: true,
                  }}
                />
              </div>
            </div>
          )}
          {phase === "error" && (
            <Alert variant="destructive">
              <AlertTitle>Failed to load the engine</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {compileError && (
            <Alert variant="destructive">
              <AlertTitle>Worker code didn't compile</AlertTitle>
              <AlertDescription>{compileError}</AlertDescription>
            </Alert>
          )}
          {inputError && (
            <Alert variant="destructive">
              <AlertTitle>Input variables are invalid</AlertTitle>
              <AlertDescription>{inputError}</AlertDescription>
            </Alert>
          )}
        </section>

        <div className="grid">
          <div className="col">
            <Card className="panel">
              <CardHeader>
                <CardTitle>Process</CardTitle>
                <CardDescription>
                  Live token (green) and incidents (red), rendered by bpmn-js.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {phase === "loading" ? (
                  <div className="diagram-fallback">Booting the engine…</div>
                ) : (
                  <BpmnRuntimeView
                    xml={orderProcessBpmn}
                    activeIds={activeIds}
                    incidentIds={incidentIds}
                    className="diagram"
                  />
                )}
              </CardContent>
            </Card>

            <div className="row">
              <Card className="panel grow">
                <CardHeader>
                  <CardTitle>Variables</CardTitle>
                  <CardDescription>The instance payload, live.</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="vars">
                    {safeStringify(variables, 2)}
                  </pre>
                </CardContent>
              </Card>

              <Card className="panel grow">
                <CardHeader>
                  <CardTitle>Activity</CardTitle>
                  <CardDescription>What each worker did.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="log" ref={logListRef}>
                    {log.length === 0 ? (
                      <div className="log-empty">Press Run to start.</div>
                    ) : (
                      log.map((e) => (
                        <div key={e.id} className={`log-line log-${e.kind}`}>
                          {e.text}
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="col">
            <Card className="panel editors">
              <CardHeader>
                <CardTitle>Service workers</CardTitle>
                <CardDescription>
                  Each handler serves one BPMN task type. Return variables to
                  merge, or throw to fail the job.
                </CardDescription>
              </CardHeader>
              <Separator />
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList>
                    {WORKER_DEFS.map((d) => (
                      <TabsTrigger key={d.type} value={d.type}>
                        {d.type}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {WORKER_DEFS.map((d, i) => (
                    <TabsContent key={d.type} value={d.type}>
                      <div className="editor-meta">
                        <strong>{d.label}</strong>
                        <code>type: {d.type}</code>
                      </div>
                      <div className="editor-wrap">
                        <Editor
                          height="260px"
                          defaultLanguage="javascript"
                          value={workerSources[i]}
                          onChange={(v) => setSource(i, v ?? "")}
                          options={{
                            minimap: { enabled: false },
                            fontSize: 13,
                            scrollBeyondLastLine: false,
                            tabSize: 2,
                            automaticLayout: true,
                          }}
                        />
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
