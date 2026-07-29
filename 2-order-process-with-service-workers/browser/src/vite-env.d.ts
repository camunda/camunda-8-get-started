/// <reference types="vite/client" />

declare module "*.bpmn?raw" {
  const content: string;
  export default content;
}
