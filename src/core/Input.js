export class Input {
  constructor() {
    this.keys = new Set(); this.interact = false; this.move = { x: 0, y: 0 };
    this.mobile = matchMedia('(pointer: coarse)').matches;
    addEventListener('keydown', (e) => { this.keys.add(e.code); if (e.code === 'KeyE') this.interact = true; });
    addEventListener('keyup', (e) => this.keys.delete(e.code));
    this.setupTouch();
  }
  setupTouch() {
    if (!this.mobile) return;
    document.querySelector('#mobile-controls').hidden = false;
    document.querySelector('#hint').textContent = 'Стик — движение · Свайп по экрану — камера · Подходи к объектам';
    const pad = document.querySelector('#joystick'), stick = document.querySelector('#stick'); let joyId = null;
    const move = (t) => { const r=pad.getBoundingClientRect(), dx=t.clientX-r.left-r.width/2, dy=t.clientY-r.top-r.height/2, l=Math.min(32,Math.hypot(dx,dy)); this.move={x:dx/(Math.hypot(dx,dy)||1)*l/32,y:dy/(Math.hypot(dx,dy)||1)*l/32}; stick.style.transform=`translate(${this.move.x*32}px,${this.move.y*32}px)`; };
    pad.addEventListener('touchstart', e => { joyId=e.changedTouches[0].identifier; move(e.changedTouches[0]); e.preventDefault(); }, { passive:false });
    addEventListener('touchmove', e => { for(const t of e.changedTouches) if(t.identifier===joyId) move(t); }, { passive:false });
    addEventListener('touchend', e => { for(const t of e.changedTouches) if(t.identifier===joyId){joyId=null;this.move={x:0,y:0};stick.style.transform='';} });
  }
  direction() { return { x: (this.keys.has('KeyD')?1:0)-(this.keys.has('KeyA')?1:0)+this.move.x, y: (this.keys.has('KeyS')?1:0)-(this.keys.has('KeyW')?1:0)+this.move.y }; }
  consumeInteract() { const v=this.interact; this.interact=false; return v; }
}
