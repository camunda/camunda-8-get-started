# 🚀 Rocket Launch — Fully Automated Hello World

A process that runs **entirely on its own** — no forms, no user tasks, no workers.
Deploy it, start it with variables, and watch the engine do all the work in **Operate**.

## The story

You're mission control. You supply a crew name and a fuel level, then the engine handles the rest:

```
                                                              ┌─ [Burn stage 1]  ─┐
[Start] → [Pre-flight] → ◇ Systems go? ── GO 🟢 → ⏱ T-5 → [Plot dest] → ‖+ ─┤                   ├─ ‖+ → [Report] → (End 🎉)
                                     │                                     └─ [Run experiments] ─┘
                                     └── NO-GO 🔴 → [Abort] → (End ❌)
```

**Different inputs → different outcomes:**

| `fuelLevel` | What happens |
|---|---|
| `>= 50` | Launch proceeds — countdown timer fires, parallel tasks run |
| `> 75` | Destination set to **Mars** (5 experiments) |
| `50 – 75` | Destination set to **Moon** (3 experiments) |
| `< 50` | **Mission aborted** — process ends on the abort path |

## What you'll learn

| Concept | Where you'll see it |
|---|---|
| **Script Tasks with FEEL** | Six tasks that compute values inline — no external worker needed |
| **Exclusive Gateway (XOR)** | Routes GO vs NO-GO based on `systemStatus` |
| **Timer Intermediate Catch Event** | A 10-second countdown — watch the token wait in Operate! |
| **Parallel Gateway** | Engine + experiment tasks run simultaneously |
| **Default Sequence Flow** | The NO-GO path fires when no condition matches |
| **Process Variables** | `missionName`, `fuelLevel`, `destination`, `missionResult`, etc. |
| **Multiple End Events** | Success 🎉 or abort ❌ — different outcomes in the same process |

## Quick start

### 1. Start Camunda

```bash
c8ctl c8run start
```

### 2. Deploy

```bash
c8ctl deploy ./rocket-launch/
```

### 3. Launch a mission

```bash
# 🔴 Mars mission (fuel > 75) — full send
c8ctl create pi --id=rocket-launch \
  --variables='{"missionName":"Apollo","fuelLevel":80}'

# 🌕 Moon mission (fuel 50–75) — just enough to orbit
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
- ‖ **Parallel execution** — both "Burn stage 1" and "Run experiments" complete independently
- 📋 **Variables** — click an instance and inspect `destination`, `fuelAfterBurn`, `missionResult`

### 5. Check the result from the CLI

```bash
c8ctl list pi
```

## What's in this directory

| File | Purpose |
|---|---|
| `rocket-launch.bpmn` | The BPMN process — 6 FEEL script tasks, XOR + parallel gateways, timer event |
| `README.md` | This guide |

## FEEL expressions used

| Task | Expression | Output variable |
|---|---|---|
| Pre-flight check | `if fuelLevel >= 50 then "ALL SYSTEMS GO" else "ABORT"` | `systemStatus` |
| Abort mission | `"Mission " + missionName + " scrubbed — not enough fuel"` | `missionResult` |
| Plot destination | `if fuelLevel > 75 then "Mars" else "Moon"` | `destination` |
| Burn stage 1 | `fuelLevel - 25` | `fuelAfterBurn` |
| Run experiments | `if fuelLevel > 75 then 5 else 3` | `experimentsRun` |
| Mission report | `"Crew " + missionName + " reached " + destination + "!"` | `missionResult` |

## What to try next

- 🔁 **Run all three scenarios** — Mars, Moon, abort — and compare the paths in Operate
- ✏️  **Edit the FEEL expressions** — change the fuel threshold, add a new destination
- ⏱ **Change the timer** — edit `PT5S` to `PT30S` and watch the countdown in real time
- 🧪 **Add a new parallel branch** — try adding a third task inside the parallel block
- 👤 **Add a user task** — insert a manual approval step before launch (see `hello-camunda` example)
