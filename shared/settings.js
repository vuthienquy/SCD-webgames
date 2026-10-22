
(() => {
    "use strict";

    // Prevent accidentally creating the component twice.
    if (window.SCDSettings) return;

    const translations = window.SCDTranslations.settings;

    function getLanguage() {
        return window.SCDLanguage.getLanguage();
    }

    function createSettings() {
        if (document.getElementById("settings-open")) return;

        const root = document.createElement("div");
        root.id = "scd-settings-root";

        root.innerHTML = `
            <button class="settings-button"
                    id="settings-open"
                    type="button"
                    aria-haspopup="dialog"
                    aria-controls="settings-dialog">
                <svg class="settings-icon"
                     viewBox="0 0 24 24"
                     fill="none"
                     stroke="currentColor"
                     stroke-width="1.7"
                     stroke-linecap="round"
                     stroke-linejoin="round"
                     aria-hidden="true">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82
                    l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06
                    a1.65 1.65 0 0 0-1.82-.33
                    1.65 1.65 0 0 0-1 1.51V21
                    a2 2 0 1 1-4 0v-.09
                    a1.65 1.65 0 0 0-1-1.51
                    1.65 1.65 0 0 0-1.82.33l-.06.06
                    a2 2 0 1 1-2.83-2.83l.06-.06
                    A1.65 1.65 0 0 0 4.68 15
                    a1.65 1.65 0 0 0-1.51-1H3
                    a2 2 0 1 1 0-4h.09
                    a1.65 1.65 0 0 0 1.51-1.08
                    1.65 1.65 0 0 0-.33-1.82l-.06-.06
                    a2 2 0 1 1 2.83-2.83l.06.06
                    A1.65 1.65 0 0 0 9 4.68
                    a1.65 1.65 0 0 0 1-1.51V3
                    a2 2 0 1 1 4 0v.09
                    a1.65 1.65 0 0 0 1 1.51
                    1.65 1.65 0 0 0 1.82-.33l.06-.06
                    a2 2 0 1 1 2.83 2.83l-.06.06
                    A1.65 1.65 0 0 0 19.4 9
                    a1.65 1.65 0 0 0 1.51 1H21
                    a2 2 0 1 1 0 4h-.09
                    a1.65 1.65 0 0 0-1.51 1Z"/>
                </svg>
                <span class="settings-word"
                      data-settings-i18n="settings">SETTINGS</span>
            </button>

            <div class="settings-overlay"
                 id="settings-dialog"
                 role="dialog"
                 aria-modal="true"
                 aria-labelledby="settings-title">
                <section class="settings-panel">
                    <div class="settings-heading">
                        <h2 id="settings-title"
                            data-settings-i18n="settings">SETTINGS</h2>

                        <button class="settings-close"
                                id="settings-close"
                                type="button"
                                aria-label="Close settings">&times;</button>
                    </div>

                    <span class="settings-label"
                          data-settings-i18n="language">LANGUAGE</span>

                    <div class="language-options">
                        <button class="language-option"
                                type="button"
                                data-language="vi"
                                aria-pressed="false">
                            <svg viewBox="0 0 60 40"
                                 xmlns="http://www.w3.org/2000/svg"
                                 aria-label="Vietnam flag">
                                <rect width="60" height="40" fill="#da251d"/>
                                <path d="M30 7.2 35.2 22.4 51.4 22.4
                                38.3 31.8 43.3 47 30 37.5
                                16.7 47 21.7 31.8 8.6 22.4
                                24.8 22.4Z"
                                      fill="#ffde00"
                                      transform="translate(0 -7)"/>
                            </svg>
                            <span>Tiếng Việt</span>
                        </button>

                        <button class="language-option"
                                type="button"
                                data-language="en"
                                aria-pressed="false">
                            <svg viewBox="0 0 60 40"
                                 xmlns="http://www.w3.org/2000/svg"
                                 aria-label="United States flag">
                                <rect width="60" height="40" fill="#fff"/>
                                <path d="M0 0h60v3.08H0zm0 6.15h60v3.08H0
                                zm0 6.16h60v3.08H0zm0 6.15h60v3.08H0
                                zm0 6.15h60v3.08H0zm0 6.16h60v3.08H0
                                zm0 6.15h60v3.08H0z"
                                      fill="#b22234"/>
                                <rect width="26" height="21.6" fill="#3c3b6e"/>
                                <g fill="#fff">
                                    <circle cx="4" cy="4" r="1"/>
                                    <circle cx="12" cy="4" r="1"/>
                                    <circle cx="20" cy="4" r="1"/>
                                    <circle cx="8" cy="8" r="1"/>
                                    <circle cx="16" cy="8" r="1"/>
                                    <circle cx="4" cy="12" r="1"/>
                                    <circle cx="12" cy="12" r="1"/>
                                    <circle cx="20" cy="12" r="1"/>
                                    <circle cx="8" cy="16" r="1"/>
                                    <circle cx="16" cy="16" r="1"/>
                                    <circle cx="4" cy="20" r="1"/>
                                    <circle cx="12" cy="20" r="1"/>
                                    <circle cx="20" cy="20" r="1"/>
                                </g>
                            </svg>
                            <span>English</span>
                        </button>
                    </div>

                    <p class="settings-hint"
                       data-settings-i18n="languageHint">
                        Your language preference is saved for this website.
                    </p>
                </section>
            </div>
        `;

// Đặt Settings root trực tiếp dưới body để popup độc lập với header.
document.body.appendChild(root);

const navRight = document.querySelector(".nav-right");
const openButton = root.querySelector("#settings-open");

// Nếu trang có thanh điều hướng, chỉ chuyển nút Settings sang đó.
if (navRight) {
    navRight.appendChild(openButton);
}

        const overlay = root.querySelector("#settings-dialog");
        const closeButton = root.querySelector("#settings-close");
        const languageButtons = root.querySelectorAll("[data-language]");

        function translateSettingsElements(container, language) {
            container.querySelectorAll("[data-settings-i18n]").forEach(element => {
                const key = element.dataset.settingsI18n;
                const translated = translations[language][key];
                if (translated !== undefined) element.textContent = translated;
            });
        }

        function applyLanguage(language) {
            const selected = translations[language] ? language : "en";

            window.SCDLanguage.setLanguage(selected);
            document.documentElement.lang = selected;

            // The popup stays inside root; the Settings button is moved into .nav-right.
            translateSettingsElements(root, selected);
            translateSettingsElements(openButton, selected);

            languageButtons.forEach(button => {
                button.setAttribute(
                    "aria-pressed",
                    String(button.dataset.language === selected)
                );
            });

            window.dispatchEvent(new CustomEvent("scd-language-change", {
                detail: { language: selected }
            }));
        }

        function openSettings() {
            overlay.classList.add("is-open");
            closeButton.focus();
        }

        function closeSettings() {
            overlay.classList.remove("is-open");
            openButton.focus();
        }

        openButton.addEventListener("click", openSettings);
        closeButton.addEventListener("click", closeSettings);

        overlay.addEventListener("click", event => {
            if (event.target === overlay) closeSettings();
        });

        document.addEventListener("keydown", event => {
            if (
                event.key === "Escape" &&
                overlay.classList.contains("is-open")
            ) {
                closeSettings();
            }
        });

        languageButtons.forEach(button => {
            button.addEventListener("click", () => {
                applyLanguage(button.dataset.language);
            });
        });

        applyLanguage(getLanguage());

        window.SCDSettings = {
            getLanguage,
            applyLanguage,
            open: openSettings,
            close: closeSettings
        };
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", createSettings, {
            once: true
        });
    } else {
        createSettings();
    }
})();
