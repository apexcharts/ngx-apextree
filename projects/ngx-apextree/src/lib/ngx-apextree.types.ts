import ApexTree from 'apextree';

/**
 * Tree configuration options — inferred from the ApexTree constructor.
 * Stays in sync with core without requiring a deep import.
 */
export type TreeOptions = NonNullable<ConstructorParameters<typeof ApexTree>[1]>;

/**
 * Tree node data structure — inferred from the ApexTree render method.
 */
export type NestedNode = Parameters<InstanceType<typeof ApexTree>['render']>[0];

export type TreeDirection = 'top' | 'bottom' | 'left' | 'right';

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
export interface NodeClickEvent {
  node: NestedNode;
  event: MouseEvent;
}
