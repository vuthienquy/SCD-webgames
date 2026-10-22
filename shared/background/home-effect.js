(() => {
    "use strict";

    const canvas = document.getElementById("background");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const random = (min, max) => Math.random() * (max - min) + min;
    const mobile = () => window.innerWidth < 600;

    const LINK_DISTANCE = 155;
    const TYPES = [
        "knight", "pawn", "queen", "rook",
        "board", "chip", "money", "revolver", "bullet"
    ];

    let width = 0;
    let height = 0;
    let dpr = 1;
    let nodes = [];
    let objects = [];
    let lastTime = 0;
    let time = 0;
    let animationId = null;

    // ==========================================
    // 3D ROTATION SYSTEM
    // Every object rotates around X, Y and Z axes.
    // Canvas 2D simulates depth using perspective.
    // ==========================================

    function rotateX(p, a) {
        const c = Math.cos(a);
        const s = Math.sin(a);
        return {
            x: p.x,
            y: p.y * c - p.z * s,
            z: p.y * s + p.z * c
        };
    }

    function rotateY(p, a) {
        const c = Math.cos(a);
        const s = Math.sin(a);
        return {
            x: p.x * c + p.z * s,
            y: p.y,
            z: -p.x * s + p.z * c
        };
    }

    function rotateZ(p, a) {
        const c = Math.cos(a);
        const s = Math.sin(a);
        return {
            x: p.x * c - p.y * s,
            y: p.x * s + p.y * c,
            z: p.z
        };
    }

    function project3D(point, rotation) {
        let p = rotateX(point, rotation.x);
        p = rotateY(p, rotation.y);
        p = rotateZ(p, rotation.z);

        const perspective = 420;
        const factor = perspective / (perspective + p.z);

        return {
            x: p.x * factor,
            y: p.y * factor,
            scale: factor
        };
    }

    function makeRotation3D() {
        return {
            x: random(0, Math.PI * 2),
            y: random(0, Math.PI * 2),
            z: random(0, Math.PI * 2),

            vx: random(-0.004, 0.004),
            vy: random(-0.004, 0.004),
            vz: random(-0.009, 0.009)
        };
    }

    function updateRotation3D(o, dt) {
        const r = o.rotation3D;

        r.x += r.vx * dt;
        r.y += r.vy * dt;
        r.z += r.vz * dt;

        // Keep angles within a manageable range.
        r.x %= Math.PI * 2;
        r.y %= Math.PI * 2;
        r.z %= Math.PI * 2;
    }

    // Shared transform for every drawing.
    // X/Y tilt changes the apparent shape; Z spins it.
    function with3D(o, draw) {
        ctx.save();
        ctx.translate(o.x, o.y);

        const projected = project3D(
            { x: 0, y: 0, z: 0 },
            o.rotation3D
        );

        ctx.rotate(o.rotation3D.z);
        ctx.scale(
            o.scale * o.depth * Math.max(0.12, Math.abs(Math.cos(o.rotation3D.y))),
            o.scale * o.depth * Math.max(0.12, Math.abs(Math.cos(o.rotation3D.x)))
        );

        // Tiny perspective-related size change.
        ctx.globalAlpha *= Math.max(0.65, Math.min(1.25, projected.scale));

        draw();
        ctx.restore();
    }

    // ==========================================
    // OBJECT CREATION
    // ==========================================

    function makeNode() {
        return {
            x: random(0, width),
            y: random(0, height),
            vx: random(-0.65, 0.65),
            vy: random(-0.65, 0.65),
            radius: random(0.8, 1.9),
            life: random(0, 1),
            lifeSpeed: random(0.035, 0.09),
            phase: random(0, Math.PI * 2)
        };
    }

    function makeObject(type, initial = false) {
        let x;
        let y;

        if (initial) {
            x = random(0, width);
            y = random(0, height);
        } else {
            const edge = Math.floor(random(0, 4));

            if (edge === 0) {
                x = random(0, width);
                y = -80;
            } else if (edge === 1) {
                x = width + 80;
                y = random(0, height);
            } else if (edge === 2) {
                x = random(0, width);
                y = height + 80;
            } else {
                x = -80;
                y = random(0, height);
            }
        }

        const direction = random(0, Math.PI * 2);
        const speed = random(0.25, 1.0);

        return {
            type,
            x,
            y,
            vx: Math.cos(direction) * speed,
            vy: Math.sin(direction) * speed,

            angle: random(0, Math.PI * 2),
            spin: random(-0.01, 0.01),
            rotation3D: makeRotation3D(),

            scale: random(0.7, 1.25),
            size: random(23, 43),
            depth: random(0.7, 1.3),

            life: initial ? random(0.1, 0.8) : 0,
            duration: random(24000, 42000),

            baseOpacity: random(0.3, 0.7),
            opacity: initial ? random(0.12, 0.4) : 0
        };
    }

    function setupObjects() {
        const count = mobile() ? 10 : 18;

        objects = Array.from({ length: count }, (_, i) =>
            makeObject(TYPES[i % TYPES.length], true)
        );
    }

    // ==========================================
    // RESIZE
    // ==========================================

    function resize() {
        const oldWidth = width;
        const oldHeight = height;

        width = window.innerWidth;
        height = window.innerHeight;
        dpr = Math.min(window.devicePixelRatio || 1, 1.75);

        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        if (!oldWidth || !oldHeight) {
            nodes = Array.from(
                { length: mobile() ? 42 : 85 },
                makeNode
            );
            setupObjects();
            return;
        }

        const sx = width / oldWidth;
        const sy = height / oldHeight;

        nodes.forEach(n => {
            n.x *= sx;
            n.y *= sy;
        });

        objects.forEach(o => {
            o.x *= sx;
            o.y *= sy;
        });

        const wanted = mobile() ? 10 : 18;

        while (objects.length > wanted) objects.pop();

        while (objects.length < wanted) {
            objects.push(
                makeObject(TYPES[objects.length % TYPES.length], true)
            );
        }
    }

    // ==========================================
    // NEURAL NETWORK BACKGROUND
    // ==========================================

    function nodeOpacity(n) {
        return Math.pow(
            Math.max(0, Math.sin(Math.PI * n.life)),
            1.4
        );
    }

    function updateNodes(dt) {
        for (const n of nodes) {
            n.x += n.vx * dt;
            n.y += n.vy * dt;
            n.phase += 0.025 * dt;
            n.life += n.lifeSpeed * dt / 60;

            if (n.life >= 1) Object.assign(n, makeNode());

            if (n.x < -5) n.x = width + 5;
            if (n.x > width + 5) n.x = -5;
            if (n.y < -5) n.y = height + 5;
            if (n.y > height + 5) n.y = -5;
        }
    }

    function drawNetwork() {
        for (let i = 0; i < nodes.length; i++) {
            const a = nodes[i];

            for (let j = i + 1; j < nodes.length; j++) {
                const b = nodes[j];
                const dx = b.x - a.x;
                const dy = b.y - a.y;
                const distance = Math.hypot(dx, dy);

                if (distance > LINK_DISTANCE) continue;

                const proximity = 1 - distance / LINK_DISTANCE;
                const life = Math.min(nodeOpacity(a), nodeOpacity(b));
                const alpha = proximity * life * 0.34;

                if (alpha < 0.008) continue;

                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.strokeStyle = `rgba(155,140,255,${alpha})`;
                ctx.lineWidth = 0.75;
                ctx.stroke();

                const pulse = (
                    time * 0.00028 + i * 0.13 + j * 0.07
                ) % 1;

                if (proximity > 0.35 && life > 0.4) {
                    ctx.beginPath();
                    ctx.arc(
                        a.x + dx * pulse,
                        a.y + dy * pulse,
                        1.15, 0, Math.PI * 2
                    );
                    ctx.fillStyle = `rgba(221,213,255,${alpha * 1.7})`;
                    ctx.fill();
                }
            }
        }

        for (const n of nodes) {
            const alpha = nodeOpacity(n);
            if (alpha < 0.01) continue;

            const radius = n.radius * (
                0.85 + Math.sin(n.phase) * 0.15
            );

            ctx.beginPath();
            ctx.arc(n.x, n.y, radius * 3.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(132,108,255,${alpha * 0.09})`;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(211,203,255,${alpha * 0.95})`;
            ctx.fill();
        }
    }

    // ==========================================
    // OBJECT DRAWING
    // All drawings use the shared 3D transform.
    // ==========================================

    function drawChess(o, glyph) {
        with3D(o, () => {
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.font = `${o.size * 1.45}px Georgia, serif`;
            ctx.fillStyle = `rgba(191,177,255,${o.opacity})`;
            ctx.shadowColor = "rgba(142,118,255,.35)";
            ctx.shadowBlur = 10;
            ctx.fillText(glyph, 0, 0);
        });
    }

    // A genuine 8 × 8 chessboard: 64 squares.
    function drawBoard(o) {
        with3D(o, () => {
            const size = o.size * 2.0;
            const cell = size / 8;

            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    const light = (row + col) % 2 === 0;

                    ctx.fillStyle = light
                        ? `rgba(179,161,255,${o.opacity * 0.9})`
                        : `rgba(55,48,91,${o.opacity * 0.9})`;

                    ctx.fillRect(
                        -size / 2 + col * cell,
                        -size / 2 + row * cell,
                        cell,
                        cell
                    );
                }
            }

            ctx.strokeStyle = `rgba(210,198,255,${o.opacity})`;
            ctx.lineWidth = 1.2;
            ctx.strokeRect(-size / 2, -size / 2, size, size);
        });
    }

    function drawChip(o) {
        with3D(o, () => {
            const r = o.size * 0.62;

            ctx.beginPath();
            ctx.arc(0, 0, r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(123,105,203,${o.opacity * 0.4})`;
            ctx.fill();

            ctx.strokeStyle = `rgba(192,177,255,${o.opacity})`;
            ctx.lineWidth = 4;
            ctx.setLineDash([5, 4]);
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(0, 0, r * 0.67, 0, Math.PI * 2);
            ctx.stroke();

            ctx.fillStyle = `rgba(211,200,255,${o.opacity})`;
            ctx.font = "bold 12px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("S", 0, 0);
        });
    }

    function drawMoney(o) {
        with3D(o, () => {
            const w = o.size * 1.8;
            const h = o.size * 0.92;

            ctx.fillStyle = `rgba(65,137,105,${o.opacity * 0.4})`;
            ctx.fillRect(-w / 2, -h / 2, w, h);

            ctx.strokeStyle = `rgba(138,213,173,${o.opacity})`;
            ctx.lineWidth = 1;
            ctx.strokeRect(-w / 2, -h / 2, w, h);

            ctx.beginPath();
            ctx.ellipse(0, 0, w * 0.19, h * 0.35, 0, 0, Math.PI * 2);
            ctx.stroke();

            ctx.fillStyle = `rgba(159,226,190,${o.opacity})`;
            ctx.font = `bold ${h * 0.55}px Georgia`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("$", 0, 0);
        });
    }

    function drawRevolver(o) {
        with3D(o, () => {
            const s = o.size;
            const a = o.opacity;

            const metal = `rgba(174,169,199,${a})`;
            const highlight = `rgba(225,219,245,${a})`;
            const dark = `rgba(70,67,91,${a})`;

            ctx.lineCap = "round";
            ctx.lineJoin = "round";

            // Barrel.
            ctx.beginPath();
            ctx.moveTo(-1, -s * 0.23);
            ctx.lineTo(s * 0.86, -s * 0.23);
            ctx.lineTo(s * 0.96, -s * 0.12);
            ctx.lineTo(s * 0.96, s * 0.02);
            ctx.lineTo(-1, s * 0.02);
            ctx.closePath();
            ctx.fillStyle = dark;
            ctx.strokeStyle = highlight;
            ctx.lineWidth = 1.2;
            ctx.fill();
            ctx.stroke();

            // Muzzle.
            ctx.beginPath();
            ctx.ellipse(
                s * 0.96, -s * 0.05,
                s * 0.045, s * 0.075,
                0, 0, Math.PI * 2
            );
            ctx.fillStyle = `rgba(12,12,22,${a})`;
            ctx.fill();
            ctx.strokeStyle = highlight;
            ctx.stroke();

            // Main frame.
            ctx.beginPath();
            ctx.moveTo(-s * 0.16, -s * 0.25);
            ctx.lineTo(s * 0.22, -s * 0.25);
            ctx.lineTo(s * 0.28, s * 0.13);
            ctx.lineTo(s * 0.12, s * 0.29);
            ctx.lineTo(-s * 0.13, s * 0.24);
            ctx.closePath();
            ctx.fillStyle = metal;
            ctx.strokeStyle = highlight;
            ctx.lineWidth = 1.5;
            ctx.fill();
            ctx.stroke();

            // Cylinder and chambers.
            ctx.beginPath();
            ctx.roundRect(
                -s * 0.20, -s * 0.28,
                s * 0.37, s * 0.40,
                s * 0.07
            );
            ctx.fillStyle = dark;
            ctx.strokeStyle = highlight;
            ctx.fill();
            ctx.stroke();

            for (let i = 0; i < 3; i++) {
                const cy = -s * 0.19 + i * s * 0.12;

                ctx.beginPath();
                ctx.ellipse(
                    -s * 0.015, cy,
                    s * 0.095, s * 0.035,
                    0, 0, Math.PI * 2
                );
                ctx.fillStyle = `rgba(15,15,26,${a})`;
                ctx.fill();
                ctx.strokeStyle = highlight;
                ctx.lineWidth = 0.8;
                ctx.stroke();
            }

            // Hammer.
            ctx.beginPath();
            ctx.moveTo(-s * 0.17, -s * 0.24);
            ctx.lineTo(-s * 0.27, -s * 0.36);
            ctx.lineTo(-s * 0.16, -s * 0.40);
            ctx.strokeStyle = highlight;
            ctx.lineWidth = s * 0.055;
            ctx.stroke();

            // Trigger guard.
            ctx.beginPath();
            ctx.moveTo(s * 0.05, s * 0.18);
            ctx.lineTo(s * 0.12, s * 0.39);
            ctx.lineTo(-s * 0.08, s * 0.43);
            ctx.lineTo(-s * 0.13, s * 0.27);
            ctx.strokeStyle = metal;
            ctx.lineWidth = s * 0.045;
            ctx.stroke();

            // Trigger.
            ctx.beginPath();
            ctx.moveTo(-s * 0.03, s * 0.23);
            ctx.quadraticCurveTo(s * 0.16, s * 0.32, s * 0.04, s * 0.37);
            ctx.strokeStyle = highlight;
            ctx.lineWidth = s * 0.025;
            ctx.stroke();

            // Grip.
            ctx.beginPath();
            ctx.moveTo(-s * 0.14, s * 0.20);
            ctx.lineTo(-s * 0.02, s * 0.27);
            ctx.lineTo(-s * 0.10, s * 0.68);
            ctx.quadraticCurveTo(-s * 0.14, s * 0.76, -s * 0.25, s * 0.69);
            ctx.lineTo(-s * 0.34, s * 0.60);
            ctx.lineTo(-s * 0.24, s * 0.29);
            ctx.closePath();
            ctx.fillStyle = dark;
            ctx.strokeStyle = highlight;
            ctx.lineWidth = 1.4;
            ctx.fill();
            ctx.stroke();

            // Grip texture.
            ctx.strokeStyle = `rgba(204,196,230,${a * 0.8})`;
            ctx.lineWidth = 0.8;

            for (let i = 0; i < 3; i++) {
                const y = s * (0.43 + i * 0.075);
                ctx.beginPath();
                ctx.moveTo(-s * 0.25, y);
                ctx.lineTo(-s * 0.13, y + s * 0.035);
                ctx.stroke();
            }

            // Metal highlight.
            ctx.beginPath();
            ctx.moveTo(s * 0.05, -s * 0.19);
            ctx.lineTo(s * 0.72, -s * 0.19);
            ctx.strokeStyle = `rgba(240,235,255,${a * 0.65})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
        });
    }

    function drawBullet(o) {
        with3D(o, () => {
            const length = o.size * 1.15;
            const r = o.size * 0.17;

            ctx.beginPath();
            ctx.moveTo(-length / 2, -r);
            ctx.lineTo(length * 0.18, -r);
            ctx.lineTo(length / 2, 0);
            ctx.lineTo(length * 0.18, r);
            ctx.lineTo(-length / 2, r);
            ctx.closePath();

            ctx.fillStyle = `rgba(219,196,143,${o.opacity})`;
            ctx.strokeStyle = `rgba(238,220,178,${o.opacity})`;
            ctx.lineWidth = 1;
            ctx.fill();
            ctx.stroke();
        });
    }

    function drawObject(o) {
        switch (o.type) {
            case "knight": drawChess(o, "♞"); break;
            case "pawn": drawChess(o, "♟"); break;
            case "queen": drawChess(o, "♛"); break;
            case "rook": drawChess(o, "♜"); break;
            case "board": drawBoard(o); break;
            case "chip": drawChip(o); break;
            case "money": drawMoney(o); break;
            case "revolver": drawRevolver(o); break;
            case "bullet": drawBullet(o); break;
        }
    }

    // ==========================================
    // OBJECT MOTION
    // ==========================================

    function updateObjects(dt) {
        for (const o of objects) {
            // Free-floating motion.
            o.x += o.vx * dt;
            o.y += o.vy * dt;

            // Independent 3D rotation.
            o.angle += o.spin * dt;
            updateRotation3D(o, dt);

            // Fade in and fade out.
            o.life += dt / o.duration;

            const fadeIn = Math.min(1, o.life * 4);
            const fadeOut = Math.min(1, (1 - o.life) * 4);
            o.opacity = Math.min(fadeIn, fadeOut) * o.baseOpacity;

            const margin = 100;
            const outside =
                o.x < -margin || o.x > width + margin ||
                o.y < -margin || o.y > height + margin;

            if (o.life >= 1 || outside) {
                Object.assign(o, makeObject(o.type));
            }
        }
    }

    // ==========================================
    // ANIMATION LOOP
    // ==========================================

    function render(timestamp) {
        if (document.hidden) {
            animationId = null;
            return;
        }

        const dt = lastTime
            ? Math.min((timestamp - lastTime) / 16.67, 2)
            : 1;

        lastTime = timestamp;
        time = timestamp;

        ctx.clearRect(0, 0, width, height);

        updateNodes(dt);
        updateObjects(dt);

        drawNetwork();

        for (const o of objects) {
            drawObject(o);
        }

        animationId = requestAnimationFrame(render);
    }

    function start() {
        if (animationId !== null) return;
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
})();