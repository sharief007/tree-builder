import React, { useState } from 'react';
import { Edit2, Plus, Trash2, ChevronDown, ChevronRight, Pencil } from 'lucide-react';
import type { TreeNodeData } from '../types';

interface TreeNodeProps {
  node: TreeNodeData;
  onAddChild: (nodeId: string) => void;
  onRemove: (nodeId: string) => void;
  onUpdateValue: (nodeId: string, value: string) => void;
  onUpdateReturnValue: (nodeId: string, returnValue: string) => void;
  onToggleExpand: (nodeId: string) => void;
  isRoot?: boolean;
}

const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  onAddChild,
  onRemove,
  onUpdateValue,
  onUpdateReturnValue,
  onToggleExpand,
  isRoot = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditingValue, setIsEditingValue] = useState(false);
  const [isEditingReturn, setIsEditingReturn] = useState(false);
  const [editValue, setEditValue] = useState(node.value);
  const [editReturn, setEditReturn] = useState(node.returnValue || '');
  const [showTooltip, setShowTooltip] = useState(false);
  const [editingChildId, setEditingChildId] = useState<string | null>(null);

  const hasChildren = node.children.length > 0;

  const handleSaveValue = () => {
    onUpdateValue(node.id, editValue);
    setIsEditingValue(false);
  };

  const handleSaveReturn = (childId: string) => {
    onUpdateReturnValue(childId, editReturn);
    setIsEditingReturn(false);
    setEditingChildId(null);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Incoming edge */}
      {!isRoot && (
        <div className="relative flex flex-col items-center">
          <div className="w-0.5 h-1 bg-gradient-to-b from-gray-400 to-gray-300"></div>
        </div>
      )}

      {/* Node Circle */}
      <div
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`w-24 h-24 rounded-full border-4 flex items-center justify-center transition-all cursor-pointer ${
            isHovered
              ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
              : 'border-gray-400 bg-white shadow-md'
          }`}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {isEditingValue ? (
            <div className="w-full px-3">
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-full text-center border border-blue-400 rounded px-1 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveValue();
                  if (e.key === 'Escape') setIsEditingValue(false);
                }}
                onBlur={handleSaveValue}
              />
            </div>
          ) : (
            <div className="text-center px-2 w-full">
              <div className="text-xs font-medium text-gray-700 truncate">
                {node.value || <span className="text-gray-400 italic">empty</span>}
              </div>
            </div>
          )}

          {/* Action buttons inside the circle on hover */}
          {isHovered && !isEditingValue && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    setEditValue(node.value);
                    setIsEditingValue(true);
                  }}
                  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all shadow-lg hover:scale-110"
                  title="Edit value"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => onAddChild(node.id)}
                  className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all shadow-lg hover:scale-110"
                  title="Add child"
                >
                  <Plus size={14} />
                </button>
                {!isRoot && (
                  <button
                    onClick={() => onRemove(node.id)}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-lg hover:scale-110"
                    title="Remove node"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Tooltip showing full state value */}
        {showTooltip && node.value && !isEditingValue && (
          <div className="absolute z-50 top-full left-1/2 -translate-x-1/2 mt-4 px-4 py-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl max-w-xs break-words">
            <div className="font-semibold mb-1 text-blue-300">State:</div>
            <div className="font-mono">{node.value}</div>
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
          </div>
        )}

        {/* Expand/collapse button */}
        {hasChildren && (
          <button
            onClick={() => onToggleExpand(node.id)}
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-gray-700 hover:bg-gray-800 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white transition-all hover:scale-110"
            title={node.isExpanded ? 'Collapse' : 'Expand'}
          >
            {node.isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        )}
      </div>

      {/* Children */}
      {hasChildren && node.isExpanded && (
        <>
          {/* Vertical line from parent */}
          <div className="w-0.5 h-8 bg-gradient-to-b from-gray-300 to-gray-400"></div>
          
          <div className="flex items-start justify-center gap-8 relative">
            {/* Horizontal connector bar - full width for 2+ children */}
            {node.children.length > 1 && (
              <div 
                className="absolute h-0.5 bg-gray-300 left-0 right-0"
                style={{ top: '0px' }}
              />
            )}
            
            {node.children.map((child) => {
              return (
                <div key={child.id} className="flex flex-col items-center relative">
                  {/* Vertical connector */}
                  <div className="w-0.5 h-12 bg-gradient-to-b from-gray-300 to-gray-400 relative">
                    {/* Return value editor on edge - positioned in middle of vertical line */}
                    <EdgeReturnValue
                      child={child}
                      isEditingReturn={isEditingReturn && editingChildId === child.id}
                      editReturn={editReturn}
                      onStartEdit={() => {
                        setEditReturn(child.returnValue || '');
                        setIsEditingReturn(true);
                        setEditingChildId(child.id);
                      }}
                      onSave={() => handleSaveReturn(child.id)}
                      onCancel={() => {
                        setIsEditingReturn(false);
                        setEditingChildId(null);
                      }}
                      onChange={setEditReturn}
                    />
                  </div>
                  
                  <TreeNode
                    node={child}
                    onAddChild={onAddChild}
                    onRemove={onRemove}
                    onUpdateValue={onUpdateValue}
                    onUpdateReturnValue={onUpdateReturnValue}
                    onToggleExpand={onToggleExpand}
                  />
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

// Separate component for edge return value
interface EdgeReturnValueProps {
  child: TreeNodeData;
  isEditingReturn: boolean;
  editReturn: string;
  onStartEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onChange: (value: string) => void;
}

const EdgeReturnValue: React.FC<EdgeReturnValueProps> = ({
  child,
  isEditingReturn,
  editReturn,
  onStartEdit,
  onSave,
  onCancel,
  onChange,
}) => {
  const [isHoveringEdge, setIsHoveringEdge] = useState(false);

  if (isEditingReturn) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-white p-2 border-2 border-green-400 rounded-lg shadow-xl">
        <input
          type="text"
          value={editReturn}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Return value"
          className="border border-green-400 rounded px-2 py-1 text-xs w-28 focus:outline-none focus:ring-2 focus:ring-green-500"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSave();
            if (e.key === 'Escape') onCancel();
          }}
          onBlur={onSave}
        />
      </div>
    );
  }

  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-20 h-16 flex items-center justify-center"
      onMouseEnter={() => setIsHoveringEdge(true)}
      onMouseLeave={() => setIsHoveringEdge(false)}
    >
      {/* Always show return value if it exists */}
      {child.returnValue && (
        <div className="text-xs font-mono text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200 shadow-sm mb-1">
          ↑ {child.returnValue}
        </div>
      )}
      
      {/* Show edit icon on hover */}
      {isHoveringEdge && (
        <button
          onClick={onStartEdit}
          className="p-1 bg-white hover:bg-blue-50 border border-gray-300 hover:border-blue-400 rounded-full transition-all shadow-sm hover:shadow-md"
          title={child.returnValue ? "Edit return value" : "Add return value"}
        >
          {child.returnValue ? (
            <Pencil size={12} className="text-blue-600" />
          ) : (
            <Plus size={12} className="text-blue-600" />
          )}
        </button>
      )}
    </div>
  );
};

export default TreeNode;
