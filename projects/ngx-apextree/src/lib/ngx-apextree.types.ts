import ApexTree from 'apextree';
import type { NestedNode, TreeDirection } from 'apextree';

/**
 * Tree configuration options — inferred from the ApexTree constructor.
 * Stays in sync with core without requiring a deep import.
 */
export type TreeOptions = NonNullable<ConstructorParameters<typeof ApexTree>[1]>;

/**
 * Tree node data structure — re-exported from apextree to preserve generics.
 */
export type { NestedNode };

/**
 * Growth direction — re-exported from apextree rather than re-declared.
 *
 * This was previously hand-written as `'top' | 'bottom' | 'left' | 'right'`, which
 * silently omitted `'radial'` once core gained it, so the radial layout could not
 * be selected from Angular without a type error.
 */
export type { TreeDirection };

/**
 * the core graph class returned by ApexTree.render(), derived from whatever
 * apextree version the consumer has installed rather than re-declared here.
 *
 * apextree does not export this class by name, so it can only be reached
 * structurally. It is kept internal on purpose: it carries private members, and
 * naming it in an exported declaration triggers TS4094 during declaration emit.
 *
 * Written as `import('apextree').default['render']` rather than
 * `InstanceType<typeof ...>` on purpose: a class name in type position already IS
 * its instance type, and declaration emitters that rewrite the dynamic import to a
 * local alias drop the `typeof`, which would turn the `InstanceType` form into
 * something invalid that silently collapses every picked member to `any`.
 */
type CoreGraph = ReturnType<import('apextree').default['render']>;

/**
 * public API surface of the graph instance returned by render().
 *
 * `Pick` off the real class rather than a hand-written interface, so every
 * signature stays correct as apextree evolves and new core methods only need
 * their name adding here.
 */
export type ApexTreeGraph = Pick<
  CoreGraph,
  // layout + collapse/expand
  | 'options'
  | 'changeLayout'
  | 'collapse'
  | 'expand'
  | 'construct'
  | 'render'
  | 'fitScreen'
  // live data updates (apextree >= 2.0.0)
  | 'updateData'
  // batch verbs (apextree >= 2.0.0)
  | 'expandAll'
  | 'collapseAll'
  | 'expandToDepth'
  | 'expandSubtree'
  | 'collapseSubtree'
  // focus / spotlight (apextree >= 2.0.0)
  | 'focus'
  | 'clearFocus'
  | 'getFocusedNodeId'
  // animated active path (apextree >= 2.0.0)
  | 'setActivePath'
  | 'clearActivePath'
  | 'getActivePath'
  // expandable cards (apextree >= 2.0.0)
  | 'expandCard'
  | 'collapseCard'
  | 'toggleCard'
  | 'setExpandedCards'
  | 'getExpandedCards'
  // selection
  | 'setSelection'
  | 'getSelection'
  | 'clearSelection'
  // camera
  | 'zoom'
  | 'centerOnNode'
  // introspection
  | 'getRootNodeId'
  | 'getNodeLabel'
>;

/**
 * node click event payload
 */
export interface NodeClickEvent {
  node: NestedNode;
  event: MouseEvent;
}
