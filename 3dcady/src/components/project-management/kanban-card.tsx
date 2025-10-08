'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  CalendarIcon,
  UserIcon,
  TagIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

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

interface KanbanCardProps {
  item: KanbanItem;
  onUpdate?: (item: KanbanItem) => void;
  onDelete?: (itemId: string) => void;
}

export default function KanbanCard({ item, onUpdate, onDelete }: KanbanCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState(item);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getLabelColor = (label: string) => {
    const colors = {
      urgent: 'bg-red-100 text-red-800',
      'client-review': 'bg-blue-100 text-blue-800',
      technical: 'bg-purple-100 text-purple-800',
      research: 'bg-yellow-100 text-yellow-800',
      manufacturing: 'bg-orange-100 text-orange-800',
      approved: 'bg-green-100 text-green-800',
    };
    return colors[label as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const isOverdue = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(editedItem);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedItem(item);
    setIsEditing(false);
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-3 opacity-50"
      >
        <div className="h-20"></div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
        <input
          type="text"
          value={editedItem.title}
          onChange={(e) => setEditedItem({ ...editedItem, title: e.target.value })}
          className="w-full font-medium text-gray-900 bg-transparent border-none outline-none mb-2"
          placeholder="Task title"
        />
        
        <textarea
          value={editedItem.description || ''}
          onChange={(e) => setEditedItem({ ...editedItem, description: e.target.value })}
          className="w-full text-sm text-gray-600 bg-transparent border-none outline-none resize-none mb-2"
          placeholder="Description"
          rows={2}
        />

        <div className="flex space-x-2">
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-primary-600 text-white text-xs rounded hover:bg-primary-700"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white border-l-4 border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer ${getPriorityColor(item.priority)}`}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-gray-900 text-sm leading-tight flex-1">
          {item.title}
        </h4>
        <div className="flex space-x-1 ml-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <PencilIcon className="w-3 h-3 text-gray-400" />
          </button>
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id);
              }}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <TrashIcon className="w-3 h-3 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Description */}
      {item.description && (
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
          {item.description}
        </p>
      )}

      {/* Labels */}
      {item.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {item.labels.map((label, index) => (
            <span
              key={index}
              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getLabelColor(label)}`}
            >
              {label}
            </span>
          ))}
        </div>
      )}

      {/* Category */}
      {item.category && (
        <div className="flex items-center mb-2">
          <TagIcon className="w-3 h-3 text-gray-400 mr-1" />
          <span className="text-xs text-gray-600">{item.category}</span>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        {/* Assigned To */}
        {item.assignedTo && (
          <div className="flex items-center">
            <UserIcon className="w-3 h-3 mr-1" />
            <span>{item.assignedTo}</span>
          </div>
        )}

        {/* Due Date */}
        {item.dueDate && (
          <div className={`flex items-center ${
            isOverdue(item.dueDate) ? 'text-red-600' : ''
          }`}>
            <CalendarIcon className="w-3 h-3 mr-1" />
            <span>{formatDate(item.dueDate)}</span>
          </div>
        )}
      </div>
    </div>
  );
}