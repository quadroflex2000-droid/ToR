'use client';

import { useDroppable } from '@dnd-kit/core';
import { PlusIcon } from '@heroicons/react/24/outline';

interface KanbanStage {
  id: string;
  name: string;
  order: number;
  color: string;
  items: any[];
}

interface KanbanColumnProps {
  stage: KanbanStage;
  children: React.ReactNode;
  onAddItem: () => void;
}

export default function KanbanColumn({ stage, children, onAddItem }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`bg-gray-50 rounded-lg p-4 min-h-96 transition-colors duration-200 ${
        isOver ? 'bg-gray-100' : ''
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
          <h3 className="font-semibold text-gray-900">{stage.name}</h3>
          <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
            {stage.items.length}
          </span>
        </div>
        
        <button
          onClick={onAddItem}
          className="p-1 hover:bg-gray-200 rounded transition-colors duration-200"
          title="Add new item"
        >
          <PlusIcon className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Column Content */}
      <div className="space-y-3">
        {children}
      </div>

      {/* Drop Zone Indicator */}
      {isOver && stage.items.length === 0 && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <span className="text-gray-500 text-sm">Drop items here</span>
        </div>
      )}
    </div>
  );
}