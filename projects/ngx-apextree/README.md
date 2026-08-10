# ngx-apextree

Angular wrapper for [ApexTree](https://github.com/apexcharts/apextree) - a JavaScript library for creating organizational and hierarchical charts.

## Installation

```bash
npm install ngx-apextree apextree
```

## Usage

### Basic Example

```typescript
// app.component.ts
import { Component } from '@angular/core';
import { NgxApextreeComponent, NestedNode, TreeOptions } from 'ngx-apextree';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgxApextreeComponent],
  template: `
    <ngx-apextree
      [data]="treeData"
      [options]="treeOptions"
      (nodeClick)="onNodeClick($event)"
      (graphReady)="onGraphReady($event)"
    >
    </ngx-apextree>
  `,
})
export class AppComponent {
  treeData: NestedNode = {
    id: '1',
    name: 'CEO',
    children: [
      {
        id: '2',
        name: 'CTO',
        children: [
          { id: '3', name: 'Dev Lead' },
          { id: '4', name: 'QA Lead' },
        ],
      },
      {
        id: '5',
        name: 'CFO',
      },
    ],
  };

  treeOptions: Partial<TreeOptions> = {
    width: 800,
    height: 600,
    nodeWidth: 150,
    nodeHeight: 60,
    direction: 'top',
    childrenSpacing: 80,
    siblingSpacing: 30,
  };

  onNodeClick(event: any) {
    console.log('Node clicked:', event.node);
  }

  onGraphReady(graph: any) {
    console.log('Graph ready:', graph);
  }
}
```

### Custom Node Template

Use Angular's `ng-template` for custom node rendering:

```typescript
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgxApextreeComponent],
  template: `
    <ngx-apextree [data]="treeData" [options]="treeOptions">
      <ng-template #nodeTemplate let-content>
        <div class="custom-node">
          <img [src]="content.imageURL" alt="" />
          <span>{{ content.name }}</span>
        </div>
      </ng-template>
    </ngx-apextree>
  `,
  styles: [
    `
      .custom-node {
        display: flex;
        align-items: center;
        gap: 8px;
        height: 100%;
        padding: 0 10px;
      }
      .custom-node img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
    `,
  ],
})
export class AppComponent {
  treeData: NestedNode = {
    id: '1',
    data: {
      name: 'John Doe',
      imageURL: 'https://i.pravatar.cc/300?img=68',
    },
    children: [
      {
        id: '2',
        data: {
          name: 'Jane Smith',
          imageURL: 'https://i.pravatar.cc/300?img=69',
        },
      },
    ],
  };

  treeOptions: Partial<TreeOptions> = {
    contentKey: 'data',
    width: 800,
    height: 600,
    nodeWidth: 180,
    nodeHeight: 60,
  };
}
```

### Custom Tooltip Template

You can provide a custom tooltip using the `tooltipTemplate` option:

```typescript
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgxApextreeComponent],
  template: ` <ngx-apextree [data]="treeData" [options]="treeOptions"></ngx-apextree> `,
})
export class AppComponent {
  treeData: NestedNode = {
    id: '1',
    data: {
      name: 'John Doe',
      role: 'CEO',
      email: 'john@company.com',
    },
    children: [
      {
        id: '2',
        data: {
          name: 'Jane Smith',
          role: 'CTO',
          email: 'jane@company.com',
        },
      },
    ],
  };

  treeOptions: Partial<TreeOptions> = {
    contentKey: 'data',
    width: 800,
    height: 600,
    enableTooltip: true,
    tooltipTemplate: (content: any) => {
      return `
        <div style="padding: 10px;">
          <strong>${content.name}</strong>
          <p>${content.role}</p>
          <p>${content.email}</p>
        </div>
      `;
    },
  };
}
```

Alternatively, use Angular's `ng-template` for tooltip rendering:

```html
<ngx-apextree [data]="treeData" [options]="{ enableTooltip: true }">
  <ng-template #tooltipTemplate let-content>
    <div class="custom-tooltip">
      <strong>{{ content.name }}</strong>
      <p>{{ content.description }}</p>
    </div>
  </ng-template>
</ngx-apextree>
```

### `graphUpdated`

Emits the same `ApexTreeGraph` instance as `graphReady`, but fires every time the tree re-renders due to a `data` or `options` change. Useful for re-applying imperative state (e.g. re-collapsing nodes) after a data update.

### Graph Methods

Access graph methods through component reference or the emitted graph instance:

```typescript
@Component({
  template: `
    <ngx-apextree
      #tree
      [data]="treeData"
      [options]="treeOptions"
      (graphReady)="onGraphReady($event)"
    >
    </ngx-apextree>

    <button (click)="changeDirection()">Change Direction</button>
    <button (click)="fit()">Fit Screen</button>
  `,
})
export class AppComponent {
  @ViewChild('tree') tree!: NgxApextreeComponent;

  private graph: any;

  onGraphReady(graph: any) {
    this.graph = graph;
  }

  changeDirection() {
    // using component method
    this.tree.changeLayout('left');

    // or using graph instance directly
    // this.graph.changeLayout('left');
  }

  fit() {
    this.tree.fitScreen();
  }
}
```

## API

### Inputs

| Input     | Type                   | Description           |
| --------- | ---------------------- | --------------------- |
| `data`    | `NestedNode`           | Tree data structure   |
| `options` | `Partial<TreeOptions>` | Configuration options |

### Outputs

| Output         | Type             | Description                     |
| -------------- | ---------------- | ------------------------------- |
| `nodeClick`    | `NodeClickEvent` | Emits when a node is clicked    |
| `graphReady`   | `ApexTreeGraph`  | Emits after initial render      |
| `graphUpdated` | `ApexTreeGraph`  | Emits after data/options update |

### Content Templates

| Template           | Context              | Description         |
| ------------------ | -------------------- | ------------------- |
| `#nodeTemplate`    | `$implicit: content` | Custom node HTML    |
| `#tooltipTemplate` | `$implicit: content` | Custom tooltip HTML |

### Component Methods

Conveniences for the common verbs. Anything not listed is reachable through
`getGraph()`, which returns the fully typed graph instance.

| Method            | Parameters                 | Description                                |
| ----------------- | -------------------------- | ------------------------------------------ |
| `changeLayout`    | `direction: TreeDirection` | Change tree direction                      |
| `collapse`        | `nodeId: string`           | Collapse a node                            |
| `expand`          | `nodeId: string`           | Expand a node                              |
| `fitScreen`       | -                          | Fit graph to screen                        |
| `updateData`      | `data: NestedNode`         | Reconcile a new dataset with animation     |
| `expandAll`       | -                          | Expand every node                          |
| `collapseAll`     | -                          | Collapse every node                        |
| `expandToDepth`   | `depth: number`            | Expand down to a given depth               |
| `focus`           | `nodeId: string`           | Spotlight a node's lineage and subtree     |
| `clearFocus`      | -                          | Clear the spotlight                        |
| `setActivePath`   | `nodeIds: string[]`        | Flow an animated dash along the lineage    |
| `clearActivePath` | -                          | Clear the active path                      |
| `toggleCard`      | `nodeId: string`           | Expand or collapse a node's card in place  |
| `zoom`            | `factor: number`           | Zoom relative to the current scale         |
| `centerOnNode`    | `nodeId: string`           | Center the camera on a node                |
| `getGraph`        | -                          | Get graph instance                         |
| `render`          | -                          | Force a full rebuild                       |

Everything from `updateData` down requires `apextree >= 2.0.0`.

`getGraph()` is typed off the core `apextree` you have installed, so it also covers
`expandSubtree`, `collapseSubtree`, `expandCard`, `collapseCard`,
`setExpandedCards`, `getExpandedCards`, `getFocusedNodeId`, `getActivePath`,
`setSelection`, `getSelection`, `clearSelection`, `getRootNodeId` and `getNodeLabel`.

## Animated data updates

Changing the `data` input reconciles the new dataset into the live tree rather than
rebuilding it: surviving nodes spring to their new positions, new ids grow in, and
departed ones retract. Collapse state, selection, focus and expanded cards all
survive, and `graphUpdated` still fires.

```ts
// binding a new object to [data] is enough
this.data = nextQuarter;
```

This needs `apextree >= 2.0.0`. On an older core the component falls back to a full
rebuild.

Changing the `options` input still rebuilds the instance, since options are read at
construction, as does calling `render()`.

## License Setup

If you have a commercial license, set it once at app initialization.

### Option 1: Angular Provider (Recommended)

**Standalone App:**

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideApexTreeLicense } from 'ngx-apextree';

export const appConfig: ApplicationConfig = {
  providers: [provideApexTreeLicense('your-license-key-here')],
};
```

**Module-based App:**

```typescript
// app.module.ts
import { NgModule } from '@angular/core';
import { provideApexTreeLicense } from 'ngx-apextree';

@NgModule({
  providers: [provideApexTreeLicense('your-license-key-here')],
})
export class AppModule {}
```

### Option 2: Static Method

```typescript
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { setApexTreeLicense } from 'ngx-apextree';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

// set license before bootstrapping
setApexTreeLicense('your-license-key-here');

bootstrapApplication(AppComponent, appConfig);
```

## Tree Options

See the full list of options in the [ApexTree documentation](https://github.com/apexcharts/apextree).

## License

See [LICENSE](./LICENSE) for details.
