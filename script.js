const heads = document.querySelectorAll('.head');
const area = { width: window.innerWidth, height: window.innerHeight };

const objects = Array.from(heads).map(img => {
    const size = img.offsetWidth || 80;
    return {
        el: img,
        x: Math.random() * (area.width - size),
        y: Math.random() * (area.height - size),
        vx: (Math.random() - 0.5) * 2.5,
        vy: (Math.random() - 0.5) * 2.5,
        dragging: false,
        offsetX: 0,
        offsetY: 0,
        size
    };
});

function updateArea() {
    area.width = window.innerWidth;
    area.height = window.innerHeight;
}
window.addEventListener('resize', updateArea);

function animate() {
    for (const obj of objects) {
        if (!obj.dragging) {
            obj.x += obj.vx;
            obj.y += obj.vy;
            const limitX = area.width - obj.el.offsetWidth;
            const limitY = area.height - obj.el.offsetHeight;

            // rimbalzo
            if (obj.x <= 0 || obj.x >= limitX) {
                obj.vx *= -1;
                obj.x = Math.max(0, Math.min(limitX, obj.x));
            }
            if (obj.y <= 0 || obj.y >= limitY) {
                obj.vy *= -1;
                obj.y = Math.max(0, Math.min(limitY, obj.y));
            }
        }
        obj.el.style.left = obj.x + 'px';
        obj.el.style.top = obj.y + 'px';
    }
    requestAnimationFrame(animate);
}
animate();

// Gestione touch/mouse drag
for (const obj of objects) {
    const el = obj.el;

    function startDrag(e) {
        obj.dragging = true;
        const p = e.touches ? e.touches[0] : e;
        obj.offsetX = p.clientX - obj.x;
        obj.offsetY = p.clientY - obj.y;
        e.preventDefault();
    }

    function onDrag(e) {
        if (!obj.dragging) return;
        const p = e.touches ? e.touches[0] : e;
        obj.x = p.clientX - obj.offsetX;
        obj.y = p.clientY - obj.offsetY;
    }

    function endDrag() {
        obj.dragging = false;
        obj.vx = (Math.random() - 0.5) * 2.5;
        obj.vy = (Math.random() - 0.5) * 2.5;
    }

    el.addEventListener('mousedown', startDrag);
    el.addEventListener('touchstart', startDrag);

    window.addEventListener('mousemove', onDrag);
    window.addEventListener('touchmove', onDrag);

    window.addEventListener('mouseup', endDrag);
    window.addEventListener('touchend', endDrag);
}