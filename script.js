/*
https://api.fsh.plus/file?url=
https://proxy.khacmanh-info.workers.dev/?url=
https://proxy.nkm1703.workers.dev/?url=
https://proxy.uneti-it.workers.dev/?url=
https://proxy.teamvn1235.workers.dev/?url=
https://proxy.zeronightpro.workers.dev/?url=
https://proxy.zeronightpro.workers.dev/?url=
https://proxy.cskh-n8n.workers.dev/?url=
https://proxy.manhnguyenict.workers.dev/?url=
https://proxy.nguyenmanhict.workers.dev/?url=
https://proxy.cskh-zm.workers.dev/?url=
https://proxy.tgb6jphrx7.workers.dev/?url=
https://proxy.manhict.workers.dev/?url=
https://bypass.manhgdev.workers.dev/?url=
https://cors.luckydesigner.workers.dev/?
https://cors.bbear.workers.dev/?
*/
window.console.clear = ()=>{};
const standardHeaders = {
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36',
  accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  'accept-language': 'en-US,en;q=1',
  'cache-control': 'no-cache',
  pragma: 'no-cache',
  priority: 'u=0, i',
  'sec-ch-ua': '"Google Chrome";v="149", "Chromium";v="149", "Not)A;Brand";v="24"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"',
  'sec-fetch-mode': 'navigate',
  'sec-fetch-site': 'cross-site',
  'sec-fetch-storage-access': 'active',
  'sec-fetch-user': '?1',
  'upgrade-insecure-requests': '1'
};
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
function getadvancedurl(url, opts) {
  return new Promise((resolve, reject) => {
    let k = url+'-'+JSON.stringify(opts);
    if (fetchCache[k]) {
      resolve(fetchCache[k]);
      return;
    }
    fetch(`https://api.fsh.plus/request?url=${encodeURIComponent(url)}`, {
      method: 'POST',
      body: JSON.stringify(opts)
    })
      .then(dat=>dat.json())
      .then(res=>{
        res = JSON.parse(res.content);
        fetchCache[k] = res;
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
      method: 'POST',
      body: JSON.stringify({
        method: 'GET',
        headers: {
          ...standardHeaders,
          referer: refer
          //'sec-fetch-dest': 'iframe',
        }
      })
    })
      .then(res=>res.json())
      .then(res=>{
        res.content = `<base href="${res.url}">
<script type="module">
window.console.clear = ()=>{};
document.referrer = '${refer}';
window.location.assign = ()=>{};
window.location.replace = ()=>{};
history.pushState = ()=>{};
history.replaceState = ()=>{};
const originalFetch = window.fetch;
window.fetch = function (...args) {
  /*if (args[0].includes('/thing/')) {
    console.warn('Blocked fetch to', args[0]);
    return Promise.reject(new Error('Blocked URL'));
  }*/
  args[0] = 'https://api.fsh.plus/file?url='+encodeURIComponent(args[0]);
  return originalFetch.apply(this, args);
};
const originalOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function (method, url, ...rest) {
  /*if (url.includes('/thing/')) {
    console.warn('Blocked XHR to', url);
    throw new Error('Blocked URL');
  }*/
  url = 'https://api.fsh.plus/file?url='+encodeURIComponent(url);
  return originalOpen.call(this, method, url, ...rest);
};
</script>`+res.content.replaceAll(/<meta .*?http-equiv="Content-Security-Policy".*?>/gi, '').replace(/<script async src="https:\/\/www.googletagmanager.com\/gtag\/js\?id=UA-[0-9]+?-[0-9]"><\/script>/gi,'');
        fetchCache[url] = res.content;
        resolve(res.content);
      });
  });
}
function getImgUrl(url) {
  if (['animeflv.net','vww.animeflv.one','i1.wp.com','cdn.jkdesa.com','cdn.anipixcdn.co'].includes(new URL(url).hostname)) return url;
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
${con.length>[23,23,19,29,999,31,29][state[si].provider]?`<button onclick="state[state.length]={page:'search',q:state[si].q,n:${state[si].n+1},provider:state[si].provider};si=state.length-1;setTop();">Next</button>`:''}
<div class="wrap">
  ${con.map(m=>`<div onclick="state[state.length]={page:'ep',id:'${m.id}',t:\`${m.title.replaceAll('"','”')}\`,img:'${m.img}',provider:state[si].provider};si=state.length-1;setTop();" class="clicky"><img src="${m.img}" loading="lazy"><span>${m.title}</span></div>`).join('')}
</div>`;
}
function search() {
  if (state[si].q==='doom') location.href='/doom';
  let page = state[si].n;
  let quer = state[si].q;
  let provider = state[si].provider??0;
  switch (provider) {
    case 0:
      geturl(`https://www3.animeflv.net/browse?q=${quer}&page=${page}`)
        .then(res=>{
          let con = Array.from(res
            .match(/<!--<Animes>-->(?:[^¬]|¬)*?<!--<\/Animes>-->/g)[0]
            .match(/<article class="Anime.*?>(?:[^¬]|¬)*?<\/article>/g) ?? [])
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
      geturl(`https://animeflv.one/animes?buscar=${quer}&pag=${page}`)
        .then(res=>{
          let con = Array.from(res
            .match(/<div class="ul x6">(?:[^¬]|¬)*?<\/div>/g)[0]
            .match(/<article class="li">(?:[^¬]|¬)*?<\/article>/g) ?? [])
            .map(m => {
              return {
                id: m.match(/<a href="(.*?)".*?>/)[1].split('/').slice(-1)[0],
                title: m.match(/<h3 class="h"><a.*?>(.*?)<\/a><\/h3>/)[1].replaceAll("'","&#39;"),
                img: getImgUrl(m.match(/<img.*? data-src="(.*?)" .*?>/)[1])
              };
            });
          showSearch(con);
        })
      break;
    case 2:
      geturl(`https://animeflv.ar/page/${page}/?s=${quer}`)
        .then(res=>{
          let con = Array.from(res
            .match(/<div class="listupd">(?:[^¬]|¬)*?<\/div>\s*<div class="pagination">/g)[0]
            .match(/<article class="bs" itemscope="itemscope" itemtype=".*?">(?:[^¬]|¬)*?<\/article>/g) ?? [])
            .map(m => {
              return {
                id: m.match(/<a href="(.*?)".*?>/)[1].split('/').slice(-2)[0],
                title: m.match(/<img.*?title="(.*?)".*?>/)[1].replaceAll("'","&#39;"),
                img: getImgUrl(m.match(/<img.*?src="(.*?)".*?>/)[1])
              };
            });
          showSearch(con);
        })
      break;
    case 3:
      geturl(`https://anikototv.to/filter?keyword=${quer}&page=${page}`)
        .then(res=>{
          const parser = new DOMParser();
          const doc = parser.parseFromString(res, 'text/html');
          let con = Array.from(doc.getElementById('list-items').querySelectorAll('.item'))
            .map(m => {
              return {
                id: m.querySelector('.name').href.split('watch/')[1].split('/')[0],
                title: m.querySelector('.name').innerText.replaceAll("'","&#39;"),
                img: getImgUrl(m.querySelector('img').src)
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
  switch(provider) {
    case 0:
    case 1:
    case 2:
      geturl(`https://${['www3.animeflv.net','animeflv.one','animeflv.ar'][provider]}/anime/${state[si].id}`)
        .then(res=>{
          let data = {};
          switch(provider) {
            case 0:
              data = {
                finished: res.match(/<p class="AnmStts A">/),
                next: JSON.parse(res.match(/var anime_info = \[.*?\];/)[0].split('];')[0].split(' = ')[1]+']')[3],
                eps: JSON.parse(res.match(/var episodes = (\[.*?\]);/)[1]).map(e=>{return { id: e[0], n: e[0] }})
              };
              break;
            case 1:
              data = {
                finished: res.includes('<div class="st c-f"><span>Finalizado</span></div>'),
                next: res.includes('<ul class="ep prox">')?res.match(/Episodio<\/b><strong>(.*?) <i/)[1]:'',
                eps: JSON.parse(res.match(/var eps = (\[.*?\]);/)[1]).map(e=>{return { id: state[si].id+'-'+e[0], n: e[0] }})
              };
              break;
            case 2:
              data = {
                finished: res.match(/<span><b>Status:<\/b> Completed<\/span>/),
                next: '',
                eps: Array.from(res.match(/<div class="ephead">.*?<\/div><ul>(.*?)<\/ul>/)[1].matchAll(/<li.*?>.*?<\/li>/g)).map(e=>{
                  e = e[0];
                  return {
                    id: e.match(/<a href="(.*?)">/)[1].split('/').slice(-2)[0],
                    n: e.match(/<div class="epl-num">(.*?)<\/div>/)[1]
                  }
                })
              };
              break;
          }
          showEpisodes(data);
        })
      break;
    case 3:
      geturl(`https://anikototv.to/watch/${state[si].id}/ep-1`)
        .then(res=>{
          let id = res.match(/const\smangaId\s=\s([0-9]+);/)[1];
          getadvancedurl(`https://anikototv.to/ajax/episode/list/${id}`, {
            method: 'GET',
            headers: {
              ...standardHeaders,
              referer: `https://anikototv.to/watch/${state[si].id}/ep-1`,
              'x-requested-with': 'XMLHttpRequest'
            }
          })
            .then(res2=>{
              const parser = new DOMParser();
              let doc = parser.parseFromString(res2.result, 'text/html');
              showEpisodes({
                finished: res.includes('<a href="https://anikototv.to/status/finished-airing"> Finished Airing </a>'),
                next: res.includes('<div class="alert next-episode">')?res.match(/ \(<span class="count-down" data-target="([0-9]+)"/)[1]*1000:'',
                eps: Array.from(doc.querySelectorAll('li a')).map(e=>{return { id, n: e.getAttribute('data-num') }}).reverse()
              });
            });
        });
      break;
    case 4:
      fetch(`https://api.fsh.plus/file?url=${encodeURIComponent(`https://jkanime.net/${state[si].id}`)}`)
        .then(res=>res.text())
        .then(res=>{
          let csrf = res.match(/<meta name="csrf-token" content="([^"]+?)">/)[1];
          fetch('https://api.fsh.plus/request?url='+encodeURIComponent(res.match(/url: '(https:\/\/jkanime.net\/ajax\/episodes\/[0-9]+\/)'\+/)[1]+'1'), {
            method: 'POST',
            body: JSON.stringify({
              method: 'POST',
              body: '{"_token":"'+csrf+'"}',
              headers: {
                ...standardHeaders,
                referer: `https://jkanime.net/${state[si].id}`
              }
            })
          })
            .then(dat=>dat.json())
            .then(dat=>{
              let data = { data: [] };
              try {
                data = JSON.parse(dat.content);
              } catch(err) {}
              showEpisodes({
                finished: res.includes('<div class="enemision finished">Concluido</div>'),
                next: '',
                eps: data.data.map(ep=>{return { id: ep.id, n: ep.number }})
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

const dontLikeTheSandbox = 'SW,Netu,Stape'.split(',');
const unsandboxed = ['vidtube.site'];
function updateVid(code, provider, extra='') {
  let iframe = document.querySelector('iframe');
  iframe[dontLikeTheSandbox.includes(extra)?'removeAttribute':'setAttribute']('sandbox', 'allow-downloads allow-forms allow-modals allow-orientation-lock allow-presentation allow-scripts allow-same-origin');
  iframe.removeAttribute('src');
  iframe.removeAttribute('srcdoc');
  function setUrl(url) {
    iframe[unsandboxed.includes(new URL(url).hostname)?'removeAttribute':'setAttribute']('sandbox', 'allow-downloads allow-forms allow-modals allow-orientation-lock allow-presentation allow-scripts allow-same-origin');
    iframe.src = url;
  }
  switch(provider) {
    case 0:
    case 1:
    case 2:
      iframe.src = code;
      break;
    case 3:
      getadvancedurl(`https://anikototv.to/ajax/server?get=${code}`, {
        method: 'GET',
        headers: {
          ...standardHeaders,
          referer: `https://anikototv.to/watch/${state[si].id}/ep-1`,
          'x-requested-with': 'XMLHttpRequest'
        }
      })
        .then(res=>{
          setUrl(res.result.url);
        });
      break;
    case 5:
      geturl(`https://dopebox.to/ajax/episode/sources/${code}`)
        .then(async(res)=>{
          res = JSON.parse(res);
          iframe.srcdoc = await videoWithRefer(res.link, 'https://dopebox.to/');
        });
      break;
  }
}

function showVideo(videos, provider) {
  document.getElementById('results').innerHTML = `${videos.map(s=>`<button onclick="updateVid('${s.code}', ${provider}, '${s.title}')">${s.title}${s.ads?' (ADS)':''}</button>`).join('')}
<br>
<div>
  <iframe allowfullscreen referrerpolicy="no-referrer" sandbox="allow-downloads allow-forms allow-modals allow-orientation-lock allow-presentation allow-scripts allow-same-origin" allow="autoplay; compute-pressure; cross-origin-isolated; encrypted-media; fullscreen; gamepad; local-fonts; midi; picture-in-picture; screen-wake-lock; speaker-selection; storage-access; web-share"></iframe>
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
    case 1:
    case 2:
      geturl(`https://www3.animeflv.net/ver/${state[si].id}-${state[si].e}`)
        .then(res=>{
          let videos = JSON.parse(res.match(/var videos = {[^¬].*?};/)[0].split(';')[0].split(' = ')[1]);
          showVideo(videos.SUB, provider);
          updateVid(videos.SUB[0].code, 0, videos.SUB[0].title);
        });
      break;
    case 3:
      getadvancedurl(`https://anikototv.to/ajax/episode/list/${state[si].eid}`, {
        method: 'GET',
        headers: {
          ...standardHeaders,
          referer: `https://anikototv.to/watch/${state[si].id}/ep-1`,
          'x-requested-with': 'XMLHttpRequest'
        }
      })
        .then(res=>{
          const parser = new DOMParser();
          let doc = parser.parseFromString(res.result, 'text/html');
          let dat = doc.querySelector('li a[data-num="'+state[si].e+'"]');
          //<a href="#" data-id="134028" data-num="1" data-slug="1" data-mal="61483" data-timestamp="1783182658" data-sub="1" data-dub="0" data-ids="dEV4U2RlZmptbFlweStFTUFCMHZqakE2OWVwanF0WjRTdWFsWTkwS1hWSSs2dGVYOVZoNUN0SDh0cDJaTXcwOFVOYlo3K1lxUktHMjgwbjVCd3J1UFZzSWF3WmRpN1ZQY1Z0eURXVXN2U2RudjFkTnl5LzNrem1kQ3NCZS9xWlBkODRhTTNUbDJuaVc4L05maGxCd0NBPT0" class="active  " ><b>1</b>
          getadvancedurl(`https://anikototv.to/ajax/server/list?servers=${dat.getAttribute('data-ids')}`, {
            method: 'GET',
            headers: {
              ...standardHeaders,
              referer: `https://anikototv.to/watch/${state[si].id}/ep-1`,
              'x-requested-with': 'XMLHttpRequest'
            }
          })
            .then(res2=>{
              let serdoc = parser.parseFromString(res2.result, 'text/html');
              let videos = Array.from(serdoc.querySelectorAll('li'))
                .map(v => {
                  return {
                    title: v.innerText,
                    ads: false,
                    code: v.getAttribute('data-link-id')
                  }
                });
              showVideo(videos, provider);
              updateVid(videos[0].code, provider, videos[0].title);
            })
        });
      break;
    case 5:
      geturl(`https://dopebox.to/ajax/episode/list/${state[si].id.split('-').slice(-1)[0]}`)
        .then(res=>{
          const parser = new DOMParser();
          let doc = parser.parseFromString(res, 'text/html');
          let videos = Array.from(doc.querySelectorAll('a')).map(e=>{return { title: e.querySelector('span').innerText, ads: false, code: e.getAttribute('data-id') }});
          showVideo(videos, provider);
          updateVid(videos[0].code, provider, videos[0].title);
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
  <option disabled>-- Main --</option>
  <option value="0">animeflv.net</option>
  <option value="1">animeflv.one</option>
  <option value="2">animeflv.ar</option>
  <option value="3">anikototv.to</option>
  <option disabled>-- WIP --</option>
  <option value="4">jkanime.net</option>
  <option value="5">dopebox.to</option>
  <option value="6">animeonline.ninja</option>
</select>`;// hentaijk.com
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
