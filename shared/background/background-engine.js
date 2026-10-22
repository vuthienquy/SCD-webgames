
import { createNetwork } from "./network.js";
import {
    createObjectSet,
    createFloatingObject,
    OBJECT_TYPES
} from "../objects/factory.js";
import { drawObject, updateObjects } from "../objects/index.js";
import { updateRotation3D } from "../objects/rotation.js";

export function startBackground({ objectsEnabled = false } = {}) {
    const canvas = document.getElementById("background");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const random = (min, max) => Math.random() * (max - min) + min;
    const mobile = () => window.innerWidth < 600;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let lastTime = 0;
    let animationId = null;
    let objects = [];

    const network = createNetwork(
        random,
        () => width,
        () => height,
        mobile
    );

    function resize() {
        const oldWidth = width;
        const oldHeight = height;

        width = window.innerWidth;
        height = window.innerHeight;
        dpr = Math.min(window.devicePixelRatio || 1, 1.75);

        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const first = !oldWidth || !oldHeight;

        network.resize(
            first ? 1 : width / oldWidth,
            first ? 1 : height / oldHeight,
            first
        );

        if (!objectsEnabled) return;

        if (first) {
            objects = createObjectSet(width, height, mobile, random);
            return;
        }

        objects.forEach(object => {
            object.x *= width / oldWidth;
            object.y *= height / oldHeight;
        });

        const wanted = mobile() ? 10 : 18;

        while (objects.length > wanted) objects.pop();

        while (objects.length < wanted) {
            objects.push(
                createFloatingObject(
                    OBJECT_TYPES[objects.length % OBJECT_TYPES.length],
                    true,
                    width,
                    height,
                    random
                )
            );
        }
    }

    function render(timestamp) {
        if (document.hidden) {
            animationId = null;
            return;
        }

        const dt = lastTime
            ? Math.min((timestamp - lastTime) / 16.67, 2)
            : 1;

        lastTime = timestamp;

        ctx.clearRect(0, 0, width, height);

        network.update(dt, width, height);
        network.draw(ctx, timestamp);

        if (objectsEnabled) {
            updateObjects(
                objects,
                dt,
                width,
                height,
                random,
                createFloatingObject,
                updateRotation3D
            );

            for (const object of objects) {
                drawObject(ctx, object);
            }
        }

        animationId = requestAnimationFrame(render);
    }

    function start() {
        if (animationId !== null || document.hidden) return;

        lastTime = 0;
        animationId = requestAnimationFrame(render);
    }

    function stop() {
        if (animationId !== null) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    }

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) stop();
        else start();
    });

    window.addEventListener("resize", resize);

    resize();
    start();
}
