import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { JsonPipe } from '@angular/common';
import {
  NgxApextreeComponent,
  TreeNode,
  ApexTreeOptions,
  ApexTreeGraph,
  NodeClickEvent,
  TreeDirection,
} from 'ngx-apextree';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxApextreeComponent, JsonPipe],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  @ViewChild('basicTree') basicTree!: NgxApextreeComponent;
  @ViewChild('customTree') customTree!: NgxApextreeComponent;
  @ViewChild('tooltipTree') tooltipTree!: NgxApextreeComponent;

  currentDemo: 'basic' | 'custom' | 'tooltip' | 'interactive' = 'basic';
  selectedNode: any = null;
  graphInstance: ApexTreeGraph | null = null;

  // basic tree data
  basicTreeData: TreeNode = {
    id: '1',
    name: 'Species',
    children: [
      {
        id: '2',
        name: 'Plants',
        children: [
          { id: '3', name: 'Mosses' },
          { id: '4', name: 'Ferns' },
          { id: '5', name: 'Gymnosperms' },
        ],
      },
      {
        id: '6',
        name: 'Fungi',
      },
      {
        id: '7',
        name: 'Animals',
        children: [
          {
            id: '8',
            name: 'Invertebrates',
            children: [
              { id: '9', name: 'Insects' },
              { id: '10', name: 'Molluscs' },
            ],
          },
          {
            id: '11',
            name: 'Vertebrates',
            children: [
              { id: '12', name: 'Fish' },
              { id: '13', name: 'Birds' },
              { id: '14', name: 'Mammals' },
            ],
          },
        ],
      },
    ],
  };

  basicTreeOptions: ApexTreeOptions = {
    width: 900,
    height: 500,
    nodeWidth: 140,
    nodeHeight: 50,
    direction: 'top',
    childrenSpacing: 80,
    siblingSpacing: 25,
    fontSize: '14px',
    fontWeight: '500',
    fontColor: '#374151',
    borderColor: '#d1d5db',
    borderColorHover: '#6366f1',
    nodeBGColor: '#ffffff',
    nodeBGColorHover: '#f3f4f6',
    edgeColor: '#d1d5db',
    edgeColorHover: '#6366f1',
    canvasStyle: 'border: 1px solid #e5e7eb; border-radius: 8px; background: #fafafa;',
    enableToolbar: true,
  };

  // custom template tree data
  customTreeData: TreeNode = {
    id: 'ms',
    data: {
      name: 'Margret Swanson',
      role: 'CEO',
      imageURL: 'https://i.pravatar.cc/300?img=68',
    },
    options: {
      nodeBGColor: '#cdb4db',
    },
    children: [
      {
        id: 'mh',
        data: {
          name: 'Mark Hudson',
          role: 'CTO',
          imageURL: 'https://i.pravatar.cc/300?img=69',
        },
        options: {
          nodeBGColor: '#ffafcc',
        },
        children: [
          {
            id: 'kb',
            data: {
              name: 'Karyn Borbas',
              role: 'Dev Lead',
              imageURL: 'https://i.pravatar.cc/300?img=65',
            },
            options: {
              nodeBGColor: '#f8ad9d',
            },
          },
          {
            id: 'cr',
            data: {
              name: 'Chris Rup',
              role: 'QA Lead',
              imageURL: 'https://i.pravatar.cc/300?img=60',
            },
            options: {
              nodeBGColor: '#c9cba3',
            },
          },
        ],
      },
      {
        id: 'cs',
        data: {
          name: 'Chris Lysek',
          role: 'CFO',
          imageURL: 'https://i.pravatar.cc/300?img=59',
        },
        options: {
          nodeBGColor: '#00afb9',
        },
        children: [
          {
            id: 'nc',
            data: {
              name: 'Noah Chandler',
              role: 'Finance Manager',
              imageURL: 'https://i.pravatar.cc/300?img=57',
            },
            options: {
              nodeBGColor: '#84a59d',
            },
          },
          {
            id: 'fw',
            data: {
              name: 'Felix Wagner',
              role: 'Accountant',
              imageURL: 'https://i.pravatar.cc/300?img=52',
            },
            options: {
              nodeBGColor: '#0081a7',
            },
          },
        ],
      },
    ],
  };

  customTreeOptions: ApexTreeOptions = {
    contentKey: 'data',
    width: 900,
    height: 500,
    nodeWidth: 180,
    nodeHeight: 80,
    direction: 'top',
    childrenSpacing: 60,
    siblingSpacing: 20,
    fontColor: '#ffffff',
    borderColor: 'transparent',
    canvasStyle: 'border: 1px solid #e5e7eb; border-radius: 8px; background: #f8fafc;',
    enableToolbar: true,
    enableExpandCollapse: true,
  };

  // tooltip template tree data
  tooltipTreeData: TreeNode = {
    id: 'ceo',
    data: {
      name: 'Sarah Johnson',
      role: 'Chief Executive Officer',
      department: 'Executive',
      email: 'sarah.johnson@company.com',
      phone: '+1 (555) 123-4567',
      location: 'New York, NY',
    },
    children: [
      {
        id: 'cto',
        data: {
          name: 'Michael Chen',
          role: 'Chief Technology Officer',
          department: 'Technology',
          email: 'michael.chen@company.com',
          phone: '+1 (555) 234-5678',
          location: 'San Francisco, CA',
        },
        children: [
          {
            id: 'dev-lead',
            data: {
              name: 'Emily Davis',
              role: 'Development Lead',
              department: 'Engineering',
              email: 'emily.davis@company.com',
              phone: '+1 (555) 345-6789',
              location: 'Austin, TX',
            },
          },
          {
            id: 'devops-lead',
            data: {
              name: 'James Wilson',
              role: 'DevOps Lead',
              department: 'Infrastructure',
              email: 'james.wilson@company.com',
              phone: '+1 (555) 456-7890',
              location: 'Seattle, WA',
            },
          },
        ],
      },
      {
        id: 'cfo',
        data: {
          name: 'Amanda Roberts',
          role: 'Chief Financial Officer',
          department: 'Finance',
          email: 'amanda.roberts@company.com',
          phone: '+1 (555) 567-8901',
          location: 'Chicago, IL',
        },
        children: [
          {
            id: 'accounting',
            data: {
              name: 'David Brown',
              role: 'Accounting Manager',
              department: 'Accounting',
              email: 'david.brown@company.com',
              phone: '+1 (555) 678-9012',
              location: 'Chicago, IL',
            },
          },
        ],
      },
    ],
  };

  tooltipTreeOptions: ApexTreeOptions = {
    contentKey: 'data',
    width: 900,
    height: 450,
    nodeWidth: 160,
    nodeHeight: 55,
    direction: 'top',
    childrenSpacing: 70,
    siblingSpacing: 25,
    fontSize: '13px',
    fontWeight: '500',
    fontColor: '#1e293b',
    borderColor: '#cbd5e1',
    borderColorHover: '#8b5cf6',
    nodeBGColor: '#f8fafc',
    nodeBGColorHover: '#f1f5f9',
    edgeColor: '#cbd5e1',
    edgeColorHover: '#8b5cf6',
    canvasStyle: 'border: 1px solid #e2e8f0; border-radius: 8px; background: #ffffff;',
    enableToolbar: true,
    enableTooltip: true,
    tooltipMaxWidth: 280,
    tooltipOffset: 20,
    tooltipTemplate: (content: any) => {
      return `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <div style="padding: 10px 12px; background: linear-gradient(135deg, #8b5cf6, #6366f1); border-radius: 6px 6px 0 0;">
            <span style="display: block; font-weight: 600; font-size: 14px; color: #ffffff;">${content.name}</span>
            <span style="display: block; font-size: 12px; color: rgba(255, 255, 255, 0.85); margin-top: 2px;">${content.role}</span>
          </div>
          <div style="padding: 10px 12px; background: #ffffff; border-radius: 0 0 6px 6px;">
            <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #f1f5f9;">
              <span style="font-size: 11px; color: #64748b;">Department:</span>
              <span style="font-size: 11px; color: #1e293b;">${content.department}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #f1f5f9;">
              <span style="font-size: 11px; color: #64748b;">Email:</span>
              <span style="font-size: 11px; color: #1e293b;">${content.email}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #f1f5f9;">
              <span style="font-size: 11px; color: #64748b;">Phone:</span>
              <span style="font-size: 11px; color: #1e293b;">${content.phone}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 4px 0;">
              <span style="font-size: 11px; color: #64748b;">Location:</span>
              <span style="font-size: 11px; color: #1e293b;">${content.location}</span>
            </div>
          </div>
        </div>
      `;
    },
  };

  // interactive tree
  interactiveTreeData: TreeNode = {
    id: 'root',
    name: 'Root Node',
    children: [
      {
        id: 'child1',
        name: 'Child 1',
        children: [
          { id: 'grandchild1', name: 'Grandchild 1' },
          { id: 'grandchild2', name: 'Grandchild 2' },
        ],
      },
      {
        id: 'child2',
        name: 'Child 2',
        children: [{ id: 'grandchild3', name: 'Grandchild 3' }],
      },
      {
        id: 'child3',
        name: 'Child 3',
      },
    ],
  };

  interactiveTreeOptions: ApexTreeOptions = {
    width: 900,
    height: 400,
    nodeWidth: 130,
    nodeHeight: 50,
    direction: 'top',
    childrenSpacing: 70,
    siblingSpacing: 25,
    fontSize: '13px',
    fontWeight: '500',
    fontColor: '#1f2937',
    borderColor: '#6366f1',
    borderWidth: 2,
    nodeBGColor: '#eef2ff',
    nodeBGColorHover: '#c7d2fe',
    edgeColor: '#a5b4fc',
    canvasStyle: 'border: 1px solid #e5e7eb; border-radius: 8px; background: #ffffff;',
    enableToolbar: true,
    enableExpandCollapse: true,
  };

  onNodeClick(event: NodeClickEvent): void {
    this.selectedNode = event.node;
  }

  onGraphReady(graph: ApexTreeGraph): void {
    this.graphInstance = graph;
  }

  onGraphUpdated(graph: ApexTreeGraph): void {
    this.graphInstance = graph;
  }

  changeLayout(direction: TreeDirection): void {
    switch (this.currentDemo) {
      case 'basic':
        this.basicTree?.changeLayout(direction);
        break;
      case 'custom':
        this.customTree?.changeLayout(direction);
        break;
      case 'tooltip':
        this.tooltipTree?.changeLayout(direction);
        break;
      case 'interactive':
        this.graphInstance?.changeLayout(direction);
        break;
    }
  }

  fitScreen(): void {
    switch (this.currentDemo) {
      case 'basic':
        this.basicTree?.fitScreen();
        break;
      case 'custom':
        this.customTree?.fitScreen();
        break;
      case 'tooltip':
        this.tooltipTree?.fitScreen();
        break;
      case 'interactive':
        this.graphInstance?.fitScreen();
        break;
    }
  }

  setDemo(demo: 'basic' | 'custom' | 'tooltip' | 'interactive'): void {
    this.currentDemo = demo;
    this.selectedNode = null;
  }
}
