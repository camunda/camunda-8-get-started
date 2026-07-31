import type { JobHandler } from "@nanobpm/bojtos-react";

/**
 * The three service workers for the order process, one per BPMN task type.
 *
 * These are the exact same three task types as the Node.js example
 * (`../../nodejs/source/workers.ts`) — `check-inventory`, `charge-payment` and
 * `ship-items` — but written as in-browser handlers. Instead of calling
 * `job.complete(vars)` against a Camunda 8 cluster, an in-browser handler simply
 * **returns** the variables to merge onto the process instance (or throws to
 * fail the job). Everything else — the token moving task-to-task, the variables
 * updating — is the real engine, running on WebAssembly.
 *
 * Each entry is the source text shown in a Monaco editor on the page. Edit it,
 * hit **Run**, and watch the process react.
 */

export interface WorkerDef {
  /** The BPMN `zeebe:taskDefinition type` this handler serves. */
  type: string;
  /** The service-task name, for display. */
  label: string;
  /** The default editable handler source (an arrow-function expression). */
  source: string;
}

const CHECK_INVENTORY = `async (job) => {
  // The starting variables flow in on 'job.variables'.
  const item = job.variables.item ?? "default-item";
  const quantity = Number(job.variables.quantity ?? 1);

  // Pretend to check a warehouse (the Node.js worker waits 2000ms here).
  await new Promise((resolve) => setTimeout(resolve, 500));

  // For demo purposes: large orders are always out of stock.
  if (quantity >= 10) {
    return { item, inStock: false };
  }

  // Whatever you return is merged onto the process instance's variables.
  return { item: item + " allocated", inStock: true };
}`;

const CHARGE_PAYMENT = `async (job) => {
  if (job.variables.inStock === false) {
    throw new Error("Item is out of stock; payment not charged.");
  }

  const quantity = job.variables.quantity ?? 1;
  const unitPrice = 25; // try changing this and re-running

  await new Promise((resolve) => setTimeout(resolve, 500));

  return { charged: true, amountCharged: quantity * unitPrice };
}`;

const SHIP_ITEMS = `async (job) => {
  if (job.variables.inStock === false) {
    throw new Error("Item is out of stock; nothing to ship.");
  }

  await new Promise((resolve) => setTimeout(resolve, 500));

  // Throw to fail the job and raise an incident on the diagram — try it!
  return { shipped: true, tracking: "1Z" + Math.floor(Math.random() * 1e9) };
}`;

const GENERIC_HANDLER = (taskType: string, taskLabel: string) => `async (job) => {
  // Variables from the process instance are available on 'job.variables'.
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Return an object to merge variables back into the instance.
  return { "${taskType}Result": "${taskLabel} completed" };
}`;

const KNOWN_SOURCES: Record<string, string> = {
  "check-inventory": CHECK_INVENTORY,
  "charge-payment": CHARGE_PAYMENT,
  "ship-items": SHIP_ITEMS,
};

export function defaultSourceForTask(type: string, label: string): string {
  return KNOWN_SOURCES[type] ?? GENERIC_HANDLER(type, label);
}

export const WORKER_DEFS: WorkerDef[] = [
  {
    type: "check-inventory",
    label: "Check inventory",
    source: defaultSourceForTask("check-inventory", "Check inventory"),
  },
  {
    type: "charge-payment",
    label: "Charge payment method",
    source: defaultSourceForTask("charge-payment", "Charge payment method"),
  },
  {
    type: "ship-items",
    label: "Ship items",
    source: defaultSourceForTask("ship-items", "Ship items"),
  },
];

/** The starting payload — identical to the Node.js example's seed. */
export const SEED_VARIABLES = { item: "camunda-t-shirt", quantity: 3 };

/**
 * Compile a handler's editor source into a runnable {@link JobHandler}. The
 * source is an arrow-function expression; a syntax error (or a value that isn't
 * a function) throws, which the page surfaces next to the editor.
 */
export function compileHandler(source: string): JobHandler {
  const factory = new Function(`"use strict"; return (${source});`);
  const handler = factory();
  if (typeof handler !== "function") {
    throw new Error("Worker code must evaluate to a function.");
  }
  return handler as JobHandler;
}
