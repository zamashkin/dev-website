(() => {
  const STORAGE_KEY = 'language';
  const DEFAULT_LANGUAGE = 'en';
  // Browser languages whose speakers get the Russian version by default.
  const LANGUAGE_ALIASES = { uk: 'ru', be: 'ru', kk: 'ru' };

  // English page text is read from the markup; only strings set by scripts live here.
  const translations = {
    en: {
      'experience.readMore': 'Read more',
      'experience.showLess': 'Show less',
      'contacts.copying': 'Copying…',
      'contacts.copied': 'Copied',
      'contacts.copyFailed': 'Copy failed — retry',
    },
    ru: {
      'meta.title': 'Александр Замашкин',
      'meta.description': 'Senior фронтенд-разработчик, опыт более 7 лет',
      'language.group': 'Язык',
      'hero.name': 'АЛЕКСАНДР <br>ЗАМАШКИН',
      'hero.role': 'СТАРШИЙ FRONTEND РАЗРАБОТЧИК',
      'hero.availableLabel': 'Доступен',
      'hero.availability': 'ОТКРЫТ К ПРЕДЛОЖЕНИЯМ',
      'hero.pitch': 'Фронтенд-разработчик с опытом более 7 лет, создаю веб-продукты на всех этапах их жизненного цикла. Работал над продуктами на ранней стадии, помогая проверять гипотезы и превращать идеи в работающие решения, а также над крупными, критически важными для бизнеса системами со сложной архитектурой и бизнес-логикой.',
      'hero.videoLabel': 'Анимированный ASCII-портрет',
      'hero.actionsLabel': 'Основные действия',
      'hero.cv': 'Открыть CV',
      'hero.cvHref': 'assets/documents/Aleksandr_Zamashkin_Frontend_RU.pdf',
      'hero.contacts': 'Контакты',
      'experience.title': 'Опыт',
      'experience.intro': 'Карьера, построенная на качестве, продуктовом мышлении и растущей технической ответственности.',
      'experience.path': 'Качество <span aria-hidden="true">→</span> Продуктовое мышление <span aria-hidden="true">→</span> Техническая ответственность <span aria-hidden="true">→</span> Решения в стартапе',
      'experience.timelineLabel': 'Хронология опыта работы',
      'experience.readMore': 'Подробнее',
      'experience.showLess': 'Свернуть',
      'aventica.chapter': '01 / ФУНДАМЕНТ КАЧЕСТВА',
      'aventica.meta': 'QA-инженер <span aria-hidden="true">|</span> 2018–2019',
      'aventica.story': '<p>Я начинал карьеру в QA, уже зная HTML и CSS. Изучив Python, стал использовать его для автоматизации тестов: параллельно с тестированием набирался практического опыта в программировании и в итоге автоматизировал 89% тест-кейсов.</p><p>Меня особенно интересовали интерфейсы и пользовательский опыт, поэтому, когда появилась возможность перейти во фронтенд-разработку, я ею воспользовался.</p>',
      'aventica.outcome': 'тест-кейсов автоматизировано',
      'mel.chapter': '02 / ПОНИМАНИЕ ЗАДАЧ БИЗНЕСА',
      'mel.meta': 'Фронтенд-разработчик <span aria-hidden="true">|</span> 2019–2020',
      'mel.story': '<p>В Mel.fm я делал интерфейсы для читателей и инструменты для редакции. Работа с редакторами и маркетингом научила меня понимать цели, которые стоят за их запросами, и связывать фронтенд-задачи с потребностями бизнеса.</p><p>Кроме того, я получил опыт развития продукта, которым пользуются миллионы читателей. Участвовал в модернизации фронтенда при переходе с legacy-кода на Closure на React и внедрил AMP-страницы, которые сократили время загрузки на мобильных устройствах на 47%.</p>',
      'mel.outcome': 'сокращение времени загрузки на мобильных',
      'raiffeisen.chapter': '03 / РОСТ ОТВЕТСТВЕННОСТИ',
      'raiffeisen.company': 'Райффайзенбанк',
      'raiffeisen.meta': 'Фронтенд-разработчик <span aria-hidden="true">|</span> 2021–2026',
      'raiffeisen.story': '<p>Я пришёл в уже работающий продукт для уплаты налогов малым и средним бизнесом. Сначала реализовывал задачи, поставленные аналитиками, и учился работать в Scrum-команде. Когда зона ответственности команды расширилась до четырёх продуктов, я помог с нуля создать три новых сервиса: выплаты сотрудникам, автоматическое накопление на налоги и налоговый счёт для отслеживания налоговых списаний в специальной государственной системе (ЕНС).</p><p>Фронтенд трёх продуктов я вёл в основном самостоятельно, а над четвёртым работал вместе с коллегами. Со временем стал отвечать за фичи целиком, активно участвовал в планировании, и ко мне начали обращаться за продуктовым контекстом. Регулярно проводил код-ревью и разбирал технические вопросы с коллегами: делился знаниями и сам советовался.</p><p>Постепенно в мою зону ответственности вошли архитектурные решения и долгосрочная поддерживаемость. Я выступал за независимые микрофронтенд-модули, чтобы продукты можно было релизить отдельно, а их кодовые базы оставались управляемыми, при общем технологическом стеке и дизайн-системе банка. В рамках масштабного архитектурного перехода банка я вынес приложение из legacy-монорепозитория: время сборки сократилось на 67%, а межкомандные согласования релизов больше не требовались.</p><p>Моя работа не ограничивалась нашими продуктами. Я хорошо изучил фронтенд-архитектуру банка и вносил изменения в продукты других команд при интеграции нашей функциональности, согласовывая с ними технические решения, когда это было нужно. Для единой точки входа, которую запросили продакт-менеджеры, я спроектировал и реализовал интеграцию, которая переиспользовала существующие микрофронтенды и сохраняла раздельные репозитории. Это сократило объём работ и позволило обеим командам разрабатывать и релизить независимо.</p>',
      'raiffeisen.usersValue': '20&nbsp;000+',
      'raiffeisen.usersOutcome': 'пользователей интеграции подписания',
      'raiffeisen.buildOutcome': 'сокращение времени сборки',
      'intrepid.chapter': '04 / РЕШЕНИЯ В СТАРТАПЕ',
      'intrepid.meta': 'Фронтенд-разработчик <span aria-hidden="true">|</span> 2024–2025',
      'intrepid.contract': '<span>Контракт, частичная занятость</span> Параллельно с Райффайзенбанком',
      'intrepid.story': '<p>Параллельно с работой в банке я присоединился к AI-продукту на ранней стадии, который разрабатывался на Vue и Nuxt. В стартапе я больше участвовал в выборе технологий, взвешивая сиюминутные задачи и будущее развитие продукта.</p><p>Я участвовал в редизайне KYB-онбординга, после которого доля пользователей, прошедших его до конца, выросла с 13% до 26%. Также вместе с коллегой разрабатывал интерактивный интерфейс отчётов для исследования сложных графов зависимостей и помогал выбрать библиотеку визуализации с учётом требовательного дизайна, потенциально больших графов, совместимости с Vue и активной поддержки.</p><p>Этот опыт расширил мой технический кругозор и дал больше практики в выборе инструментов под нужды развивающегося продукта.</p>',
      'intrepid.outcome': 'прохождение KYB-онбординга',
      'stack.title': 'Стек',
      'stack.label': 'Стек технологий',
      'contacts.title': 'Контакты',
      'contacts.linkedinLabel': 'Открыть профиль Александра в LinkedIn (в новой вкладке)',
      'contacts.telegramLabel': 'Написать Александру в Telegram (в новой вкладке)',
      'contacts.whatsappLabel': 'Написать Александру в WhatsApp (в новой вкладке)',
      'contacts.githubLabel': 'Открыть профиль Александра на GitHub (в новой вкладке)',
      'contacts.emailLabel': 'Написать письмо',
      'contacts.email': 'Почта',
      'contacts.copyEmail': '<span aria-hidden="true">▣</span> Скопировать',
      'contacts.copying': 'Копирование…',
      'contacts.copied': 'Скопировано',
      'contacts.copyFailed': 'Не удалось — повторить',
    },
  };
  const languages = Object.keys(translations);
  const PENDING_CLASS = 'i18n-pending';

  const readStoredLanguage = () => {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  };

  const storeLanguage = (language) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, language);
    } catch { /* The choice still applies to the current page. */ }
  };

  const detectLanguage = () => {
    const stored = readStoredLanguage();
    if (languages.includes(stored)) return stored;

    const preferred = navigator.languages?.length ? navigator.languages : [navigator.language];
    for (const tag of preferred) {
      const base = String(tag || '').toLowerCase().split('-')[0];
      const language = LANGUAGE_ALIASES[base] ?? base;
      if (languages.includes(language)) return language;
    }
    return DEFAULT_LANGUAGE;
  };

  let currentLanguage = DEFAULT_LANGUAGE;
  const t = (key) => translations[currentLanguage][key] ?? translations.en[key];

  let textElements = [];
  let labelElements = [];
  let contentElements = [];
  let hrefElements = [];
  let switchButtons = [];

  const applyLanguage = (language) => {
    currentLanguage = language;
    document.documentElement.lang = language;
    textElements.forEach((element) => { element.innerHTML = t(element.dataset.i18n); });
    labelElements.forEach((element) => { element.setAttribute('aria-label', t(element.dataset.i18nLabel)); });
    contentElements.forEach((element) => { element.setAttribute('content', t(element.dataset.i18nContent)); });
    hrefElements.forEach((element) => { element.setAttribute('href', t(element.dataset.i18nHref)); });
    document.querySelectorAll('[data-story-toggle]').forEach((button) => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      button.textContent = t(isExpanded ? 'experience.showLess' : 'experience.readMore');
    });
    switchButtons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.language === language));
    });
  };

  const initialLanguage = detectLanguage();
  // Hide the English markup until it is translated so it never paints first.
  if (initialLanguage !== DEFAULT_LANGUAGE) {
    document.documentElement.lang = initialLanguage;
    document.documentElement.classList.add(PENDING_CLASS);
  }

  let isTranslated = false;
  const translatePage = () => {
    if (isTranslated) return;
    isTranslated = true;
    textElements = Array.from(document.querySelectorAll('[data-i18n]'));
    labelElements = Array.from(document.querySelectorAll('[data-i18n-label]'));
    contentElements = Array.from(document.querySelectorAll('[data-i18n-content]'));
    hrefElements = Array.from(document.querySelectorAll('[data-i18n-href]'));
    switchButtons = Array.from(document.querySelectorAll('[data-language]'));

    textElements.forEach((element) => {
      translations.en[element.dataset.i18n] ??= element.innerHTML;
    });
    labelElements.forEach((element) => {
      translations.en[element.dataset.i18nLabel] ??= element.getAttribute('aria-label');
    });
    contentElements.forEach((element) => {
      translations.en[element.dataset.i18nContent] ??= element.getAttribute('content');
    });
    hrefElements.forEach((element) => {
      translations.en[element.dataset.i18nHref] ??= element.getAttribute('href');
    });

    switchButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const language = button.dataset.language;
        if (language === currentLanguage) return;
        applyLanguage(language);
        storeLanguage(language);
        window.posthog?.capture?.('language_changed', { language });
      });
    });

    try {
      applyLanguage(initialLanguage);
      switchButtons[0]?.parentElement?.removeAttribute('hidden');
    } finally {
      document.documentElement.classList.remove(PENDING_CLASS);
    }
  };

  window.siteI18n = { t, translatePage, get language() { return currentLanguage; } };

  // Loaded from <head>: index.html calls translatePage right after <main>, and
  // DOMContentLoaded is the fallback if that call is missing.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', translatePage, { once: true });
  } else {
    translatePage();
  }
})();
