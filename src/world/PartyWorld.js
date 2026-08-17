import mapBackgroundUrl from '../assets/old-yard-map-lowpoly.jpg';

// Координаты мира позволяют накладывать интерактивные объекты поверх фона карты.
export class PartyWorld {
  constructor(trend) { this.trend=trend;this.bounds={left:-310,right:310,top:-310,bottom:310};this.incomePerSecond=1;this.interactions=[];this.background=new Image();this.background.src=mapBackgroundUrl;this.createContent(); }
  createContent() {
    this.terminal={x:-170,y:82,label:'Терминал с монетами',cooldown:0,interact:()=>{if(this.terminal.cooldown>0)return 0;this.terminal.cooldown=2;return 15;}};this.interactions.push(this.terminal);
    [[-78,-45,'Мила'],[108,-84,'Артём'],[155,75,'Соня']].forEach((n,i)=>this.interactions.push({x:n[0],y:n[1],label:`Потанцевать: ${n[2]}`,phase:i*1.7,interact:()=>Math.round(9*this.trend.npcBonus)}));
    this.upgrades=[{name:'DJ-сет',cost:30,income:2,description:'+2/сек',x:105,y:-110},{name:'Лаунж-зона',cost:70,income:4,description:'+4/сек',x:155,y:55},{name:'Фуд-трак',cost:140,income:7,description:'+7/сек',x:-160,y:105},{name:'Неоновая сцена',cost:260,income:12,description:'+12/сек',x:105,y:120}];
  }
  buy(upgrade){if(upgrade.bought)return false;upgrade.bought=true;this.incomePerSecond+=upgrade.income;return true;}
  update(time){this.time=time;if(this.terminal.cooldown>0)this.terminal.cooldown-=1/60;}
  nearestInteraction(pos){return this.interactions.filter(i=>Math.hypot(i.x-pos.x,i.y-pos.y)<42).sort((a,b)=>Math.hypot(a.x-pos.x,a.y-pos.y)-Math.hypot(b.x-pos.x,b.y-pos.y))[0];}
  draw(ctx,w,h,player) {
    const scale=Math.min((w-20)/700,(h-92)/700,1.15),ox=w/2,oy=h/2+15;ctx.clearRect(0,0,w,h);ctx.fillStyle='#101827';ctx.fillRect(0,0,w,h);ctx.save();ctx.translate(ox,oy);ctx.scale(scale,scale);
    // `complete` также бывает true при неудачной загрузке; naturalWidth защищает игровой рендер.
    if(this.background.complete && this.background.naturalWidth > 0) ctx.drawImage(this.background,-310,-310,620,620);
    else this.drawFallbackMap(ctx);
    this.zone(ctx,105,-110,110,70,'DJ-СЕТ','#f72585',this.upgrades[0].bought,'♫');this.zone(ctx,155,55,105,68,'ЛАУНЖ','#f97316',this.upgrades[1].bought,'☕');this.zone(ctx,-160,105,110,70,'ЕДА','#eab308',this.upgrades[2].bought,'★');this.zone(ctx,105,120,140,68,'СЦЕНА','#ec4899',this.upgrades[3].bought,'✦');
    this.terminalDraw(ctx);this.interactions.slice(1).forEach(n=>this.npc(ctx,n));this.playerDraw(ctx,player);ctx.restore();ctx.fillStyle='#101827d9';rr(ctx,14,h-61,230,45,12);ctx.fill();ctx.fillStyle='#d6e2f0';ctx.font='12px system-ui';ctx.fillText(`Доход: ${this.incomePerSecond} монет/сек`,28,h-34);ctx.fillStyle='#7dd3fc';ctx.fillText('Жёлтое = взаимодействие',28,h-20);
  }
  zone(ctx,x,y,w,h,label,color,built,icon){ctx.fillStyle=built?`${color}40`:'#101827b8';rr(ctx,x-w/2,y-h/2,w,h,14);ctx.fill();ctx.strokeStyle=built?color:'#a0709b';ctx.lineWidth=3;ctx.stroke();if(built&&label==='DJ-СЕТ')this.djSet(ctx,x,y);else{ctx.fillStyle=built?'#fff':'#d6b2cf';ctx.font='bold 13px system-ui';ctx.textAlign='center';ctx.fillText(built?icon:'🔒',x,y-2);}ctx.fillStyle='#fff';ctx.font='10px system-ui';ctx.fillText(label,x,y+29);}
  djSet(ctx,x,y){ctx.fillStyle='#161325';rr(ctx,x-32,y-14,64,26,4);ctx.fill();ctx.fillStyle='#f72585';ctx.beginPath();ctx.arc(x-19,y-1,8,0,Math.PI*2);ctx.arc(x+19,y-1,8,0,Math.PI*2);ctx.fill();ctx.fillStyle='#d8b4fe';ctx.fillRect(x-5,y-10,10,18);ctx.fillStyle='#101827';ctx.fillRect(x-44,y-18,9,40);ctx.fillRect(x+35,y-18,9,40);ctx.fillStyle='#fff';ctx.fillRect(x-40,y-14,3,26);ctx.fillRect(x+39,y-14,3,26);}
  terminalDraw(ctx){const t=this.terminal;ctx.fillStyle='#fbbf24';rr(ctx,t.x-19,t.y-24,38,48,7);ctx.fill();ctx.fillStyle='#fffbeb';ctx.fillRect(t.x-12,t.y-17,24,12);ctx.fillStyle='#1e293b';ctx.font='10px system-ui';ctx.textAlign='center';ctx.fillText('💸',t.x,t.y-7);}
  npc(ctx,n){const b=Math.sin(this.time*3+n.phase)*2;ctx.fillStyle='#e8b487';ctx.beginPath();ctx.arc(n.x,n.y-11+b,9,0,Math.PI*2);ctx.fill();ctx.fillStyle=['#14b8a6','#8b5cf6','#f43f5e'][Math.round(n.phase/1.7)%3];ctx.fillRect(n.x-9,n.y-2+b,18,19);ctx.fillStyle='#e8edf6';ctx.font='9px system-ui';ctx.textAlign='center';ctx.fillText(n.label.split(': ')[1],n.x,n.y+33);}
  playerDraw(ctx,p){const {x,y}=p.position;ctx.fillStyle='#17203377';ctx.beginPath();ctx.ellipse(x,y+13,16,7,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#60a5fa';ctx.beginPath();ctx.arc(x,y,p.radius,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=3;ctx.stroke();ctx.fillStyle='#fff';ctx.font='bold 16px system-ui';ctx.textAlign='center';ctx.fillText('Я',x,y+5);}
  drawFallbackMap(ctx){
    ctx.fillStyle='#2a3443';rr(ctx,-310,-310,620,620,24);ctx.fill();
    ctx.fillStyle='#3c4657';rr(ctx,-180,-200,245,205,10);ctx.fill();ctx.fillStyle='#202938';rr(ctx,-165,-185,215,60,7);ctx.fill();
    ctx.fillStyle='#574437';ctx.fillRect(-300,224,600,86);ctx.fillStyle='#9d7e55';ctx.fillRect(-300,216,600,12);
    ctx.fillStyle='#1a202b';rr(ctx,-170,-180,220,150,8);ctx.fill();ctx.fillStyle='#4a5362';for(let i=0;i<5;i++)ctx.fillRect(-145+i*37,-150,22,28);
    ctx.fillStyle='#d29b4d';ctx.fillRect(-75,-28,55,34);ctx.fillStyle='#5d4636';ctx.fillRect(-310,-310,620,16);ctx.fillRect(-310,294,620,16);ctx.fillRect(-310,-310,16,620);ctx.fillRect(294,-310,16,620);
    ctx.fillStyle='#51674a';for(let i=0;i<18;i++){const x=-270+(i*83)%530,y=-245+(i*127)%470;ctx.beginPath();ctx.arc(x,y,8,0,Math.PI*2);ctx.fill();}
  }
}
function rr(ctx,x,y,w,h,r){
  // Своя реализация вместо Canvas.roundRect: работает и в старых WebView Яндекс Игр.
  ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.arcTo(x+w,y,x+w,y+r,r);ctx.lineTo(x+w,y+h-r);ctx.arcTo(x+w,y+h,x+w-r,y+h,r);ctx.lineTo(x+r,y+h);ctx.arcTo(x,y+h,x,y+h-r,r);ctx.lineTo(x,y+r);ctx.arcTo(x,y,x+r,y,r);ctx.closePath();
}
