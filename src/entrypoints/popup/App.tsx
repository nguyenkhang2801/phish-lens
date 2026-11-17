import { useCallback, useEffect, useState } from 'react';
import type { Locale, Sensitivity } from '../../core/types';
import { isExtensionDev } from '../../env';
import {
  DEFAULT_SETTINGS,
  loadSettings,
  normalizeWhitelistDomain,
  saveSettings,
  type Settings,
} from '../../storage/settings';

const UI = {
  vi: {
    title: 'Phish Lens',
    enabled: 'Bật cảnh báo',
    sensitivity: 'Độ nhạy',
    locale: 'Ngôn ngữ',
    whitelist: 'Danh sách tin cậy',
    addDomain: 'Thêm domain',
    add: 'Thêm',
    remove: 'Xóa',
    strict: 'Nghiêm (strict)',
    balanced: 'Cân bằng (balanced)',
    relaxed: 'Thoải mái (relaxed)',
    vietnamese: 'Tiếng Việt',
    english: 'English',
    hint: 'Chỉ phân tích địa chỉ người gửi trên máy bạn.',
    demoInvert: 'Chế độ thử banner (đảo logic)',
    demoInvertHelp:
      'Bật: mail thường được coi là an toàn sẽ hiện banner để test UI. Tắt sau khi xong.',
  },
  en: {
    title: 'Phish Lens',
    enabled: 'Enable warnings',
    sensitivity: 'Sensitivity',
    locale: 'Language',
    whitelist: 'Trusted domains',
    addDomain: 'Add domain',
    add: 'Add',
    remove: 'Remove',
    strict: 'Strict',
    balanced: 'Balanced',
    relaxed: 'Relaxed',
    vietnamese: 'Tiếng Việt',
    english: 'English',
    hint: 'Sender analysis runs locally on your device.',
    demoInvert: 'Banner demo mode (invert logic)',
    demoInvertHelp:
      'On: “safe” senders show a warning banner for UI testing. Turn off when done.',
  },
} as const;

export default function App() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [domainInput, setDomainInput] = useState('');
  const [uiLocale, setUiLocale] = useState<Locale>('vi');

  useEffect(() => {
    void loadSettings().then((s) => {
      setSettings(s);
      setUiLocale(s.locale);
    });
  }, []);

  const persist = useCallback(async (next: Settings) => {
    setSettings(next);
    await saveSettings(next);
  }, []);

  const t = UI[uiLocale];

  const onToggle = (enabled: boolean) => void persist({ ...settings, enabled });

  const onDemoInvert = (demoInvertSeverity: boolean) =>
    void persist({ ...settings, demoInvertSeverity });

  const onSensitivity = (sensitivity: Sensitivity) => void persist({ ...settings, sensitivity });

  const onLocale = (locale: Locale) => {
    setUiLocale(locale);
    void persist({ ...settings, locale });
  };

  const addDomain = () => {
    const domain = normalizeWhitelistDomain(domainInput);
    if (!domain || settings.whitelist.includes(domain)) return;
    void persist({ ...settings, whitelist: [...settings.whitelist, domain] });
    setDomainInput('');
  };

  const removeDomain = (domain: string) => {
    void persist({
      ...settings,
      whitelist: settings.whitelist.filter((d) => d !== domain),
    });
  };

  return (
    <main className="popup">
      <h1>{t.title}</h1>
      <p className="hint">{t.hint}</p>

      <label className="row">
        <input
          type="checkbox"
          checked={settings.enabled}
          onChange={(e) => onToggle(e.target.checked)}
        />
        {t.enabled}
      </label>

      {isExtensionDev() && (
        <>
          <label className="row demo">
            <input
              type="checkbox"
              checked={settings.demoInvertSeverity}
              onChange={(e) => onDemoInvert(e.target.checked)}
            />
            {t.demoInvert}
          </label>
          <p className="demo-hint">{t.demoInvertHelp}</p>
        </>
      )}

      <label className="field">
        <span>{t.sensitivity}</span>
        <select
          value={settings.sensitivity}
          onChange={(e) => onSensitivity(e.target.value as Sensitivity)}
        >
          <option value="strict">{t.strict}</option>
          <option value="balanced">{t.balanced}</option>
          <option value="relaxed">{t.relaxed}</option>
        </select>
      </label>

      <label className="field">
        <span>{t.locale}</span>
        <select value={settings.locale} onChange={(e) => onLocale(e.target.value as Locale)}>
          <option value="vi">{t.vietnamese}</option>
          <option value="en">{t.english}</option>
        </select>
      </label>

      <section>
        <h2>{t.whitelist}</h2>
        <div className="row add">
          <input
            type="text"
            placeholder={t.addDomain}
            value={domainInput}
            onChange={(e) => setDomainInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addDomain()}
          />
          <button type="button" onClick={addDomain}>
            {t.add}
          </button>
        </div>
        <ul className="whitelist">
          {settings.whitelist.map((d) => (
            <li key={d}>
              <span>{d}</span>
              <button type="button" className="link" onClick={() => removeDomain(d)}>
                {t.remove}
              </button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}