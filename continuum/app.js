const root = document.documentElement;
const stage = document.querySelector('.stage');
const experience = document.querySelector('.experience');
const scenes = [...document.querySelectorAll('.scene')];
const sculptureWrap = document.querySelector('.sculpture-wrap');
const tracks = [...document.querySelectorAll('.progress-tracks i')];
const progressTitle = document.querySelector('.progress-title');
const motionButton = document.querySelector('.motion-toggle');
const media = matchMedia('(prefers-reduced-motion: reduce)');
const compactMedia = matchMedia('(max-height: 699px), (max-width: 760px) and (max-height: 779px)');
let userReduced = false;
try { userReduced = localStorage.getItem('kepta-continuum-reduced') === 'true'; } catch {}
let reduced = media.matches || userReduced || compactMedia.matches;
let sculpture = null;
let frame = 0;
let targetY = scrollY;
let currentY = targetY;
let pointer = [0, 0];
let currentPointer = [0, 0];
let geometry = {};
let lastScene = -1;
let lastProgress = -1;
const fragments = [...document.querySelectorAll('.memory-fragment')];
const vaultCore = document.querySelector('.vault-core');
const orbitOne = document.querySelector('.orbit-one');
const orbitTwo = document.querySelector('.orbit-two');
const teamLines = document.querySelector('.team-lines');
const startHeading = document.querySelector('.start-section h2');
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const smooth = x => { const v = clamp(x); return v * v * (3 - 2 * v); };
const titles = ['A lasting memory', 'Context, kept', 'Connected to you'];

function setMotion() {
  reduced = media.matches || userReduced || compactMedia.matches;
  root.classList.add('motion-enabled');
  root.classList.toggle('reduced', reduced);
  motionButton.setAttribute('aria-pressed', String(reduced));
  motionButton.innerHTML = compactMedia.matches ? 'Static view <span aria-hidden="true">▷</span>' : reduced ? 'Motion reduced <span aria-hidden="true">▷</span>' : 'Reduce motion <span aria-hidden="true">Ⅱ</span>';
  motionButton.disabled = media.matches || compactMedia.matches;
  if (media.matches) motionButton.title = 'Reduced motion follows your device setting.';
  else if (compactMedia.matches) motionButton.title = 'Compact screens use the complete static story.';
  else motionButton.removeAttribute('title');
  // A manual mode change preserves the chapter the visitor is reading.
  measure();
  targetY = scrollY;
  currentY = targetY;
  lastProgress = -1;
  requestTick();
}
function measure() {
  geometry = { start: experience.offsetTop, distance: Math.max(1, experience.offsetHeight - stage.offsetHeight), viewport: innerHeight, width: innerWidth, ownership: document.querySelector('.ownership').offsetTop, team:document.querySelector('.team-section').offsetTop, startSection:document.querySelector('.start-section').offsetTop };
  sculpture?.resize();
}
function requestTick() { if (!frame && !document.hidden) frame = requestAnimationFrame(render); }
function render() {
  frame = 0;
  currentY += (targetY - currentY) * (reduced ? 1 : .16);
  currentPointer[0] += (pointer[0] - currentPointer[0]) * .09;
  currentPointer[1] += (pointer[1] - currentPointer[1]) * .09;
  const p = reduced ? 0 : clamp((currentY - geometry.start) / geometry.distance);
  const active = p < .32 ? 0 : p < .68 ? 1 : 2;
  if (active !== lastScene || p !== lastProgress) {
    scenes.forEach((scene, index) => {
      const visible = index === active;
      scene.style.visibility = visible ? 'visible' : 'hidden';
      scene.style.opacity = visible ? '1' : '0';
      scene.inert = !visible;
      scene.setAttribute('aria-hidden', String(!visible));
      // Cuts keep the typography legible; a short arrival gives each new shot weight.
      const start = index === 0 ? 0 : index === 1 ? .32 : .68;
      const arrival = smooth((p - start) / .065);
      scene.style.transform = visible && index > 0 ? `translateY(${(1 - arrival) * 28}px)` : 'none';
    });
    if (active !== lastScene) {
      tracks.forEach((track, i) => { track.style.background = i <= active ? 'var(--ink)' : 'var(--line)'; });
      progressTitle.textContent = titles[active];
      lastScene = active;
    }
    const open = smooth((p - .15) / .32);
    const rejoin = smooth((p - .61) / .27);
    const expansion = open * (1 - rejoin);
    sculptureWrap.style.transform = reduced ? 'none' : `translateX(${expansion * (geometry.width < 761 ? 4 : 5)}%) scale(${1 - expansion * .1})`;
    sculptureWrap.style.opacity = active === 1 ? '.5' : '1';
    fragments.forEach((el, i) => {
      const local = smooth((p - .32) / .3);
      const mobile = geometry.width < 761;
      const rot = mobile ? 0 : [-5, 4, -2][i];
      el.style.transform = `translateY(${(1 - local) * (mobile ? 24 + i * 8 : 35 + i * 15)}px) rotate(${rot * (1 - local * .5)}deg)`;
    });
    lastProgress = p;
  }
  if (sculpture && targetY < geometry.distance + geometry.viewport * 1.2) sculpture.render(p, reduced ? 0 : currentPointer[0], reduced ? 0 : currentPointer[1]);
  // A second, quieter material movement belongs to the local-storage chapter.
  const vaultProgress = reduced ? .5 : clamp((currentY - geometry.ownership + geometry.viewport) / (geometry.viewport * 1.7));
  vaultCore.style.transform = `rotate(${-22 + vaultProgress * 16}deg) translateY(${reduced ? 0 : (1 - vaultProgress) * 25}px)`;
  orbitOne.style.transform = `rotateX(50deg) rotate(${-40 + vaultProgress * 35}deg)`;
  orbitTwo.style.transform = `rotateX(20deg) rotateY(55deg) rotate(${20 + vaultProgress * 40}deg)`;
  const teamProgress = reduced ? .5 : clamp((currentY - geometry.team + geometry.viewport) / (geometry.viewport * 1.5));
  teamLines.style.transform = `rotate(${-35 + teamProgress * 30}deg) translateX(${(1 - teamProgress) * -70}px)`;
  const startProgress = reduced ? 1 : smooth((currentY - geometry.startSection + geometry.viewport) / (geometry.viewport * .9));
  startHeading.style.transform = `translateX(${(1 - startProgress) * -24}px) scale(${.93 + startProgress * .07})`;
  if (!reduced && (Math.abs(targetY - currentY) > .3 || Math.abs(pointer[0] - currentPointer[0]) > .002 || Math.abs(pointer[1] - currentPointer[1]) > .002)) requestTick();
}
addEventListener('scroll', () => { targetY = scrollY; requestTick(); }, { passive: true });
addEventListener('resize', () => { measure(); lastProgress = -1; requestTick(); }, { passive: true });
stage.addEventListener('pointermove', event => {
  if (reduced || event.pointerType !== 'mouse') return;
  pointer = [(event.clientX / innerWidth - .5) * .8, (event.clientY / innerHeight - .5) * .5];
  requestTick();
}, { passive: true });
stage.addEventListener('pointerleave', () => { pointer = [0, 0]; requestTick(); });
document.addEventListener('visibilitychange', () => {
  if (document.hidden && frame) { cancelAnimationFrame(frame); frame = 0; }
  else { targetY = scrollY; currentY = targetY; requestTick(); }
});
media.addEventListener('change', setMotion);
compactMedia.addEventListener('change', setMotion);
motionButton.addEventListener('click', () => {
  const oldHeight = experience.offsetHeight;
  const oldY = scrollY;
  userReduced = !userReduced;
  try { localStorage.setItem('kepta-continuum-reduced', String(userReduced)); } catch {}
  setMotion();
  if (oldY > oldHeight) scrollTo({ top: oldY + experience.offsetHeight - oldHeight, behavior: 'instant' });
  else if (oldY > 0) scrollTo({ top: 0, behavior: 'instant' });
});

