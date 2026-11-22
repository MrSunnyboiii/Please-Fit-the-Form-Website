'use strict';

const $ = id => document.getElementById(id);
const creatures = { Dragon:'🐉', Unicorn:'🦄', Fairy:'✧', Griffin:'🪶', Slime:'●', Human:'☺', Custom:'✎' };
const features = ['Wings', 'Horns', 'Scales', 'Fur', 'Sparkles'];
const rules = [
  { text:'All adventurers must have a name.', passes:a => Boolean(a.name.trim()) },
  { text:'Names must contain no more than six characters.', passes:a => Array.from(a.name.trim()).length <= 6 },
  { text:'Approved coloration is limited to the Registry’s beige palette.', passes:a => a.color === 'Beige' },
  { text:'Maximum permitted height: 120 cm.', passes:a => a.height <= 120 },
  { text:'Wings are mandatory for regional travel.', passes:a => a.features.includes('Wings') },
  { text:'Horns are prohibited under equipment policy.', passes:a => !a.features.includes('Horns') },
  { text:'All adventurers must fit the standard uniform. Wings are prohibited.', passes:a => !a.features.includes('Wings') }
];
const ruleFields = ['name', 'name', 'colors', 'height', 'features', 'features', 'features'];
const chapters = {
  create:['THE ADVENTURER’S ATELIER','Create your adventurer','Your adventure begins with you. Who would you like to be?','Begin Adventure'],
  review:['ADVENTURER REGISTRY','Avatar compliance review','Please adjust yourself to match the available options.','Resubmit avatar'],
  denied:['ADVENTURER REGISTRY','Registration denied','Your individuality could not be processed.',''],
  editor:['REGISTRY MAINTENANCE','Behind the form','The requirements are editable. Decide which ones belong here.','Apply changes'],
  sandbox:['THE ADVENTURER’S ATELIER','What feels like you?','Keep your wings. Add horns. Change your mind.','']
};
const initialAvatar = () => ({
  creature:'Dragon', name:'', custom:'', description:'', expression:'Cheerful',
  shape:'Round', height:155, color:'Fern', features:['Wings','Horns','Scales']
});

let phase, avatar, firstDesign, count, enabled, previousStatus;
const optionalControls = () => phase === 'editor' || phase === 'sandbox';

function announce(message) {
  $('announcement').textContent = message;
}

function renderPortrait() {
  const name = avatar.name.trim() || 'Unnamed adventurer';
  const creature = avatar.creature === 'Custom' ? avatar.custom.trim() || 'Custom creature' : avatar.creature;
  $('avatar').innerHTML = drawAvatar(avatar, phase);
  $('portrait-name').textContent = name;
  $('portrait-kind').textContent = `${avatar.color} ${creature} · ${avatar.height} cm · ${avatar.expression}`;
  $('portrait-description').textContent = avatar.description;
  $('portrait-description').hidden = !avatar.description.trim();
  $('original').hidden = !firstDesign || !['review','editor','denied'].includes(phase);
  $('original-art').innerHTML = firstDesign && !$('original').hidden ? drawAvatar(firstDesign) : '';
}

function syncControls() {
  for (const id of ['name','custom','description','expression','shape','height']) $(id).value = avatar[id];
  for (const field of ['creature','color']) {
    const input = [...$('creator').elements].find(el => el.name === field && el.value === avatar[field]);
    input.checked = true;
  }
  for (const input of $('features').querySelectorAll('input')) input.checked = avatar.features.includes(input.value);
  $('custom-choice').hidden = !optionalControls();
  $('custom-wrap').hidden = avatar.creature !== 'Custom' || !optionalControls();
  $('description-wrap').hidden = !optionalControls();
  $('height-value').textContent = `${avatar.height} cm`;
  $('name').required = phase === 'editor' && enabled.has(0);
  $('name-label').firstChild.textContent = phase === 'editor'
    ? `Adventurer name (${enabled.has(0) ? 'required' : 'optional'})`
    : 'Adventurer name';
}

function renderReview(speak = false) {
  const results = rules.slice(0,count).map(rule => rule.passes(avatar));
  $('rules').innerHTML = results.map((pass,i) =>
    `<li data-pass="${pass}"><span>Rule ${i+1}. ${rules[i].text}</span><span class="rule-status">${pass ? 'Pass' : 'Fail'}</span></li>`).join('');
  const status = results.map((pass,i) => `Rule ${i+1} ${pass ? 'passes' : 'fails'}.`).join(' ');
  if (speak && previousStatus !== status) announce(status);
  previousStatus = status;
}

function clearFieldFeedback() {
  for (const id of new Set(ruleFields)) {
    $(id).removeAttribute('aria-invalid');
    $(id).removeAttribute('aria-describedby');
  }
}

function renderEditor(speak = false) {
  const failed = [...enabled].filter(i => !rules[i].passes(avatar));
  clearFieldFeedback();
  for (const i of failed) {
    $(ruleFields[i]).setAttribute('aria-invalid', 'true');
    $(ruleFields[i]).setAttribute('aria-describedby', 'constraint');
  }
  const message = failed.length ? `Current avatar fails ${failed.map(i => `rule ${i+1}`).join(', ')}.` : 'Current avatar passes every active rule.';
  $('constraint').hidden = phase !== 'editor';
  $('constraint').textContent = message;
  $('constraint').classList.toggle('passing', failed.length === 0);
  for (const input of $('toggles').querySelectorAll('input')) input.checked = enabled.has(Number(input.value));
  if (speak && previousStatus !== message) announce(message);
  previousStatus = message;
}

