import { Input } from './Input.js';
import { Player } from '../player/Player.js';
import { PartyWorld } from '../world/PartyWorld.js';
import { Economy } from '../economy/Economy.js';
import { UI } from '../ui/UI.js';
import { currentTrend } from '../content/trends.js';

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.input = new Input(canvas);
    this.economy = new Economy();
    this.world = new PartyWorld(currentTrend);
    this.player = new Player();
    this.ui = new UI(this.economy, this.world, this.input, () => this.tryInteract());
    this.last = 0;
    this.incomeTimer = 0;
    this.resize();
    addEventListener('resize', () => this.resize());
  }

  start() { requestAnimationFrame((now) => this.tick(now)); }
  tick(now) {
    const dt = Math.min((now - this.last) / 1000 || 0, 0.05); this.last = now;
    this.player.update(dt, this.input, this.world.bounds);
    this.world.update(now / 1000);
    this.incomeTimer += dt;
    if (this.incomeTimer >= 1) { this.economy.add(this.world.incomePerSecond); this.incomeTimer = 0; }
    if (this.input.consumeInteract()) this.tryInteract();
    this.ui.update(this.player, this.world);
    this.world.draw(this.ctx, innerWidth, innerHeight, this.player);
    requestAnimationFrame((next) => this.tick(next));
  }
  tryInteract() {
    const target = this.world.nearestInteraction(this.player.position);
    if (!target) return this.ui.toast('Подойди к NPC или жёлтому терминалу');
    const earned = target.interact();
    if (earned) { this.economy.add(earned); this.ui.toast(`+${earned} монет · ${target.label}`); }
  }
  resize() {
    this.canvas.width = innerWidth * devicePixelRatio;
    this.canvas.height = innerHeight * devicePixelRatio;
    this.ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }
}