const examples = {
  decision: {type:'Project decision', title:'Room to grow.<br>Less to manage.', text:'“We chose PostgreSQL because the project needs relational queries and the team already knows how to run it.”', source:'Architecture review', state:'Current memory', tags:['Project Atlas','Database']},
  preference: {type:'Working preference', title:'Be direct.<br>Show the trade-offs.', text:'“Give me the recommendation first, then the reasoning. If there is a downside, say so. Keep examples practical.”', source:'Your working preferences', state:'Current memory', tags:['Feedback','Your workflow']},
  change: {type:'Updated decision', title:'A new date.<br>A clear history.', text:'“The launch moved from October to November. The earlier decision is kept in the history and marked as superseded.”', source:'Project update', state:'Previous memory superseded', tags:['Project Atlas','Launch']}
};
const questionButtons = [...document.querySelectorAll('.question')];
function selectExample(key, updateUrl = true) {
  if (!examples[key]) return;
  const example = examples[key];
  questionButtons.forEach(button => { const selected = button.dataset.example === key; button.classList.toggle('active', selected); button.setAttribute('aria-pressed', String(selected)); });
  const content = document.querySelector('#answer-content');
  content.querySelector('.answer-type').textContent = example.type;
  content.querySelector('h3').innerHTML = example.title;
  content.querySelector('.answer-text').textContent = example.text;
  content.querySelector('.answer-source strong').textContent = example.source;
  content.querySelector('.source-state').textContent = example.state;
  document.querySelectorAll('.memory-tag').forEach((tag, index) => { tag.textContent = example.tags[index]; });
  if (!reduced) content.animate([{opacity:.2,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}], {duration:220,easing:'cubic-bezier(.4,0,.2,1)'});
  if (updateUrl) { const url = new URL(location.href); url.searchParams.set('example', key); history.replaceState(null, '', url); }
}
questionButtons.forEach(button => {button.disabled = false;button.addEventListener('click', () => selectExample(button.dataset.example));});
selectExample(new URL(location.href).searchParams.get('example') || 'decision', false);
addEventListener('popstate', () => selectExample(new URL(location.href).searchParams.get('example') || 'decision', false));

document.querySelector('#copy-command').addEventListener('click', async () => {
  const status = document.querySelector('#copy-status');
  const button = document.querySelector('#copy-command');
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText('npx -y kepta-mcp setup');
    status.textContent = 'Copied. Ready for your terminal.';
    button.setAttribute('aria-label', 'Setup command copied');
  } catch {
    const selection = getSelection();
    const range = document.createRange();
    range.selectNodeContents(document.querySelector('.command code'));
    selection.removeAllRanges(); selection.addRange(range);
    status.textContent = 'Command selected. Press Ctrl+C or ⌘C.';
  }
});
document.querySelector('#copy-command').disabled = false;

setMotion();
document.fonts.ready.then(() => { measure(); requestTick(); });
// The complete page works if graphics are blocked or WebGL is unavailable.
import('./sculpture.js').then(({createSculpture}) => {
  sculpture = createSculpture(document.querySelector('#sculpture'));
  if (sculpture) { sculptureWrap.classList.add('ready'); measure(); requestTick(); }
}).catch(() => { sculptureWrap.dataset.fallback = 'true'; });
