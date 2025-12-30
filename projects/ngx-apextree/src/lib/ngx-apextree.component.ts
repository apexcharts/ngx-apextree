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
  ApexTreeOptions,
  ApexTreeGraph,
  TreeNode,
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
  @Input() data: TreeNode | null = null;

  /**
   * tree configuration options
   */
  @Input() options: ApexTreeOptions = {};

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

    // re-render on data or options change
    if (changes['data'] || changes['options']) {
      this.updateChart();
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
   * get the underlying graph instance
   */
  getGraph(): ApexTreeGraph | null {
    return this.graphInstance;
  }

  /**
   * manually trigger a re-render
   */
  render(): void {
    this.updateChart();
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

    // destroy and recreate for now
    // apextree doesn't have an update method
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

  private buildOptions(): ApexTreeOptions {
    const options: ApexTreeOptions = { ...this.options };

    // handle node template
    if (this.nodeTemplateRef) {
      options.nodeTemplate = (content: any) => {
        return this.renderTemplate(this.nodeTemplateRef!, content);
      };
    }

    // handle tooltip template
    if (this.tooltipTemplateRef) {
      options.tooltipTemplate = (content: any) => {
        return this.renderTemplate(this.tooltipTemplateRef!, content);
      };
    }

    // handle node click
    if (this.nodeClick.observed) {
      options.onNodeClick = (node: any) => {
        this.ngZone.run(() => {
          this.nodeClick.emit({
            node,
            event: window.event as MouseEvent,
          });
        });
      };
    }

    return options as any;
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