function setPhase(next, moveFocus = true) {
  phase = next;
  document.body.dataset.phase = phase;
  const [chapter,title,subtitle,action] = chapters[phase];
  $('chapter').textContent = chapter;
  $('title').textContent = title;
  $('subtitle').textContent = subtitle;
  $('primary').textContent = action;
  $('primary').hidden = !action;
  $('creator').hidden = phase === 'denied';
  $('review').hidden = phase !== 'review';
  $('editor').hidden = phase !== 'editor';
  $('denied').hidden = phase !== 'denied';
  $('restart').hidden = phase === 'create' || phase === 'review';
  $('skip').hidden = optionalControls();
  $('reflection').hidden = phase !== 'sandbox';
  $('portrait-label').textContent = phase === 'sandbox' ? 'YOUR PORTRAIT' : 'LIVE PORTRAIT';
  $('constraint').hidden = phase !== 'editor';
  clearFieldFeedback();
  syncControls();
  renderPortrait();
  if (phase === 'review') renderReview(true);
  if (phase === 'editor') renderEditor();
  if (phase === 'sandbox') $('subtitle').append(document.createElement('br'), 'The rules were written. They can be rewritten.');
  if (moveFocus) {
    $('title').focus({preventScroll:true});
    window.scrollTo(0,0);
  }
}

function start(moveFocus = true) {
  avatar = initialAvatar();
  firstDesign = null;
  count = 0;
  enabled = new Set(rules.keys());
  previousStatus = '';
  $('registry-note').textContent = '';
  announce('');
  setPhase('create', moveFocus);
}

function openEditor() {
  firstDesign ??= structuredClone(avatar);
  setPhase('editor');
}

$('creatures').innerHTML = Object.entries(creatures).map(([name,icon]) =>
  `<label class="choice" ${name === 'Custom' ? 'id="custom-choice"' : ''}><input type="radio" name="creature" value="${name}"><span aria-hidden="true">${icon}</span> ${name}</label>`).join('');
$('colors').innerHTML = Object.entries(palette).map(([name,[color]]) =>
  `<label class="swatch" title="${name}"><input type="radio" name="color" value="${name}" aria-label="${name}"><span aria-hidden="true" style="--swatch:${color}"></span></label>`).join('');
$('features').innerHTML = features.map(name =>
  `<label class="feature"><input type="checkbox" name="feature" value="${name}">${name}</label>`).join('');
$('toggles').innerHTML = rules.map((rule,i) =>
  `<label><input type="checkbox" value="${i}"><span>Rule ${i+1}. ${rule.text}</span></label>`).join('');

$('creator').addEventListener('input', ({target}) => {
  if (target.name === 'feature') {
    avatar.features = features.filter(name => [...$('features').querySelectorAll(':checked')].some(input => input.value === name));
  } else if (target.name === 'creature' || target.name === 'color') {
    avatar[target.name] = target.value;
  } else {
    avatar[target.id] = target.id === 'height' ? Number(target.value) : target.value;
  }
  $('custom-wrap').hidden = avatar.creature !== 'Custom' || !optionalControls();
  $('height-value').textContent = `${avatar.height} cm`;
  renderPortrait();
  if (phase === 'review') renderReview(true);
  if (phase === 'editor') renderEditor(true);
});

$('creator').addEventListener('submit', event => {
  event.preventDefault();
  if (phase === 'create') {
    firstDesign = structuredClone(avatar);
    count = 1;
    $('registry-note').textContent = 'Satisfy all visible requirements and resubmit.';
    setPhase('review');
  } else if (phase === 'review') {
    if (count === rules.length) {
      setPhase('denied');
    } else if (rules.slice(0,count).every(rule => rule.passes(avatar))) {
      count++;
      $('registry-note').textContent = count === rules.length
        ? 'Your wings are required. Your wings are also prohibited.'
        : 'Additional requirement issued. Previous requirements remain in force.';
      renderReview(true);
      $('rules').lastElementChild.scrollIntoView({block:'nearest'});
    } else {
      const message = 'Your individuality could not be processed. Check the rules marked Fail.';
      $('registry-note').textContent = message;
      announce(message);
      $('review').scrollIntoView({block:'nearest'});
    }
  } else if (phase === 'editor') {
    const {custom, description} = avatar;
    avatar = {...structuredClone(firstDesign), custom, description};
    setPhase('sandbox');
  }
});

$('toggles').addEventListener('change', ({target}) => {
  const ruleIndex = Number(target.value);
  if (target.checked) enabled.add(ruleIndex);
  else enabled.delete(ruleIndex);
  syncControls();
  renderEditor(true);
});
$('remove').addEventListener('click', () => {
  enabled.clear();
  syncControls();
  renderEditor(true);
});
$('inspect').addEventListener('click', event => {
  event.preventDefault();
  openEditor();
});
$('skip').addEventListener('click', openEditor);
$('restart').addEventListener('click', () => start());

start(false);
