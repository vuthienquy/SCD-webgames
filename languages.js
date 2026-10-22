
(function () {
    "use strict";

    const STORAGE_KEY = "scd-language";

    function getLanguage() {
        try {
            return localStorage.getItem(STORAGE_KEY) === "vi"
                ? "vi"
                : "en";
        } catch {
            return "en";
        }
    }

    function setLanguage(language) {
        if (language !== "vi" && language !== "en") return;

        try {
            localStorage.setItem(STORAGE_KEY, language);
        } catch {
            // Website vẫn hoạt động nếu không lưu được.
        }

        applyLanguage(language);
    }

    function applyLanguage(language) {
        const translations = window.pageTranslations;

        if (!translations || !translations[language]) return;

        document.documentElement.lang = language;

        document.querySelectorAll("[data-i18n]").forEach(element => {
            const key = element.dataset.i18n;
            const translation = translations[language][key];

            if (translation !== undefined) {
                element.textContent = translation;
            }
        });

        document.querySelectorAll("[data-language-button]").forEach(button => {
            button.setAttribute(
                "aria-pressed",
                String(button.dataset.languageButton === language)
            );
        });

        document.dispatchEvent(
            new CustomEvent("scd-language-change", {
                detail: { language }
            })
        );
    }

    document.addEventListener("click", event => {
        const button = event.target.closest("[data-language-button]");

        if (button) {
            setLanguage(button.dataset.languageButton);
        }
    });

    window.SCDLanguage = {
        get: getLanguage,
        set: setLanguage,
        apply: applyLanguage
    };

    document.addEventListener("DOMContentLoaded", () => {
        applyLanguage(getLanguage());
    });
})();
