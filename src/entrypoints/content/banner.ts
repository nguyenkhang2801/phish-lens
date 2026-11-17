import type { AnalysisResult, Locale } from '../../core/types';
import { BANNER_UI } from './bannerUi';

const HOST_ATTR = 'data-phish-lens-banner';

export function removeAllBanners(): void {
  document.querySelectorAll(`[${HOST_ATTR}]`).forEach((el) => el.remove());
}

export function removeBannerForMount(mountParent: HTMLElement): void {
  mountParent.querySelector(`[${HOST_ATTR}]`)?.remove();
}

export interface BannerActions {
  onTrust: () => void;
  onDismiss: () => void;
}

export function renderBanner(
  mountParent: HTMLElement,
  result: AnalysisResult,
  locale: Locale,
  actions: BannerActions,
): void {
  removeBannerForMount(mountParent);

  const host = document.createElement('div');
  host.setAttribute(HOST_ATTR, 'true');
  mountParent.prepend(host);

  const shadow = host.attachShadow({ mode: 'open' });
  const ui = BANNER_UI[locale];

  const wrapper = document.createElement('div');
  wrapper.className = `pl-wrap pl-${result.severity}`;
  wrapper.innerHTML = `
    <style>${BANNER_STYLES}</style>
    <div role="alert" aria-live="polite">
      <strong>${ui.title[result.severity as keyof typeof ui.title]}</strong>
      <p class="pl-sender">${escapeHtml(result.sender.raw)}</p>
      <ul class="pl-reasons">
        ${result.signals.map((s) => `<li>${escapeHtml(s.reason)}</li>`).join('')}
      </ul>
      <div class="pl-actions">
        <button type="button" class="pl-trust">${ui.trust}</button>
        <button type="button" class="pl-dismiss">${ui.dismiss}</button>
      </div>
    </div>
  `;

  shadow.appendChild(wrapper);

  wrapper.querySelector('.pl-trust')?.addEventListener('click', actions.onTrust);
  wrapper.querySelector('.pl-dismiss')?.addEventListener('click', actions.onDismiss);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const BANNER_STYLES = `
  :host { all: initial; }
  .pl-wrap {
    font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
    font-size: 14px;
    line-height: 1.4;
    margin: 0 0 12px 0;
    border-radius: 8px;
    padding: 12px 14px;
    border: 1px solid #e0e0e0;
    box-sizing: border-box;
    width: 100%;
  }
  .pl-low { background: #fff8e6; border-color: #f0c36d; }
  .pl-medium { background: #fff0f0; border-color: #e57373; }
  .pl-high { background: #ffebee; border-color: #c62828; }
  .pl-sender { margin: 6px 0; word-break: break-all; color: #333; }
  .pl-reasons { margin: 8px 0; padding-left: 20px; color: #444; }
  .pl-actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px; }
  button {
    cursor: pointer;
    border-radius: 6px;
    border: 1px solid #ccc;
    padding: 6px 12px;
    font-size: 13px;
    background: #fff;
  }
  .pl-trust { border-color: #1a73e8; color: #1a73e8; }
`;
