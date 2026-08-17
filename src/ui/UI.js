export class UI {
  constructor(economy, world, input, onInteract) {
    this.money=document.querySelector('#money'); this.shop=document.querySelector('#shop'); this.hint=document.querySelector('#hint'); this.interact=document.querySelector('#interact'); this.toastNode=document.querySelector('#toast');
    document.querySelector('#trend-label').textContent=`Тренд: ${world.trend.name}`;
    economy.onChange(value=>{ this.money.textContent=Math.floor(value); this.renderShop(economy,world); });
    this.renderShop(economy,world); this.interact.onclick=onInteract;
  }
  renderShop(economy,world) { this.shop.replaceChildren(...world.upgrades.map(u=>{const b=document.createElement('button');b.className='upgrade';b.disabled=u.bought||economy.money<u.cost;b.innerHTML=`<b>${u.bought?'✓ ':''}${u.name}</b><span>${u.bought?'Построено':`${u.cost} 💸 · ${u.description}`}</span>`;b.onclick=()=>{if(economy.spend(u.cost)){world.buy(u);this.toast(`Построено: ${u.name}`);this.renderShop(economy,world);}};return b;})); }
  update(player,world) { const target=world.nearestInteraction(player.position); this.interact.hidden=!target; this.hint.textContent=target ? `${target.label} · нажми E или кнопку` : (matchMedia('(pointer: coarse)').matches?'Стик — движение':'WASD — движение · E — взаимодействовать'); }
  toast(message) { this.toastNode.textContent=message; this.toastNode.classList.add('show'); clearTimeout(this.timer);this.timer=setTimeout(()=>this.toastNode.classList.remove('show'),1800); }
}
