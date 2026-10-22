// Lightweight neuron background: moving points and connecting lines only.
import { createNetwork } from "./network.js";

(() => {
    "use strict";
    const canvas = document.getElementById("background");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const random = (min, max) => Math.random() * (max - min) + min;
    const mobile = () => window.innerWidth < 600;
    let width = 0, height = 0, dpr = 1, lastTime = 0, animationId = null;
    const network = createNetwork(random, () => width, () => height, mobile);

    function resize() {
        const oldWidth = width, oldHeight = height;
        width = window.innerWidth; height = window.innerHeight;
        dpr = Math.min(window.devicePixelRatio || 1, 1.75);
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        network.resize(oldWidth && oldHeight ? width / oldWidth : 1,
            oldWidth && oldHeight ? height / oldHeight : 1, !oldWidth || !oldHeight);
    }
    function render(timestamp) {
        if (document.hidden) { animationId = null; return; }
        const dt = lastTime ? Math.min((timestamp - lastTime) / 16.67, 2) : 1;
        lastTime = timestamp;
        ctx.clearRect(0, 0, width, height);
        network.update(dt, width, height);
        network.draw(ctx, timestamp);
        animationId = requestAnimationFrame(render);
    }
    function start() {
        if (animationId !== null) return;
        lastTime = 0;
        animationId = requestAnimationFrame(render);
    }
    function stop() {
        if (animationId !== null) { cancelAnimationFrame(animationId); animationId = null; }
    }
    document.addEventListener("visibilitychange", () => { if (document.hidden) stop(); else start(); });
    window.addEventListener("resize", resize);
    resize();
    start();
})();
