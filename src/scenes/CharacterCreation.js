/**
 * CharacterCreation Scene
 * Compressed to fit 560px height window.
 */

import Phaser from 'phaser';
import { morality } from '../systems/MoralitySystem.js';

const PERSONALITY_CHOICES = [
  { id: 'curious',   text: 'You notice things others miss',                          morality: { dimension: 'preservation', delta: 6, event: 'Chose curiosity as their gift' } },
  { id: 'warm',      text: 'People trust you without knowing why',                   morality: { dimension: 'trust',        delta: 6, event: 'Chose warmth as their gift' } },
  { id: 'intuitive', text: 'You know when something is wrong before anyone says so', morality: { dimension: 'inclusion',    delta: 6, event: 'Chose intuition as their gift' } },
  { id: 'tenacious', text: 'You finish what you start, no matter what',              morality: { dimension: 'restraint',    delta: 6, event: 'Chose tenacity as their gift' } },
];

const SKIN_TONES = [
  { id: 'light',  hex: '#f5d5b0' },
  { id: 'medium', hex: '#d4a870' },
  { id: 'tan',    hex: '#b8834a' },
  { id: 'deep',   hex: '#8b5e3c' },
  { id: 'dark',   hex: '#5c3a1e' },
];

const GENDER_OPTIONS = [
  { id: 'feminine',  label: 'She / Her'   },
  { id: 'masculine', label: 'He / Him'    },
  { id: 'ambiguous', label: 'They / Them' },
];

export class CharacterCreation extends Phaser.Scene {
  constructor() {
    super({ key: 'CharacterCreation' });
  }

  preload() {}

  create() {
    this._buildUI();
    this.cameras.main.fadeIn(2000, 6, 3, 1);
  }

  update() {}

