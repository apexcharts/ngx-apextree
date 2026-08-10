import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ContentChild,
  TemplateRef,
  ViewChild,
  AfterViewInit,
  NgZone,
  ChangeDetectionStrategy,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import ApexTree from 'apextree';
import {
  TreeOptions,
  NestedNode,
  ApexTreeGraph,
  NodeClickEvent,
  TreeDirection,
} from './ngx-apextree.types';

@Component({
  selector: 'ngx-apextree',
  standalone: true,
  imports: [CommonModule],
  template: `<div #chartContainer class="ngx-apextree-container"></div>`,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxApextreeComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  /**
   * tree data to render
   */
  @Input() data: NestedNode | null = null;

  /**
   * tree configuration options
   */
  @Input() options: Partial<TreeOptions> = {};

  /**
   * emits when a node is clicked
   */
  @Output() nodeClick = new EventEmitter<NodeClickEvent>();

  /**
   * emits when graph is ready after initial render
   */
  @Output() graphReady = new EventEmitter<ApexTreeGraph>();

  /**
   * emits when graph is updated after data/options change
   */
  @Output() graphUpdated = new EventEmitter<ApexTreeGraph>();

  /**
   * custom node template
   */
  @ContentChild('nodeTemplate', { static: false })
  nodeTemplateRef: TemplateRef<any> | null = null;

  /**
   * custom tooltip template
   */
  @ContentChild('tooltipTemplate', { static: false })
  tooltipTemplateRef: TemplateRef<any> | null = null;

  @ViewChild('chartContainer', { static: true })
  private chartContainer!: ElementRef<HTMLElement>;

  private platformId = inject(PLATFORM_ID);
  private ngZone = inject(NgZone);

  private treeInstance: any = null;
  private graphInstance: ApexTreeGraph | null = null;
  private isInitialized = false;

  ngOnInit(): void {
    // initialization logic
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initChart();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.isInitialized) {
      return;
    }

    // Options are read at construction, so a change there needs a fresh instance.
    if (changes['options']) {
      this.updateChart();
      return;
    }

    // A data-only change reconciles into the live tree instead of rebuilding it.
    if (changes['data']) {
      this.applyData();
    }
  }

  ngOnDestroy(): void {
    this.destroyChart();
  }

  /**
   * change the layout direction
   */
  changeLayout(direction: TreeDirection): void {
    if (this.graphInstance) {
      this.ngZone.runOutsideAngular(() => {
        this.graphInstance!.changeLayout(direction);
      });
    }
  }

  /**
   * collapse a node by id
   */
  collapse(nodeId: string): void {
    if (this.graphInstance) {
      this.ngZone.runOutsideAngular(() => {
        this.graphInstance!.collapse(nodeId);
      });
    }
  }

  /**
   * expand a node by id
   */
  expand(nodeId: string): void {
    if (this.graphInstance) {
      this.ngZone.runOutsideAngular(() => {
        this.graphInstance!.expand(nodeId);
      });
    }
  }

  /**
   * fit the graph to screen
   */
  fitScreen(): void {
    if (this.graphInstance) {
      this.ngZone.runOutsideAngular(() => {
        this.graphInstance!.fitScreen();
      });
    }
  }

  /**
   * reconcile a new dataset into the live tree: surviving nodes spring to their new
   * positions, new ids grow in, departed ones retract, and collapse state /
   * selection / focus / expanded cards survive.
   *
   * Requires apextree >= 2.0.0. On an older core (the `>=1.9.0` peer range still
   * allows one) this falls back to a full rebuild.
   */
  updateData(data: NestedNode): void {
    this.data = data;
    this.applyData();
  }

  /**
   * expand every node in the tree
   */
  expandAll(): void {
    this.runOnGraph((graph) => graph.expandAll());
  }

  /**
   * collapse every node in the tree
   */
  collapseAll(): void {
    this.runOnGraph((graph) => graph.collapseAll());
  }

  /**
   * expand the tree down to a given depth
   */
  expandToDepth(depth: number): void {
    this.runOnGraph((graph) => graph.expandToDepth(depth));
  }

  /**
   * spotlight a node's lineage and visible subtree
   */
  focus(nodeId: string): void {
    this.runOnGraph((graph) => graph.focus(nodeId));
  }

  /**
   * clear the spotlight
   */
  clearFocus(): void {
    this.runOnGraph((graph) => graph.clearFocus());
  }

  /**
   * flow an animated dash along the root-to-node lineage
   */
  setActivePath(nodeIds: string[]): void {
    this.runOnGraph((graph) => graph.setActivePath(nodeIds));
  }

  /**
   * clear the active path
   */
  clearActivePath(): void {
    this.runOnGraph((graph) => graph.clearActivePath());
  }

  /**
   * expand or collapse a node's card in place (not its children)
   */
  toggleCard(nodeId: string): void {
    this.runOnGraph((graph) => graph.toggleCard(nodeId));
  }

  /**
   * zoom relative to the current scale
   */
  zoom(factor: number): void {
    this.runOnGraph((graph) => graph.zoom(factor));
  }

  /**
   * center the camera on a node, keeping the current zoom
   */
  centerOnNode(nodeId: string): void {
    this.runOnGraph((graph) => graph.centerOnNode(nodeId));
  }

  /**
   * get the underlying graph instance
   */
  getGraph(): ApexTreeGraph | null {
    return this.graphInstance;
  }

  /**
   * manually trigger a full rebuild
   */
  render(): void {
    this.updateChart();
  }

  /**
   * Run a graph call outside Angular, since the core drives its own rAF loop and
   * must not trip change detection on every animation frame.
   */
  private runOnGraph(fn: (graph: ApexTreeGraph) => void): void {
    if (!this.graphInstance) {
      return;
    }
    const graph = this.graphInstance;
    this.ngZone.runOutsideAngular(() => fn(graph));
  }

  /**
   * Reconcile the current `data` into the live tree, falling back to a rebuild when
   * the installed core predates `updateData`.
   */
  private applyData(): void {
    if (!isPlatformBrowser(this.platformId) || !this.data) {
      return;
    }

    const graph = this.graphInstance;
    if (!graph || typeof graph.updateData !== 'function') {
      this.updateChart();
      return;
    }

    const data = this.data;
    this.ngZone.runOutsideAngular(() => {
      graph.updateData(data);
      this.ngZone.run(() => {
        this.graphUpdated.emit(graph);
      });
    });
  }

  private initChart(): void {
    if (!this.data) {
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      const mergedOptions = this.buildOptions();

      this.treeInstance = new ApexTree(this.chartContainer.nativeElement, mergedOptions);

      this.graphInstance = this.treeInstance.render(this.data);
      this.isInitialized = true;

      this.ngZone.run(() => {
        this.graphReady.emit(this.graphInstance!);
      });
    });
  }

  private updateChart(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Full rebuild. Used for an options change (options are read at construction)
    // and as the fallback when the installed core predates `updateData`. A
    // data-only change goes through `applyData()` and animates instead.
    this.destroyChart();

    if (this.data) {
      this.ngZone.runOutsideAngular(() => {
        const mergedOptions = this.buildOptions();

        this.treeInstance = new ApexTree(this.chartContainer.nativeElement, mergedOptions);

        this.graphInstance = this.treeInstance.render(this.data);
        this.isInitialized = true;

        this.ngZone.run(() => {
          this.graphUpdated.emit(this.graphInstance!);
        });
      });
    }
  }

  private destroyChart(): void {
    // clear the container
    if (this.chartContainer?.nativeElement) {
      this.chartContainer.nativeElement.innerHTML = '';
    }
    this.treeInstance = null;
    this.graphInstance = null;
    this.isInitialized = false;
  }

  private buildOptions(): Partial<TreeOptions> {
    const overrides: Record<string, unknown> = {};

    // handle node template
    if (this.nodeTemplateRef) {
      overrides['nodeTemplate'] = (content: any) => {
        return this.renderTemplate(this.nodeTemplateRef!, content);
      };
    }

    // handle tooltip template
    if (this.tooltipTemplateRef) {
      overrides['tooltipTemplate'] = (content: any) => {
        return this.renderTemplate(this.tooltipTemplateRef!, content);
      };
    }

    // handle node click
    if (this.nodeClick.observed) {
      overrides['onNodeClick'] = (node: any) => {
        this.ngZone.run(() => {
          this.nodeClick.emit({
            node,
            event: window.event as MouseEvent,
          });
        });
      };
    }

    return { ...this.options, ...overrides } as Partial<TreeOptions>;
  }

  private renderTemplate(templateRef: TemplateRef<any>, content: any): string {
    // create embedded view
    const viewRef = templateRef.createEmbeddedView({ $implicit: content });
    viewRef.detectChanges();

    // extract html from the view
    const html = this.extractHtmlFromView(viewRef);

    // destroy the view
    viewRef.destroy();

    return html;
  }

  private extractHtmlFromView(viewRef: any): string {
    const nodes = viewRef.rootNodes;
    let html = '';

    for (const node of nodes) {
      if (node instanceof HTMLElement) {
        html += node.outerHTML;
      } else if (node instanceof Text) {
        html += node.textContent || '';
      } else if (node instanceof Comment) {
        // skip comments
      }
    }

    return html;
  }
}
