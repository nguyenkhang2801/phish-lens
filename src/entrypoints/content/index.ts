import { analyzeSender } from '../../core';
import { isExtensionDev } from '../../env';
import { buildDemoBannerResult } from '../../storage/demoResult';
import { addToWhitelist, loadSettings, type Settings } from '../../storage/settings';
import { markHiddenForSession, observeGmailMessages, type SenderInfo } from './gmailDom';
import { removeAllBanners, removeBannerForMount, renderBanner } from './banner';

export default defineContentScript({
  matches: ['https://mail.google.com/*'],
  runAt: 'document_idle',
  main() {
    let settings: Settings | null = null;
    let lastKey = '';
    let lastInfo: SenderInfo | null = null;

    const refreshSettings = async () => {
      settings = await loadSettings();
    };

    const processMessage = (info: SenderInfo) => {
      lastInfo = info;
      if (!settings?.enabled) {
        removeAllBanners();
        return;
      }

      const bannerKey = `${info.messageKey}:${settings.sensitivity}:${settings.locale}:${settings.demoInvertSeverity}:${settings.whitelist.join(',')}`;
      if (bannerKey === lastKey && info.mountParent.querySelector('[data-phish-lens-banner]')) {
        return;
      }
      lastKey = bannerKey;

      const result = analyzeSender(info.rawAddress, {
        whitelist: settings.whitelist,
        locale: settings.locale,
        sensitivity: settings.sensitivity,
      });

      if (isExtensionDev() && settings.demoInvertSeverity) {
        if (result.severity !== 'safe') {
          removeBannerForMount(info.mountParent);
          return;
        }
        if (!result.sender.domain) {
          removeBannerForMount(info.mountParent);
          return;
        }
        const demo = buildDemoBannerResult(result, settings.locale);
        renderBanner(info.mountParent, demo, settings.locale, {
          onTrust: async () => {
            await addToWhitelist(result.sender.registrableDomain);
            removeBannerForMount(info.mountParent);
            lastKey = '';
          },
          onDismiss: () => {
            markHiddenForSession(info.messageKey);
            removeBannerForMount(info.mountParent);
            lastKey = '';
          },
        });
        return;
      }

      if (result.severity === 'safe') {
        removeBannerForMount(info.mountParent);
        return;
      }

      renderBanner(info.mountParent, result, settings.locale, {
        onTrust: async () => {
          await addToWhitelist(result.sender.registrableDomain);
          removeBannerForMount(info.mountParent);
          lastKey = '';
        },
        onDismiss: () => {
          markHiddenForSession(info.messageKey);
          removeBannerForMount(info.mountParent);
          lastKey = '';
        },
      });
    };

    void refreshSettings().then(() => {
      observeGmailMessages(processMessage);
    });

    browser.storage.onChanged.addListener((changes, area) => {
      if (area !== 'local' || !changes.phishLensSettings) return;
      void refreshSettings().then(() => {
        lastKey = '';
        if (!settings?.enabled) {
          removeAllBanners();
          return;
        }
        if (lastInfo) processMessage(lastInfo);
      });
    });
  },
});