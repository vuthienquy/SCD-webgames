// Neural-network points and their connecting lines.
export function createNetwork(random, width, height, mobile) {
    const makeNode = () => ({
        x: random(0, width()), y: random(0, height()),
        vx: random(-0.65, 0.65), vy: random(-0.65, 0.65),
        radius: random(0.8, 1.9), life: random(0, 1),
        lifeSpeed: random(0.035, 0.09), phase: random(0, Math.PI * 2)
    });
    const count = () => mobile() ? 42 : 85;
    let nodes = Array.from({ length: count() }, makeNode);
    function resize(sx, sy, first) {
        if (first) nodes = Array.from({ length: count() }, makeNode);
        else nodes.forEach(n => { n.x *= sx; n.y *= sy; });
    }
    function update(dt, w, h) {
        for (const n of nodes) {
            n.x += n.vx * dt; n.y += n.vy * dt;
            n.phase += 0.025 * dt;
            n.life += n.lifeSpeed * dt / 60;
            if (n.life >= 1) Object.assign(n, makeNode());
            if (n.x < -5) n.x = w + 5;
            if (n.x > w + 5) n.x = -5;
            if (n.y < -5) n.y = h + 5;
            if (n.y > h + 5) n.y = -5;
        }
    }
    function opacity(n) { return Math.pow(Math.max(0, Math.sin(Math.PI * n.life)), 1.4); }
    function draw(ctx, time) {
        const LINK_DISTANCE = 155;
        for (let i = 0; i < nodes.length; i++) {
            const a = nodes[i];
            for (let j = i + 1; j < nodes.length; j++) {
                const b = nodes[j], dx = b.x - a.x, dy = b.y - a.y;
                const distance = Math.hypot(dx, dy);
                if (distance > LINK_DISTANCE) continue;
                const proximity = 1 - distance / LINK_DISTANCE;
                const life = Math.min(opacity(a), opacity(b));
                const alpha = proximity * life * 0.34;
                if (alpha < 0.008) continue;
                ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
                ctx.strokeStyle = `rgba(155,140,255,${alpha})`; ctx.lineWidth = 0.75; ctx.stroke();
                const pulse = (time * 0.00028 + i * 0.13 + j * 0.07) % 1;
                if (proximity > 0.35 && life > 0.4) {
                    ctx.beginPath();
                    ctx.arc(a.x + dx * pulse, a.y + dy * pulse, 1.15, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(221,213,255,${alpha * 1.7})`; ctx.fill();
                }
            }
        }
        for (const n of nodes) {
            const alpha = opacity(n);
            if (alpha < 0.01) continue;
            const radius = n.radius * (0.85 + Math.sin(n.phase) * 0.15);
            ctx.beginPath(); ctx.arc(n.x, n.y, radius * 3.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(132,108,255,${alpha * 0.09})`; ctx.fill();
            ctx.beginPath(); ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(211,203,255,${alpha * 0.95})`; ctx.fill();
        }
    }
    return { resize, update, draw };
}
