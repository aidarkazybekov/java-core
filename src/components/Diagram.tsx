"use client";

import JvmArchitectureDiagram from "./diagrams/JvmArchitectureDiagram";
import HashMapInternalsDiagram from "./diagrams/HashMapInternalsDiagram";
import ThreadLifecycleDiagram from "./diagrams/ThreadLifecycleDiagram";
import StreamPipelineDiagram from "./diagrams/StreamPipelineDiagram";

const REGISTRY = {
  "jvm-architecture": JvmArchitectureDiagram,
  "hashmap-internals": HashMapInternalsDiagram,
  "thread-lifecycle": ThreadLifecycleDiagram,
  "stream-pipeline": StreamPipelineDiagram,
} as const;

export type DiagramName = keyof typeof REGISTRY;

export default function Diagram({ name }: { name: string }) {
  const Component = REGISTRY[name as DiagramName];
  if (!Component) return null;
  return <Component />;
}
