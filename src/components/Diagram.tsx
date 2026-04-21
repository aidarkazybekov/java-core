"use client";

import JvmArchitectureDiagram from "./diagrams/JvmArchitectureDiagram";

const REGISTRY = {
  "jvm-architecture": JvmArchitectureDiagram,
} as const;

export type DiagramName = keyof typeof REGISTRY;

export default function Diagram({ name }: { name: string }) {
  const Component = REGISTRY[name as DiagramName];
  if (!Component) return null;
  return <Component />;
}
