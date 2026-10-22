/* Shared language state and translation helpers. Load translations.js first. */
(() => {
    "use strict";

    if (window.SCDLanguage) return;

    const STORAGE_KEY = "scd-language";

    function normalize(language) {
        return language === "vi" ? "vi" : "en";
    }

    function getLanguage() {
        try {
            return normalize(localStorage.getItem(STORAGE_KEY));
        } catch {
            return "en";
        }
    }

    function setLanguage(language) {
        const selected = normalize(language);
        try {
            localStorage.setItem(STORAGE_KEY, selected);
        } catch {
            // Language can still be changed for this page if storage is unavailable.
        }
        document.documentElement.lang = selected;
        window.dispatchEvent(new CustomEvent("scd-language-change", {
            detail: { language: selected }
        }));
        return selected;
    }

    function text(namespace, key, language = getLanguage()) {
        const dictionaries = window.SCDTranslations || {};
        const group = dictionaries[namespace] || {};
        return group[normalize(language)]?.[key]
            ?? group.en?.[key]
            ?? key;
    }

    function translateElements(container, namespace, attribute = "data-i18n", language = getLanguage()) {
        if (!container) return;
        const elements = [];
        if (container.matches?.(`[${attribute}]`)) elements.push(container);
        elements.push(...container.querySelectorAll(`[${attribute}]`));
        for (const element of elements) {
            const key = element.getAttribute(attribute);
            const translated = text(namespace, key, language);
            if (translated !== key) element.textContent = translated;
        }
    }

    window.SCDLanguage = { getLanguage, setLanguage, text, translateElements };
})();
