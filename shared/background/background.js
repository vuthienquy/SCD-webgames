/* Shared entry point for page background effects.
 * The page selects its existing effect with body[data-background].
 * The actual effect implementations remain separate to preserve each page's design.
 */
(() => {
    const mode = document.body.dataset.background;

    if (mode === "home") {
        // Homepage's neural network and floating 3D objects.
        const script = document.createElement("script");
        script.src = "./shared/background/home-effect.js";
        document.body.appendChild(script);
    } else if (mode === "menu") {
        // Menu's floating particles and connecting lines.
        const script = document.createElement("script");
        script.src = "../shared/background/menu-effect.js";
        document.body.appendChild(script);
    }
})();
