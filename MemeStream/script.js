let memes = [];
const imgEl = document.getElementById('meme-image');
const capEl = document.getElementById('caption');
const inputEl = document.getElementById('text-input');
const newBtn = document.getElementById('new-meme');
const dlBtn = document.getElementById('download');

// Fetch top memes of the day
async function loadMemes() {
  let success = false;
  let attempts = 0;

  while (!success && attempts < 10) {
    try {
      const res = await fetch('https://www.reddit.com/r/memes/top.json?limit=50&t=day');
      const json = await res.json();
      memes = json.data.children
        .map(c => c.data.url)
        .filter(url => /\.(jpg|png|gif)$/.test(url));
      showRandom();
      success = true;
    } catch (e) {
      console.error('Failed to load memes', e);
    }
    attempts++;
    if (success) break;
  }
}                   

function showRandom() {
  if (!memes.length) return;
  const url = memes[Math.floor(Math.random() * memes.length)];
  // Use the Images.weserv.nl CDN as a CORS proxy
  const proxyBase = 'https://images.weserv.nl/?url=';
  // Remove protocol (http[s]://) for weserv
  const urlNoProtocol = url.replace(/^https?:\/\//, '');
  const proxiedUrl = proxyBase + encodeURIComponent(urlNoProtocol);

// imgEl.crossOrigin = 'anonymous'; // Not needed when using a CORS proxy
  imgEl.src         = proxiedUrl;
  capEl.textContent = '';
  inputEl.value     = '';
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