  _buildUI() {
    const existing = document.getElementById('char-creation');
    if (existing) existing.remove();

    const style = document.createElement('style');
    style.textContent = `
      #char-creation { font-family: 'Crimson Pro', serif; }
      .cc-label { font-family:'Cinzel',serif; font-size:8px; letter-spacing:0.18em; color:rgba(180,120,40,0.6); text-transform:uppercase; margin-bottom:5px; }
      .cc-btn { cursor:pointer; border:1px solid rgba(180,130,50,0.25); color:rgba(200,175,110,0.55); transition:all 0.2s; border-radius:2px; }
      .cc-btn:hover { border-color:rgba(196,147,90,0.4); color:rgba(200,175,110,0.8); }
      .cc-btn.selected { border-color:rgba(196,147,90,0.7)!important; color:#e8d5a8!important; background:rgba(196,147,90,0.08)!important; }
      .cc-swatch { width:28px; height:28px; border-radius:50%; cursor:pointer; border:2px solid transparent; transition:all 0.2s; }
      .cc-swatch:hover { transform:scale(1.1); }
      .cc-swatch.selected { border-color:#c4935a!important; transform:scale(1.18); }
      #cc-name { width:100%; background:rgba(255,255,255,0.04); border:1px solid rgba(180,130,50,0.3); border-radius:2px; padding:7px 12px; color:#e8d5a8; font-family:'Crimson Pro',serif; font-size:15px; font-style:italic; outline:none; box-sizing:border-box; }
      #cc-name:focus { border-color:rgba(196,147,90,0.5); }
      #cc-begin { font-family:'Cinzel',serif; font-size:9px; letter-spacing:0.25em; color:rgba(196,147,90,0.25); text-transform:uppercase; cursor:default; padding:9px 28px; border:1px solid rgba(196,147,90,0.15); border-radius:2px; transition:all 0.3s; pointer-events:none; display:inline-block; }
      #cc-begin.ready { color:rgba(196,147,90,0.8)!important; border-color:rgba(196,147,90,0.45)!important; pointer-events:all!important; cursor:pointer; }
      #cc-begin.ready:hover { color:#e8d5a8!important; border-color:rgba(196,147,90,0.8)!important; background:rgba(196,147,90,0.06); }
    `;
    document.head.appendChild(style);

    const wrap = document.createElement('div');
    wrap.id = 'char-creation';
    wrap.style.cssText = `position:absolute; inset:0; z-index:100; display:flex; flex-direction:column; align-items:center; justify-content:center; background:rgba(6,3,1,0.93); padding:12px 24px;`;

    wrap.innerHTML = `
      <div style="text-align:center; margin-bottom:14px;">
        <div style="font-family:'Cinzel',serif; font-size:8px; letter-spacing:0.3em; color:#a07838; text-transform:uppercase; margin-bottom:6px;">Before you wake</div>
        <div style="font-family:'Cinzel',serif; font-size:19px; font-weight:400; color:#e8d5a8; letter-spacing:0.1em;">Who are you?</div>
      </div>
      <div style="width:300px;">
        <div style="margin-bottom:11px;">
          <div class="cc-label">Your name</div>
          <input id="cc-name" type="text" placeholder="Enter your name..." maxlength="20"/>
        </div>
        <div style="margin-bottom:11px;">
          <div class="cc-label">Pronouns</div>
          <div style="display:flex; gap:6px;">
            ${GENDER_OPTIONS.map(g => `<div class="cc-btn" data-group="gender" data-value="${g.id}" style="flex:1; text-align:center; padding:7px 0; font-family:'Cinzel',serif; font-size:8px; letter-spacing:0.08em;">${g.label}</div>`).join('')}
          </div>
        </div>
        <div style="margin-bottom:11px;">
          <div class="cc-label">Complexion</div>
          <div style="display:flex; gap:10px; align-items:center;">
            ${SKIN_TONES.map(s => `<div class="cc-swatch" data-group="skin" data-value="${s.id}" data-hex="${s.hex}" style="background:${s.hex};"></div>`).join('')}
          </div>
        </div>
        <div style="margin-bottom:11px;">
          <div class="cc-label">Your grandmother always said you had a gift. What did she mean?</div>
          <div style="display:flex; flex-direction:column; gap:5px;">
            ${PERSONALITY_CHOICES.map(p => `<div class="cc-btn" data-group="personality" data-value="${p.id}" style="padding:7px 12px; font-style:italic; font-size:13px; line-height:1.4;">${p.text}</div>`).join('')}
          </div>
        </div>
        <div style="text-align:center;">
          <div id="cc-begin">Wake up</div>
        </div>
      </div>
    `;

    document.getElementById('game-wrap').appendChild(wrap);

    const state = { gender: null, skin: null, personality: null, name: '' };

    const checkReady = () => {
      document.getElementById('cc-begin').classList.toggle('ready',
        !!(state.gender && state.skin && state.personality && state.name.trim().length > 0)
      );
    };

    document.getElementById('cc-name').addEventListener('input', (e) => { state.name = e.target.value; checkReady(); });

    wrap.querySelectorAll('.cc-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const group = btn.dataset.group;
        wrap.querySelectorAll(`.cc-btn[data-group="${group}"]`).forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        state[group] = btn.dataset.value;
        checkReady();
      });
    });

    wrap.querySelectorAll('.cc-swatch').forEach(swatch => {
      swatch.addEventListener('click', () => {
        wrap.querySelectorAll('.cc-swatch').forEach(s => s.classList.remove('selected'));
        swatch.classList.add('selected');
        state.skin = swatch.dataset.value;
        state.skinHex = swatch.dataset.hex;
        checkReady();
      });
    });

    document.getElementById('cc-begin').addEventListener('click', () => {
      if (!state.gender || !state.skin || !state.personality || !state.name.trim()) return;
      localStorage.setItem('holdfast_character', JSON.stringify({ name: state.name.trim(), gender: state.gender, skin: state.skin, skinHex: state.skinHex, personality: state.personality }));
      const choice = PERSONALITY_CHOICES.find(p => p.id === state.personality);
      if (choice) morality.record(choice.morality.dimension, choice.morality.delta, choice.morality.event);
      this.cameras.main.fadeOut(1500, 6, 3, 1);
      this.time.delayedCall(1600, () => { wrap.remove(); this.scene.start('HutInterior'); });
    });
  }
}
