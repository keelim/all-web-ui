import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'bun:test';

import { Badge, Button, EmptyState, Input, LoadingStatus, Panel } from '../src';

describe('all-web-ui exports', () => {
  it('renders shared primitives with stable class contracts', () => {
    expect(renderToStaticMarkup(<Button variant="primary">저장</Button>)).toContain('kui-button--primary');
    expect(renderToStaticMarkup(<Input placeholder="입력" />)).toContain('kui-input');
    expect(renderToStaticMarkup(<Panel as="section">내용</Panel>)).toContain('kui-panel--elevated');
    expect(renderToStaticMarkup(<Badge tone="accent">강조</Badge>)).toContain('kui-badge--accent');
    expect(renderToStaticMarkup(<EmptyState description="비어 있음" />)).toContain('kui-empty-state');
  });

  it('renders panel loading markup with progress steps', () => {
    const html = renderToStaticMarkup(
      <LoadingStatus
        label="동기화 중"
        caption="진행 상황 확인"
        variant="panel"
        steps={['준비', '처리', '완료']}
        activeStep={1}
      />
    );

    expect(html).toContain('data-loading-variant="panel"');
    expect(html).toContain('kui-loading-panel__step is-active');
    expect(html).toContain('진행 상황 확인');
  });
});
