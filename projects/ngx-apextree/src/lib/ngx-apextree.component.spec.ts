import { TestBed } from '@angular/core/testing';
import { NgxApextreeComponent } from './ngx-apextree.component';

describe('NgxApextreeComponent refreshTokens', () => {
  function create(): NgxApextreeComponent {
    TestBed.configureTestingModule({ imports: [NgxApextreeComponent] });
    // no data, so nothing renders: the tree instance is stubbed per test
    return TestBed.createComponent(NgxApextreeComponent).componentInstance;
  }

  it('forwards to the core tree instance', () => {
    const component = create();
    const refreshTokens = vi.fn();
    (component as any).treeInstance = { refreshTokens };

    component.refreshTokens();

    expect(refreshTokens).toHaveBeenCalledTimes(1);
  });

  it('is a no-op before the first render', () => {
    const component = create();
    expect(() => component.refreshTokens()).not.toThrow();
  });

  it('is a no-op on a core without refreshTokens (apextree < 2.3.0)', () => {
    const component = create();
    (component as any).treeInstance = {};
    expect(() => component.refreshTokens()).not.toThrow();
  });
});
