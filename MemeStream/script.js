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
  imgEl.crossOrigin = 'anonymous';
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
  let meme = document.getElementById('meme');
  html2canvas(meme, {
    useCORS: true,
    allowTaint: false,
    scrollX: 0,
    scrollY: 0,
    width: meme.getBoundingClientRect().width,
    height: meme.getBoundingClientRect().height
  }).then(canvas => {
    canvas.toBlob(blob => {
      const link = document.createElement('a');
      link.download = `MemeStream ${new Date().toDateString()}`
      link.href = URL.createObjectURL(blob);
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(link.href);
      link.remove();
    }, 'image/png');
  });
});

loadMemes();
