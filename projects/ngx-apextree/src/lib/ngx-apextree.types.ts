/**
 * tree direction options
 */
export type TreeDirection = 'top' | 'bottom' | 'left' | 'right';

/**
 * node options that can be applied per-node
 */
export interface NodeOptions {
  nodeBGColor?: string;
  nodeBGColorHover?: string;
  borderColor?: string;
  borderColorHover?: string;
  fontSize?: string;
  fontFamily?: string;
  fontWeight?: string;
  fontColor?: string;
}

/**
 * tree node data structure
 */
export interface TreeNode<T = any> {
  id: string;
  name?: string;
  data?: T;
  options?: NodeOptions;
  children?: TreeNode<T>[];
}

/**
 * tooltip options
 */
export interface TooltipOptions {
  enableTooltip?: boolean;
  tooltipId?: string;
  tooltipMaxWidth?: number;
  tooltipMinWidth?: number;
  tooltipBorderColor?: string;
  tooltipBGColor?: string;
  tooltipFontColor?: string;
  tooltipFontSize?: string;
  tooltipPadding?: number;
  tooltipOffset?: number;
}

/**
 * font options
 */
export interface FontOptions {
  fontSize?: string;
  fontFamily?: string;
  fontWeight?: string;
  fontColor?: string;
}

/**
 * edge options
 */
export interface EdgeOptions {
  edgeWidth?: number;
  edgeColor?: string;
  edgeColorHover?: string;
}

/**
 * node styling options
 */
export interface NodeStylingOptions {
  nodeWidth?: number;
  nodeHeight?: number;
  nodeBGColor?: string;
  nodeBGColorHover?: string;
  borderWidth?: number;
  borderStyle?: string;
  borderRadius?: string;
  borderColor?: string;
  borderColorHover?: string;
  nodeStyle?: string;
  nodeClassName?: string;
}

/**
 * expand/collapse options
 */
export interface ExpandCollapseOptions {
  enableExpandCollapse?: boolean;
  expandCollapseButtonBGColor?: string;
  expandCollapseButtonBorderColor?: string;
}

/**
 * complete tree options
 */
export interface ApexTreeOptions extends 
  TooltipOptions, 
  FontOptions, 
  EdgeOptions, 
  NodeStylingOptions,
  ExpandCollapseOptions {
  width?: number | string;
  height?: number | string;
  direction?: TreeDirection;
  contentKey?: string;
  siblingSpacing?: number;
  childrenSpacing?: number;
  highlightOnHover?: boolean;
  containerClassName?: string;
  canvasStyle?: string;
  enableToolbar?: boolean;
  groupLeafNodes?: boolean;
  groupLeafNodesSpacing?: number;
  viewPortWidth?: number;
  viewPortHeight?: number;
  nodeTemplate?: (content: any) => string;
  tooltipTemplate?: (content: any) => string;
  onNodeClick?: (node: any) => void;
}

/**
 * graph instance returned by render
 */
export interface ApexTreeGraph {
  changeLayout(direction: TreeDirection): void;
  collapse(nodeId: string): void;
  expand(nodeId: string): void;
  fitScreen(): void;
}

/**
 * node click event payload
 */
export interface NodeClickEvent<T = any> {
  node: TreeNode<T>;
  event: MouseEvent;
}
