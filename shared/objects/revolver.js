import { with3D } from "./rotation.js";

export function draw(ctx, object) {
        with3D(ctx, object, () => {
            const s = object.size;
            const a = object.opacity;

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
