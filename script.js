let fetchCache = {};
function geturl(url) {
  return new Promise((resolve, reject) => {
    if (fetchCache[url]) {
      resolve(fetchCache[url]);
      return;
    }
    fetch(`https://api.fsh.plus/file?url=${encodeURIComponent(url)}`)
      .then(res=>res.text())
      .then(res=>{
        fetchCache[url] = res;
        resolve(res);
      });
  });
}
function videoWithRefer(url, refer) {
  return new Promise((resolve, reject) => {
    if (fetchCache[url]) {
      resolve(fetchCache[url]);
      return;
    }
    fetch('https://api.fsh.plus/request?url='+encodeURIComponent(url), {
      method: "POST",
      body: JSON.stringify({
        method: 'GET',
        headers: {
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
          referer: refer,
          accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "accept-language": "en-US,en;q=0.9,es-ES;q=0.8,es;q=0.7",
          "cache-control": "no-cache",
          pragma: "no-cache",
          priority: "u=0, i",
          "sec-ch-ua": "\"Chromium\";v=\"140\", \"Not=A?Brand\";v=\"24\", \"Google Chrome\";v=\"140\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Windows\"",
          "sec-fetch-dest": "iframe",
          "sec-fetch-mode": "navigate",
          "sec-fetch-site": "cross-site",
          "sec-fetch-storage-access": "active",
          "sec-fetch-user": "?1",
          "upgrade-insecure-requests": "1"
        }
      })
    })
      .then(res=>res.json())
      .then(res=>{
        res.content = `<base href="${res.url}">
<script>
window.parent = window;
window.top = window;
window.frameElement = null;
document.referrer = '${refer}';
window.location.assign = ()=>{};
window.location.replace = ()=>{};
history.pushState = ()=>{};
history.replaceState = ()=>{};
</script>`+res.content.replaceAll(/<meta .*?http-equiv="Content-Security-Policy".*?>/gi, '');
        fetchCache[url] = res.content;
        resolve(res.content);
      });
  });
}
function getImgUrl(url) {
  return `https://api.fsh.plus/file?url=${encodeURIComponent(url)}`;
}
function download(url, name, id) {
  let a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = `${name} - ${id}.mp4`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function showSearch(con) {
  document.getElementById('results').innerHTML = `<p>${con.length} results</p>
${state[si].n>1?`<button onclick="state[state.length]={page:'search',q:state[si].q,n:${state[si].n-1},provider:state[si].provider};si=state.length-1;setTop();">Prev</button>`:''}
${state[si].n>1?state[si].n:''}
${con.length>[23,35,35,29,999,31,29][state[si].provider]?`<button onclick="state[state.length]={page:'search',q:state[si].q,n:${state[si].n+1},provider:state[si].provider};si=state.length-1;setTop();">Next</button>`:''}
<div class="wrap">
  ${con.map(m=>`<div onclick="state[state.length]={page:'ep',id:'${m.id}',t:\`${m.title}\`,img:'${m.img}',provider:state[si].provider};si=state.length-1;setTop();" class="clicky"><img src="${m.img}"><span>${m.title}</span></div>`).join('')}
</div>`;
}
function search() {
  if (state[si].q==='doom') location.href='/doom';
  let page = state[si].n;
  let quer = state[si].q;
  let provider = state[si].provider??0;
  switch (provider) {
    case 0:
      geturl(`https://www3.animeflv.net/browse?page=${page}&q=${quer}`)
        .then(res=>{
          let con = Array.from(res
            .match(/<!--<Animes>-->[^¬]*?<!--<\/Animes>-->/g)[0]
            .match(/<article class="Anime.*?>[^¬]*?<\/article>/g) ?? [])
            .map(m => {
              return {
                id: m.match(/<a href=".*?">/g)[0].split('"')[1].split('/').slice(-1)[0],
                title: m.match(/<h3 class="Title">.*?<\/h3>/g)[0].split('>')[1].split('<')[0].replaceAll("'","&#39;"),
                img: getImgUrl(m.match(/<img src="(.*?)" alt.*?>/g)[0].split('"')[1])
              };
            });
          showSearch(con);
        })
      break;
    case 1:
    case 2:
    case 3:
      geturl(`https://${['aniwatchtv','hianime','9animetv'][provider-1]}.to/${quer===''?'recently-updated':'search'}?keyword=${quer}&page=${page}`)
        .then(res=>{
          const parser = new DOMParser();
          const doc = parser.parseFromString(res, 'text/html');
          let con = Array.from(doc.querySelector('div.film_list-wrap').querySelectorAll('div.flw-item'))
            .map(m => {
              return {
                id: m.querySelector('h3.film-name a').href.split('/').slice(-1)[0].split('?')[0],
                title: m.querySelector('h3.film-name a').innerText.replaceAll("'","&#39;"),
                img: getImgUrl(m.querySelector('img.film-poster-img').getAttribute('data-src'))
              };
            });
          showSearch(con);
        })
      break;
    case 4:
      geturl(`https://jkanime.net/${quer===''?'':'buscar'}/${quer}?page=${page}`)
        .then(res=>{
          const parser = new DOMParser();
          const doc = parser.parseFromString(res, 'text/html');
          let con = Array.from(doc.querySelector('div.tab-content, div.page_directorio').querySelectorAll('div.card, div.anime__item'))
            .map(m => {
              return {
                id: m.querySelector('a').href.split('/')[3],
                title: m.querySelector('h5 a, h5.card-title').innerText.replaceAll("'","&#39;"),
                img: m.querySelector('div.anime__item__pic.set-bg')?getImgUrl(m.querySelector('div.anime__item__pic.set-bg').getAttribute('data-setbg')):getImgUrl(m.querySelector('img.card-img-top').src)
              };
            });
          showSearch(con);
        })
      break;
    case 5:
      geturl(`https://dopebox.to/${quer===''?'home':'search'}/${quer.replaceAll(' ','+')}?page=${page}`)
        .then(res=>{
          const parser = new DOMParser();
          const doc = parser.parseFromString(res, 'text/html');
          let con = Array.from(doc.querySelector('div.film_list-wrap').querySelectorAll('div.flw-item'))
            .map(m => {
              return {
                id: m.querySelector('a').href.split('/').slice(-1)[0],
                title: m.querySelector('h2 a,h3 a').innerText.replaceAll("'","&#39;"),
                img: getImgUrl(m.querySelector('img').getAttribute('data-src'))
              };
            });
          showSearch(con);
        })
      break;
    case 6:
      geturl(`https://ww3.animeonline.ninja/page/${page}?s=${quer}`)
        .then(res=>{
          const parser = new DOMParser();
          const doc = parser.parseFromString(res, 'text/html');
          let con = Array.from(doc.querySelector('div.search-page').querySelectorAll('div.result-item'))
            .map(m=>{
              return {
                id: m.querySelector('.details a').href.split('/').slice(-2)[0],
                title: m.querySelector('.details a').innerText.replaceAll("'","&#39;"),
                img: getImgUrl(m.querySelector('.thumbnail img').getAttribute('data-src'))
              };
            });
          showSearch(con);
        });
      break;
  }
}
function showEpisodes(res) {
  document.getElementById('results').innerHTML = `<div class="anime">
  <div>
    <div class="stat">${res.finished ? 'Finished' : 'Ongoing'}</div>
    <img src="${state[si].img}">
  </div>
  <div style="flex:1">
    <b>Episodes</b>
    <br>
    ${res.next ? 'Next episode: '+new Date(res.next).toLocaleString(navigator, { dateStyle: 'short' }) : ''}
    ${res.eps.map(e=>`<li onclick="state[state.length]={page:'vid',id:'${state[si].id}',t:\`${state[si].t}\`,e:'${e.n}',eid:'${e.id}',provider:state[si].provider};si=state.length-1;setTop();" class="clicky">EP ${e.n}</li>`).join('')}
  </div>
</div>`;
}
function episodes() {
  let provider = state[si].provider??0;
  switch (provider) {
    case 0:
      geturl(`https://www3.animeflv.net/anime/${state[si].id}`)
        .then(res=>{
          showEpisodes({
            finished: res.match(/<p class="AnmStts A">/),
            next: JSON.parse(res.match(/var anime_info = \[.*?\];/)[0].split('];')[0].split(' = ')[1]+']')[3],
            eps: JSON.parse(res.match(/var episodes = \[.*?\];/)[0].split('];')[0].split(' = ')[1]+']').map(e=>{return { id: e[0], n: e[0] }})
          });
        })
      break;
    case 1:
    case 2:
    case 3:
      geturl(`https://${['aniwatchtv','hianime','9animetv'][provider-1]}.to/${provider===3?'watch/':''}${state[si].id}`)
        .then(res=>{
          let finished = (Array.from(res.matchAll(/<span( class="name")?>(Finished Airing|Currently Airing)<\/span>/g))[0][1]==='Finished Airing');
          geturl(`https://${['aniwatchtv','hianime','9animetv'][provider-1]}.to/ajax/${provider===3?'':'v2/'}episode/list/${state[si].id.split('-').slice(-1)[0]}`)
            .then(res2=>{
              const parser = new DOMParser();
              let doc = parser.parseFromString(JSON.parse(res2).html, 'text/html');
              showEpisodes({
                finished: finished,
                next: '',
                eps: Array.from(doc.querySelectorAll('.ss-list .ssl-item.ep-item, a.item.ep-item')).map(e=>{return { id: e.getAttribute('data-id'), n: e.getAttribute('data-number') }}).reverse()
              });
            });
        });
      break;
    case 5:
      showEpisodes({
        finished: true,
        next: '',
        eps: [{ id: state[si].id, n: 1 }]
      });
      break;
  }
}
//cats-tea-17956

function updateVid(code, provider) {
  switch(provider) {
    case 0:
      document.querySelector('iframe').src = code;
      break;
    case 1:
    case 2:
    case 3:
      geturl(`https://${['aniwatchtv','hianime','9animetv'][provider-1]}.to/ajax/${provider===3?'':'v2/'}episode/sources?id=${code}`)
        .then(async(res)=>{
          res = JSON.parse(res);
          document.querySelector('iframe').srcdoc = await videoWithRefer(res.link, 'https://'+['aniwatchtv','hianime','9animetv'][provider-1]+'.to/');
        });
      break;
    case 5:
      geturl(`https://dopebox.to/ajax/episode/sources/${code}`)
        .then(async(res)=>{
          res = JSON.parse(res);
          document.querySelector('iframe').srcdoc = await videoWithRefer(res.link, 'https://dopebox.to/');
        });
      break;
  }
}

function showVideo(videos, provider) {
  //  sandbox="allow-presentation	allow-scripts allow-downloads"
  document.getElementById('results').innerHTML = `${videos.map(s=>`<button onclick="updateVid('${s.code}', ${provider})">${s.title}${s.ads?' (ADS)':''}</button>`).join('')}
<br>
<div>
  <iframe allowfullscreen></iframe>
</div>
<span style="display:flex">
  <button onclick="state[state.length]={page:'vid',id:'${state[si].id}',t:\`${state[si].t}\`,e:'${Number(state[si].e-1)}',provider:state[si].provider};si=state.length-1;setTop();"${state[si].e<2?' style="display:none"':''}>Prev</button>
  <span style="flex:1"></span>
  <button onclick="download('${videos[0]?.url}', '${state[si].t}', '${state[si].id}')" style="display:none">Download</button>
  <span style="flex:1"></span>
  <button onclick="state[state.length]={page:'vid',id:'${state[si].id}',t:\`${state[si].t}\`,e:'${Number(state[si].e)+1}',provider:state[si].provider};si=state.length-1;setTop();">Next</button>
</span>`;
}
function video() {
  let provider = state[si].provider??0;
  switch (provider) {
    case 0:
      geturl(`https://www3.animeflv.net/ver/${state[si].id}-${state[si].e}`)
        .then(res=>{
          let videos = JSON.parse(res.match(/var videos = {[^¬].*?};/)[0].split(';')[0].split(' = ')[1]);
          showVideo(videos.SUB, 0);
          updateVid(videos.SUB[0].code, 0);
        });
      break;
    case 1:
    case 2:
    case 3:
      geturl(`https://${['aniwatchtv','hianime','9animetv'][provider-1]}.to/ajax/${provider===3?'':'v2/'}episode/servers?episodeId=${state[si].id.split('-').slice(-1)[0]}`)
        .then(res=>{
          const parser = new DOMParser();
          let doc = parser.parseFromString(JSON.parse(res).html, 'text/html');
          let videos = Array.from(doc.querySelectorAll('div.item.server-item'))
            .map(v => {
              return {
                title: v.querySelector('a').innerText,
                ads: false,
                code: v.getAttribute('data-id')
              }
            });
          showVideo(videos, provider);
          updateVid(videos[0].code, provider);
        });
      break;
    case 5:
      geturl(`https://dopebox.to/ajax/episode/list/${state[si].id.split('-').slice(-1)[0]}`)
        .then(res=>{
          const parser = new DOMParser();
          let doc = parser.parseFromString(res, 'text/html');
          let videos = Array.from(doc.querySelectorAll('a')).map(e=>{return { title: e.querySelector('span').innerText, ads: false, code: e.getAttribute('data-id') }});
          showVideo(videos, provider);
          updateVid(videos[0].code, provider);
        });
      break;
  }
}

var state = [{page:'search',q:'',n:1,provider:0}];
var si = 0;
if (location.hash) {
  state.push(JSON.parse(decodeURIComponent(location.hash.slice(1))));
  si += 1;
}

function setTop() {
  if (si>0) history.replaceState(null, null, '#'+JSON.stringify(state.slice(-1)[0]));
  let prov = document.getElementById('provider')?.value??(state[si].provider??0);
  let top = document.getElementById('top');
  top.innerHTML = (state.length>1?((si<1?'':'<button onclick="si--;setTop()">Back</button>')+(state.length-1===si?'':'<button onclick="si++;setTop()">Next</button>')):'');
  switch (state[si].page) {
    case 'search':
      top.innerHTML += `<input type="search" id="buswa" onkeyup="if(event.key=='Enter'){state[state.length]={page:'search',q:this.value.trim(),n:1,provider:${state[si].provider}};si=state.length-1;setTop();}" value="${state[si].q}">
<button onclick="state[state.length]={page:'search',q:document.getElementById('buswa').value,n:1,provider:${state[si].provider}};si=state.length-1;setTop();">Search</button>
<span style="flex:1"></span>
<select id="provider">
  <option disabled>-- Stable --</option>
  <option value="0">animeflv.net</option>
  <option disabled>-- Experimental --</option>
  <option value="1">aniwatchtv.to</option>
  <option value="2">hianime.to</option>
  <option value="3">9animetv.to</option>
  <option value="4">jkanime.net</option>
  <option value="5">dopebox.to</option>
  <option value="6">animeonline.ninja</option>
  <option value="7" disabled>hentaijk.com</option>
</select>`;
      document.getElementById('provider').value = state[si].provider??0;
      document.getElementById('provider').onchange = (evt)=>{
        state[state.length] = state[si];
        si=state.length-1;
        state[si].n = 1;
        state[si].provider = Number(evt.target.value)??0;
        setTop();
      };
      search();
      break;
    case 'ep':
      top.innerHTML += `${state[si].t}`;
      episodes();
      break;
    case 'vid':
      top.innerHTML += `${state[si].t} - ${state[si].e}`;
      video();
      break;
    default:
      alert(state[si].page);
      throw new Error('unknown '+state[si].page);
  }
}

setTop();

/*
const originalFetch = window.fetch;
window.fetch = function (...args) {
  if (args[0].includes('/thing/')) {
    console.warn('Blocked fetch to', args[0]);
    return Promise.reject(new Error('Blocked URL'));
  }
  return originalFetch.apply(this, args);
};
const originalOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function (method, url, ...rest) {
  if (url.includes('/thing/')) {
    console.warn('Blocked XHR to', url);
    throw new Error('Blocked URL');
  }
  return originalOpen.call(this, method, url, ...rest);
};
*/
