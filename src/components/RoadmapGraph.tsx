"use client";

import { motion } from "framer-motion";
import { ROADMAP } from "@/data/roadmap";
import { Block } from "@/lib/types";

interface RoadmapGraphProps {
  completed: Set<string>;
  selectedTopicId: string | null;
  onSelectTopic: (topicId: string) => void;
}

const NODE_RADIUS = 20;
const NODE_GAP = 56;
const ROW_HEIGHT = 56;
const BLOCK_PADDING_X = 24;
const BLOCK_PADDING_TOP = 48;
const BLOCK_PADDING_BOTTOM = 24;
const BLOCK_GAP = 32;
const MAX_PER_ROW = 5;

function getBlockLayout(block: Block) {
  const rows = Math.ceil(block.topics.length / MAX_PER_ROW);
  const topicsInFirstRow = Math.min(block.topics.length, MAX_PER_ROW);
  const width = topicsInFirstRow * NODE_GAP + BLOCK_PADDING_X * 2;
  const height = BLOCK_PADDING_TOP + rows * ROW_HEIGHT + BLOCK_PADDING_BOTTOM;
  return { rows, width, height };
}

export default function RoadmapGraph({
  completed,
  selectedTopicId,
  onSelectTopic,
}: RoadmapGraphProps) {
  const maxWidth = Math.max(...ROADMAP.map((b) => getBlockLayout(b).width));
  const totalHeight = ROADMAP.reduce(
    (sum, b) => sum + getBlockLayout(b).height + BLOCK_GAP,
    0
  );

  let yOffset = 20;
  const blockPositions: {
    block: Block;
    x: number;
    y: number;
    layout: ReturnType<typeof getBlockLayout>;
  }[] = [];

  for (const block of ROADMAP) {
    const layout = getBlockLayout(block);
    blockPositions.push({
      block,
      x: (maxWidth - layout.width) / 2,
      y: yOffset,
      layout,
    });
    yOffset += layout.height + BLOCK_GAP;
  }

  return (
    <div className="flex-1 overflow-auto flex justify-center p-8">
      <svg width={maxWidth + 40} height={totalHeight + 40} className="mx-auto">
        {blockPositions.slice(0, -1).map((bp, i) => {
          const next = blockPositions[i + 1];
          const cx = (maxWidth + 40) / 2;
          return (
            <line
              key={`conn-${i}`}
              x1={cx}
              y1={bp.y + bp.layout.height}
              x2={cx}
              y2={next.y}
              stroke="#27272a"
              strokeWidth={2}
              strokeDasharray="6 4"
            />
          );
        })}

        {blockPositions.map(({ block, x, y, layout }) => {
          const blockDone = block.topics.filter((t) =>
            completed.has(t.id)
          ).length;
          const allDone = blockDone === block.topics.length;

          return (
            <g key={block.id} transform={`translate(${x + 20}, ${y})`}>
              <rect
                x={0}
                y={0}
                width={layout.width}
                height={layout.height}
                rx={12}
                fill={allDone ? "#0f1a0f" : "#111114"}
                stroke={allDone ? "#1e3a2a" : "#1e1e24"}
                strokeWidth={1}
              />
              <text
                x={layout.width / 2}
                y={28}
                textAnchor="middle"
                fill={allDone ? "#4ade80" : "#a1a1aa"}
                fontSize={12}
                fontWeight={600}
                fontFamily="Inter, system-ui, sans-serif"
              >
                {block.icon} {block.title}
              </text>

              {block.topics.map((topic, i) => {
                const row = Math.floor(i / MAX_PER_ROW);
                const col = i % MAX_PER_ROW;
                const topicsInThisRow =
                  row === 0
                    ? Math.min(block.topics.length, MAX_PER_ROW)
                    : block.topics.length - MAX_PER_ROW;
                const rowWidth = topicsInThisRow * NODE_GAP;
                const rowStartX =
                  (layout.width - rowWidth) / 2 + NODE_GAP / 2;
                const cx = rowStartX + col * NODE_GAP;
                const cy =
                  BLOCK_PADDING_TOP + row * ROW_HEIGHT + NODE_RADIUS;
                const isDone = completed.has(topic.id);
                const isSelected = selectedTopicId === topic.id;

                return (
                  <g key={topic.id}>
                    <motion.circle
                      cx={cx}
                      cy={cy}
                      r={NODE_RADIUS}
                      fill={
                        isDone
                          ? "#4ade80"
                          : isSelected
                            ? "#22d3ee"
                            : "#18181b"
                      }
                      stroke={
                        isDone
                          ? "#4ade80"
                          : isSelected
                            ? "#22d3ee"
                            : "#27272a"
                      }
                      strokeWidth={isSelected ? 2 : 1}
                      className="cursor-pointer"
                      onClick={() => onSelectTopic(topic.id)}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                    />
                    <text
                      x={cx}
                      y={cy + 1}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={isDone ? "#000" : "#a1a1aa"}
                      fontSize={9}
                      fontWeight={500}
                      fontFamily="Inter, system-ui, sans-serif"
                      className="pointer-events-none select-none"
                    >
                      {topic.id}
                    </text>
                    <title>{topic.title}</title>
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
