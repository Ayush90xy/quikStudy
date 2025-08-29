import React, { useMemo } from 'react';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

function parseToMindmap(title, content) {
  const nodes = [];
  const edges = [];
  const centerId = 'center';
  nodes.push({ id: centerId, data: { label: title || 'Untitled' }, position: { x: 0, y: 0 }, style: { padding: 10, borderRadius: 12, border: '1px solid #e5e7eb', background: 'white' } });

  // Bullet points: lines starting with "- " or "* "
  const lines = content.split('\n').map(l => l.trim()).filter(Boolean);
  let i = 0;
  let radius = 200;
  const items = lines.filter(l => /^(-|\*)\s+/.test(l)).map(l => l.replace(/^(-|\*)\s+/, ''));

  const angleStep = (2 * Math.PI) / Math.max(1, items.length);
  items.forEach((text, idx) => {
    const id = `n-${i++}`;
    const angle = idx * angleStep;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    nodes.push({ id, data: { label: text }, position: { x, y }, style: { padding: 8, borderRadius: 10, border: '1px solid #e5e7eb', background: 'white' } });
    edges.push({ id: `e-${centerId}-${id}`, source: centerId, target: id, animated: false });
  });

  return { nodes, edges };
}

export default function Mindmap({ title, content }) {
  const { nodes, edges } = useMemo(() => parseToMindmap(title, content || ''), [title, content]);
  return (
    <div className="h-[480px] border rounded-2xl overflow-hidden">
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
