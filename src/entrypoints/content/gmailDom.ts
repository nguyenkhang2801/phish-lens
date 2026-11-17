/**
 * Gmail DOM selectors – verify in DevTools when Gmail updates its markup.
 * Kiểm tra lại các selector này trên https://mail.google.com khi mở một email.
 */
export const GMAIL_SELECTORS = {
  /** Khối nội dung thư đang mở (main reading pane). */
  openMessageRoot: 'div[role="main"]',
  /** Email người gửi trong header thư (thuộc tính email thường đúng). */
  senderEmail: 'span[email]',
  /** Fallback tên/hovercard người gửi. */
  senderHovercard: '[data-hovercard-id]',
  /** Lớp tên hiển thị cũ (có thể biến mất). */
  senderDisplayClass: '.gD',
  /** Vị trí chèn banner (đầu nội dung thư). */
  bannerMount: 'div.h7',
} as const;

export interface SenderInfo {
  rawAddress: string;
  messageKey: string;
  mountParent: HTMLElement;
}

const hiddenForSession = new Set<string>();

export function markHiddenForSession(messageKey: string): void {
  hiddenForSession.add(messageKey);
}

function debounce<T extends (...args: unknown[]) => void>(fn: T, ms: number): T {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return ((...args: unknown[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  }) as T;
}

function findOpenMessageContainer(): HTMLElement | null {
  const main = document.querySelector(GMAIL_SELECTORS.openMessageRoot);
  if (!(main instanceof HTMLElement)) return null;
  const emailSpan = main.querySelector(GMAIL_SELECTORS.senderEmail);
  if (emailSpan) return main;
  return null;
}

function readSenderFromContainer(container: HTMLElement): SenderInfo | null {
  let email = '';
  const span = container.querySelector(GMAIL_SELECTORS.senderEmail);
  if (span instanceof HTMLElement && span.getAttribute('email')) {
    email = span.getAttribute('email') ?? '';
  }

  if (!email) {
    const hover = container.querySelector(GMAIL_SELECTORS.senderHovercard);
    const id = hover?.getAttribute('data-hovercard-id');
    if (id?.includes('@')) email = id;
  }

  if (!email) return null;

  const display =
    container.querySelector(GMAIL_SELECTORS.senderDisplayClass) ??
    container.querySelector(GMAIL_SELECTORS.senderEmail);
  const displayText = display?.textContent?.trim();
  const rawAddress =
    displayText && displayText.includes('<') ? displayText : email.includes('<') ? email : email;

  if (displayText && !rawAddress.includes('@')) {
    const combined = `${displayText} <${email}>`;
    return buildSenderInfo(combined, container);
  }

  return buildSenderInfo(rawAddress.includes('@') ? rawAddress : email, container);
}

function buildSenderInfo(rawAddress: string, container: HTMLElement): SenderInfo {
  const mount =
    container.querySelector(GMAIL_SELECTORS.bannerMount) ??
    container.querySelector('.a3s')?.parentElement ??
    container.firstElementChild;

  const mountParent = (mount instanceof HTMLElement ? mount : container) as HTMLElement;
  const messageKey = `${rawAddress}:${mountParent.getAttribute('data-message-id') ?? ''}`;

  return { rawAddress, messageKey, mountParent };
}

export function observeGmailMessages(onMessageOpen: (info: SenderInfo) => void): () => void {
  const run = debounce(() => {
    const container = findOpenMessageContainer();
    if (!container) return;
    const info = readSenderFromContainer(container);
    if (!info) return;
    if (hiddenForSession.has(info.messageKey)) return;
    onMessageOpen(info);
  }, 200);

  run();
  const observer = new MutationObserver(() => run());
  observer.observe(document.body, { childList: true, subtree: true });
  return () => observer.disconnect();
}

export function shouldSkipMessage(messageKey: string): boolean {
  return hiddenForSession.has(messageKey);
}