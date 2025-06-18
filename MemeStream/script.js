let memes = [];
const imgEl = document.getElementById('meme-image');
const capEl = document.getElementById('caption');
const inputEl = document.getElementById('text-input');
const newBtn = document.getElementById('new-meme');
const dlBtn = document.getElementById('download');

// Fetch top memes of the day
async function loadMemes() {
  try {
    const res = await fetch('https://www.reddit.com/r/memes/top.json?limit=50&t=day');
    const json = await res.json();
    memes = json.data.children
      .map(c => c.data.url)
      .filter(url => /\.(jpg|png|gif)$/.test(url));
    showRandom();
  } catch (e) {
    console.error('Failed to load memes', e);
  }
}

function showRandom() {
  if (!memes.length) return;
  const url = memes[Math.floor(Math.random() * memes.length)];
  imgEl.src = url;
  capEl.textContent = '';
  inputEl.value = '';
}

// Live caption update
inputEl.addEventListener('input', e => {
  capEl.textContent = e.target.value;
});

newBtn.addEventListener('click', showRandom);

dlBtn.addEventListener('click', () => {
  html2canvas(document.getElementById('meme')).then(canvas => {
    const link = document.createElement('a');
    link.download = 'meme.png';
    link.href = canvas.toDataURL();
    link.click();
  });
});

loadMemes();