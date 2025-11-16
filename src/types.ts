export interface TreeNodeData {
  id: string;
  value: string;
  children: TreeNodeData[];
  returnValue?: string;
  isExpanded: boolean;
}
