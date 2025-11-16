import { useState, useCallback } from 'react';
import TreeNode from './components/TreeNode';
import type { TreeNodeData } from './types';

function App() {
  const [root, setRoot] = useState<TreeNodeData | null>(null);
  const [zoom, setZoom] = useState(100);

  // Generate unique ID
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Initialize tree with root node
  const initializeTree = useCallback(() => {
    setRoot({
      id: generateId(),
      value: '',
      children: [],
      isExpanded: true,
    });
  }, []);

  // Find node by ID recursively
  const findNode = useCallback((node: TreeNodeData, id: string): TreeNodeData | null => {
    if (node.id === id) return node;
    for (const child of node.children) {
      const found = findNode(child, id);
      if (found) return found;
    }
    return null;
  }, []);

  // Add child to node
  const handleAddChild = useCallback(
    (nodeId: string) => {
      if (!root) return;
      const newRoot = { ...root };
      const parentNode = findNode(newRoot, nodeId);
      if (parentNode) {
        parentNode.children.push({
          id: generateId(),
          value: '',
          children: [],
          isExpanded: true,
        });
        parentNode.isExpanded = true;
      }
      setRoot(newRoot);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [root]
  );

  // Remove node by ID
  const handleRemove = useCallback(
    (nodeId: string) => {
      if (!root || root.id === nodeId) return;
      
      const removeFromChildren = (node: TreeNodeData): boolean => {
        const index = node.children.findIndex((child) => child.id === nodeId);
        if (index !== -1) {
          node.children.splice(index, 1);
          return true;
        }
        for (const child of node.children) {
          if (removeFromChildren(child)) return true;
        }
        return false;
      };

      const newRoot = { ...root };
      removeFromChildren(newRoot);
      setRoot(newRoot);
    },
    [root]
  );

  // Update node value
  const handleUpdateValue = useCallback(
    (nodeId: string, value: string) => {
      if (!root) return;
      const newRoot = { ...root };
      const node = findNode(newRoot, nodeId);
      if (node) {
        node.value = value;
      }
      setRoot(newRoot);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [root]
  );

  // Update return value
  const handleUpdateReturnValue = useCallback(
    (nodeId: string, returnValue: string) => {
      if (!root) return;
      const newRoot = { ...root };
      const node = findNode(newRoot, nodeId);
      if (node) {
        node.returnValue = returnValue || undefined;
      }
      setRoot(newRoot);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [root]
  );

  // Toggle expand/collapse
  const handleToggleExpand = useCallback(
    (nodeId: string) => {
      if (!root) return;
      const newRoot = { ...root };
      const node = findNode(newRoot, nodeId);
      if (node) {
        node.isExpanded = !node.isExpanded;
      }
      setRoot(newRoot);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [root]
  );

  return (
    <div className="relative h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-auto">
      {/* Absolute Title */}
      <div className="absolute top-4 left-8 z-10">
        <h1 className="text-3xl font-bold text-gray-800">
          Tree Builder
        </h1>
      </div>

      {/* Zoom Control */}
      <div className="absolute top-4 right-8 z-10 bg-white rounded-lg shadow-md p-4 flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700">Zoom:</span>
        <input
          type="range"
          min="25"
          max="200"
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <span className="text-sm font-medium text-gray-700 w-12">{zoom}%</span>
      </div>

      {/* Main Content */}
      <div className="pt-20">
        {!root ? (
          <div className="flex items-center justify-center h-96">
            <button
              onClick={initializeTree}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
            >
              Create Root Node
            </button>
          </div>
        ) : (
          <div 
            className="flex justify-center pb-24 transition-transform duration-200"
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
          >
            <TreeNode
              node={root}
              onAddChild={handleAddChild}
              onRemove={handleRemove}
              onUpdateValue={handleUpdateValue}
              onUpdateReturnValue={handleUpdateReturnValue}
              onToggleExpand={handleToggleExpand}
              isRoot={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
