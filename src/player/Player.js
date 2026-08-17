export class Player {
  constructor() { this.position = { x: 0, y: 10 }; this.radius = 13; this.walk = 0; }
  update(dt, input, bounds) { const d=input.direction(), length=Math.hypot(d.x,d.y); if(length>.1){this.position.x+=d.x/length*dt*105;this.position.y+=d.y/length*dt*105;this.walk+=dt*12;} this.position.x=Math.max(bounds.left,Math.min(bounds.right,this.position.x));this.position.y=Math.max(bounds.top,Math.min(bounds.bottom,this.position.y)); }
}
