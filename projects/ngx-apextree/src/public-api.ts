/*
 * Public API Surface of ngx-apextree
 */

// component
export { NgxApextreeComponent } from './lib/ngx-apextree.component';

// types
export type {
  TreeOptions,
  NestedNode,
  ApexTreeGraph,
  NodeClickEvent,
  TreeDirection,
} from './lib/ngx-apextree.types';

// license utilities
export {
  APEXTREE_LICENSE_KEY,
  setApexTreeLicense,
  getApexTreeLicense,
  provideApexTreeLicense,
} from './lib/ngx-apextree.license';
