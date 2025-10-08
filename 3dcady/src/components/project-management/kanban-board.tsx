'use client';

import { useState, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { PlusIcon } from '@heroicons/react/24/outline';
import KanbanColumn from './kanban-column';
import KanbanCard from './kanban-card';
import { DEFAULT_PROJECT_STAGES } from '@/lib/constants';

interface KanbanItem {
  id: string;
  title: string;
  description?: string;
  category?: string;
  assignedTo?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  labels: string[];
  stageId: string;
}

interface KanbanStage {
  id: string;
  name: string;
  order: number;
  color: string;
  items: KanbanItem[];
}

interface KanbanBoardProps {
  projectId: string;
  onItemUpdate?: (item: KanbanItem) => void;
  onStageUpdate?: (stage: KanbanStage) => void;
}

export default function KanbanBoard({ projectId, onItemUpdate, onStageUpdate }: KanbanBoardProps) {
  const [stages, setStages] = useState<KanbanStage[]>([]);
  const [activeItem, setActiveItem] = useState<KanbanItem | null>(null);
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    loadProjectData();
  }, [projectId]);

  const loadProjectData = async () => {
    try {
      // Mock data - replace with actual API call
      const mockStages: KanbanStage[] = [
        {
          id: '1',
          name: 'Requirements Gathering',
          order: 0,
          color: 'bg-gray-200',
          items: [
            {
              id: 'item-1',
              title: 'Furniture Specifications',
              description: 'Define detailed furniture requirements',
              category: 'Furniture',
              priority: 'high',
              labels: ['urgent', 'client-review'],
              stageId: '1',
              dueDate: '2024-10-15',
            },
            {
              id: 'item-2',
              title: 'Lighting Assessment',
              description: 'Evaluate lighting needs for each room',
              category: 'Lighting',
              priority: 'medium',
              labels: ['technical'],
              stageId: '1',
            },
          ],
        },
        {
          id: '2',
          name: 'Supplier Selection',
          order: 1,
          color: 'bg-blue-200',
          items: [
            {
              id: 'item-3',
              title: 'Flooring Materials',
              description: 'Research and select flooring options',
              category: 'Finishing Materials',
              priority: 'medium',
              labels: ['research'],
              stageId: '2',
              assignedTo: 'John Doe',
            },
          ],
        },
        {
          id: '3',
          name: 'In Progress',
          order: 2,
          color: 'bg-yellow-200',
          items: [
            {
              id: 'item-4',
              title: 'Custom Cabinetry',
              description: 'Coordinate with cabinet maker for custom pieces',
              category: 'Furniture',
              priority: 'high',
              labels: ['manufacturing'],
              stageId: '3',
              dueDate: '2024-11-01',
            },
          ],
        },
        {
          id: '4',
          name: 'Quality Review',
          order: 3,
          color: 'bg-purple-200',
          items: [],
        },
        {
          id: '5',
          name: 'Completed',
          order: 4,
          color: 'bg-green-200',
          items: [
            {
              id: 'item-5',
              title: 'Paint Selection',
              description: 'Selected and approved paint colors',
              category: 'Finishing Materials',
              priority: 'low',
              labels: ['approved'],
              stageId: '5',
            },
          ],
        },
      ];

      setStages(mockStages);
      setLoading(false);
    } catch (error) {
      console.error('Error loading project data:', error);
      setLoading(false);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const item = findItem(active.id as string);
    setActiveItem(item);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the items
    const activeItem = findItem(activeId);
    const overItem = findItem(overId);

    if (!activeItem) return;

    // If dropping on a different stage
    if (activeItem.stageId !== getStageIdFromItem(overId)) {
      setStages((stages) => {
        const activeStageIndex = stages.findIndex(stage => stage.id === activeItem.stageId);
        const overStageIndex = stages.findIndex(stage => 
          stage.id === getStageIdFromItem(overId) || stage.id === overId
        );

        if (activeStageIndex === -1 || overStageIndex === -1) return stages;

        const newStages = [...stages];
        
        // Remove item from active stage
        newStages[activeStageIndex] = {
          ...newStages[activeStageIndex],
          items: newStages[activeStageIndex].items.filter(item => item.id !== activeId),
        };

        // Add item to over stage
        const updatedItem = { ...activeItem, stageId: newStages[overStageIndex].id };
        newStages[overStageIndex] = {
          ...newStages[overStageIndex],
          items: [...newStages[overStageIndex].items, updatedItem],
        };

        return newStages;
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveItem(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeItem = findItem(activeId);
    if (!activeItem) return;

    // Handle reordering within the same stage
    const activeStage = stages.find(stage => stage.id === activeItem.stageId);
    if (activeStage && activeItem.stageId === getStageIdFromItem(overId)) {
      const overItem = findItem(overId);
      if (overItem && activeItem.id !== overItem.id) {
        setStages((stages) => {
          const stageIndex = stages.findIndex(stage => stage.id === activeItem.stageId);
          if (stageIndex === -1) return stages;

          const newStages = [...stages];
          const items = [...newStages[stageIndex].items];
          const activeIndex = items.findIndex(item => item.id === activeId);
          const overIndex = items.findIndex(item => item.id === overId);

          newStages[stageIndex] = {
            ...newStages[stageIndex],
            items: arrayMove(items, activeIndex, overIndex),
          };

          return newStages;
        });
      }
    }

    // Call update callback if provided
    if (onItemUpdate && activeItem) {
      onItemUpdate(activeItem);
    }
  };

  const findItem = (id: string): KanbanItem | undefined => {
    for (const stage of stages) {
      const item = stage.items.find(item => item.id === id);
      if (item) return item;
    }
    return undefined;
  };

  const getStageIdFromItem = (itemId: string): string => {
    for (const stage of stages) {
      if (stage.items.some(item => item.id === itemId) || stage.id === itemId) {
        return stage.id;
      }
    }
    return '';
  };

  const addNewItem = (stageId: string) => {
    const newItem: KanbanItem = {
      id: `item-${Date.now()}`,
      title: 'New Task',
      priority: 'medium',
      labels: [],
      stageId,
    };

    setStages(stages => 
      stages.map(stage => 
        stage.id === stageId
          ? { ...stage, items: [...stage.items, newItem] }
          : stage
      )
    );
  };

  if (loading) {
    return (
      <div className="flex space-x-4 p-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="flex-1 bg-gray-100 rounded-lg p-4">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-3">
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="h-full">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex space-x-4 h-full overflow-x-auto pb-4">
          {stages.map((stage) => (
            <div key={stage.id} className="flex-shrink-0 w-80">
              <KanbanColumn
                stage={stage}
                onAddItem={() => addNewItem(stage.id)}
              >
                <SortableContext items={stage.items.map(item => item.id)}>
                  {stage.items.map((item) => (
                    <KanbanCard
                      key={item.id}
                      item={item}
                      onUpdate={onItemUpdate}
                    />
                  ))}
                </SortableContext>
              </KanbanColumn>
            </div>
          ))}
        </div>
      </DndContext>
    </div>
  );
}