# 🚀 Rocket Launch — Fully Automated Hello World

A process that runs **entirely on its own** — no forms, no user tasks, no workers.
Deploy it, start it with variables, and watch the engine do all the work in **Operate**.

## The story

You're mission control. You supply a crew name and a fuel level, then the engine handles the rest:

- Start the launch sequence.
- Run a pre-flight check.
- Decide whether systems are GO or NO-GO.
- If GO, wait for the countdown, plot the destination, then run two tasks in parallel:
  - Burn stage 1
  - Run experiments
- Merge the parallel paths, generate the mission report, and complete the mission.
- If NO-GO, abort the mission and end the process.

**Different inputs → different outcomes:**

| `fuelLevel` | What happens |
|---|---|
| `>= 50` | Launch proceeds — countdown timer fires, destination is decided by DMN, then parallel tasks run |
| `>= 90` | Destination set to **Venus** (5 experiments) |
| `76 – 89` | Destination set to **Mars** (5 experiments) |
| `75` | Destination set to **Mars** (3 experiments) |
| `50 – 74` | Destination set to **Moon** (3 experiments) |
| `< 50` | **Mission aborted** — process ends on the abort path |

## What you'll learn

| Concept | Where you'll see it |
|---|---|
| **Script Tasks with FEEL** | Five tasks that compute values inline — no external worker needed |
| **Business Rule Task + DMN** | Destination is resolved via a decision table (`plot-destination.dmn`) |
| **Exclusive Gateway (XOR)** | Routes GO vs NO-GO based on `systemStatus` |
| **Timer Intermediate Catch Event** | A 10-second countdown — watch the token wait in Operate! |
| **Parallel Gateway** | Engine + experiment tasks run simultaneously |
| **Default Sequence Flow** | The NO-GO path fires when no condition matches |
| **Process Variables** | `missionName`, `fuelLevel`, `destination`, `missionResult`, etc. |
| **Multiple End Events** | Success 🎉 or abort ❌ — different outcomes in the same process |

## Quick start

The simplest way to interact with Camunda is using the CLI tool called `c8ctl`. It lets you start the engine, deploy processes, launch instances, and check the results — all from your terminal.

### 0. Install `c8ctl`

```bash
npm install -g @camunda/c8ctl
```

### 1. Start Camunda

```bash
c8ctl c8run start
```

### 2. Deploy

```bash
c8ctl deploy ./rocket-launch.bpmn ./plot-destination.dmn
```

### 3. Launch a mission

```bash
# 🟡 Venus mission (fuel >= 90) — maximum range
c8ctl create pi --id=rocket-launch \
  --variables='{"missionName":"Odyssey","fuelLevel":95}'

# 🔴 Mars mission (fuel 75–89) — full send
c8ctl create pi --id=rocket-launch \
  --variables='{"missionName":"Apollo","fuelLevel":80}'

# 🌕 Moon mission (fuel 50–74) — just enough to orbit
c8ctl create pi --id=rocket-launch \
  --variables='{"missionName":"Artemis","fuelLevel":60}'

# ❌ Aborted mission (fuel < 50) — not enough gas
c8ctl create pi --id=rocket-launch \
  --variables='{"missionName":"Icarus","fuelLevel":30}'
```

### 4. Watch in Operate

Open **http://localhost:8080** and find the `Rocket Launch 🚀` process.

**Things to look for:**
- ⏱ **Timer waiting** — the token pauses at "Countdown T-10" for 10 seconds. You can see it live!
- ◇ **Different paths** — compare a successful vs. aborted instance
- 📐 **DMN decision** — destination is set by `plot-destination` based on `fuelLevel`
- ‖ **Parallel execution** — both "Burn stage 1" and "Run experiments" complete independently
- 📋 **Variables** — click an instance and inspect `destination`, `fuelAfterBurn`, `missionResult`

### 5. Check the result from the CLI

```bash
c8ctl list pi
```

## What's in this directory

| File | Purpose |
|---|---|
| `rocket-launch.bpmn` | The BPMN process — script tasks, XOR + parallel gateways, timer event, and a Business Rule Task |
| `plot-destination.dmn` | Decision table used by the Business Rule Task to compute `destination` from `fuelLevel` |
| `README.md` | This guide |

## FEEL and DMN logic used

| Task | Expression | Output variable |
|---|---|---|
| Pre-flight check | `if fuelLevel >= 50 then "ALL SYSTEMS GO" else "ABORT"` | `systemStatus` |
| Abort mission | `"Mission " + missionName + " scrubbed — not enough fuel (" + string(fuelLevel) + "%)"` | `missionResult` |
| Plot destination (DMN) | `>= 90 -> "Venus"`, `>= 75 -> "Mars"`, `>= 50 -> "Moon"`, `< 50 -> "Earth"` | `destination` |
| Burn stage 1 | `fuelLevel - 25` | `fuelAfterBurn` |
| Run experiments | `if fuelLevel > 75 then 5 else 3` | `experimentsRun` |
| Mission report | `"Crew " + missionName + " reached " + destination + "! Fuel: " + string(fuelAfterBurn) + "%. Experiments: " + string(experimentsRun)` | `missionResult` |

Note: in the current BPMN flow, the decision is evaluated only on the GO path (`fuelLevel >= 50`), so the `< 50 -> "Earth"` DMN rule is not reached during normal process execution.

## What to try next

- 🔁 **Run all four destination scenarios** — Venus, Mars, Moon, abort — and compare the paths in Operate
- ✏️  **Edit FEEL + DMN logic** — tune fuel thresholds in script tasks and decision table rules
- ⏱ **Change the timer** — edit `PT10S` to `PT30S` and watch the countdown in real time
- 🧪 **Add a new parallel branch** — try adding a third task inside the parallel block
- 👤 **Add a user task** — insert a manual approval step before launch (see `hello-camunda` example)
