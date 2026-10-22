import { with3D } from "./rotation.js";

export function draw(ctx, object) {
        with3D(ctx, object, () => {
            const size = object.size * 2.0;
            const cell = size / 8;

            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    const light = (row + col) % 2 === 0;

                    ctx.fillStyle = light
                        ? `rgba(179,161,255,${object.opacity * 0.9})`
                        : `rgba(55,48,91,${object.opacity * 0.9})`;

                    ctx.fillRect(
                        -size / 2 + col * cell,
                        -size / 2 + row * cell,
                        cell,
                        cell
                    );
                }
            }

            ctx.strokeStyle = `rgba(210,198,255,${object.opacity})`;
            ctx.lineWidth = 1.2;
            ctx.strokeRect(-size / 2, -size / 2, size, size);
        });
    }
