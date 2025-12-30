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
import { NgxApextreeComponent, TreeNode, ApexTreeOptions } from 'ngx-apextree';

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
  treeData: TreeNode = {
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

  treeOptions: ApexTreeOptions = {
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
  treeData: TreeNode = {
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

  treeOptions: ApexTreeOptions = {
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
  treeData: TreeNode = {
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

  treeOptions: ApexTreeOptions = {
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

| Input     | Type              | Description           |
| --------- | ----------------- | --------------------- |
| `data`    | `TreeNode`        | Tree data structure   |
| `options` | `ApexTreeOptions` | Configuration options |

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

| Method         | Parameters                 | Description           |
| -------------- | -------------------------- | --------------------- |
| `changeLayout` | `direction: TreeDirection` | Change tree direction |
| `collapse`     | `nodeId: string`           | Collapse a node       |
| `expand`       | `nodeId: string`           | Expand a node         |
| `fitScreen`    | -                          | Fit graph to screen   |
| `getGraph`     | -                          | Get graph instance    |
| `render`       | -                          | Manually re-render    |

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
