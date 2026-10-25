/* animate.js — add before </body>:  <script src="animate.js" defer></script> */
(function(){
  var rm=matchMedia('(prefers-reduced-motion:reduce)').matches, fine=matchMedia('(pointer:fine)').matches;

  /* 1. Typewriter under the hero name */
  var h1=document.querySelector('#home h1');
  if(h1){
    var t=document.createElement('div');
    t.style.cssText='font:600 1.1rem monospace;color:#34d399;min-height:1.6em';
    t.innerHTML='<span id="bwType"></span><span style="animation:bwBlink 1s steps(1) infinite">▍</span>';
    h1.after(t);
    var words=['Full-Stack Developer','Embedded Systems Engineer','AI / ML Builder','DevOps Enthusiast','LeetCode Knight'],w=0,c=0,del=false,el=document.getElementById('bwType');
    (function tick(){
      var full=words[w]; c+=del?-1:1; el.textContent=full.slice(0,c);
      var delay=del?35:75;
      if(!del&&c===full.length){del=true;delay=1400}
      else if(del&&c===0){del=false;w=(w+1)%words.length;delay=300}
      setTimeout(tick,rm?9999:delay);
    })();
  }

  /* 2. Count-up for numeric stats */
  var io=new IntersectionObserver(function(es){es.forEach(function(e){
    if(!e.isIntersecting)return; io.unobserve(e.target);
    var n=e.target, m=n.textContent.match(/(\d+(\.\d+)?)/); if(!m)return;
    var end=parseFloat(m[1]), dec=(m[2]||'').length, t0=performance.now(), pre=n.textContent.slice(0,m.index), post=n.textContent.slice(m.index+m[0].length);
    (function step(t){var k=Math.min(1,(t-t0)/1400),v=end*(1-Math.pow(1-k,3));
      n.firstChild.nodeValue=pre+v.toFixed(dec)+post; if(k<1)requestAnimationFrame(step)})(t0);
  })},{threshold:.6});
  document.querySelectorAll('.bento-stat > .text-3xl,.bento-stat > .md\\:text-4xl').forEach(function(n){
    if(n.firstChild&&n.firstChild.nodeType===3&&/\d/.test(n.textContent)&&!rm)io.observe(n)});

  if(rm||!fine)return;

  /* 3. Cursor glow follower */
  var g=document.createElement('div');
  g.style.cssText='position:fixed;left:0;top:0;width:380px;height:380px;margin:-190px 0 0 -190px;border-radius:50%;pointer-events:none;z-index:1;background:radial-gradient(circle,rgba(34,211,238,.13),transparent 65%);transition:transform .15s ease-out';
  document.body.appendChild(g);
  addEventListener('pointermove',function(e){g.style.transform='translate('+e.clientX+'px,'+e.clientY+'px)'});

  /* 4. 3D tilt on cards */
  document.querySelectorAll('.bg-cardBg').forEach(function(c){
    c.addEventListener('pointermove',function(e){var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      c.style.transform='perspective(800px) rotateY('+x*7+'deg) rotateX('+-y*7+'deg) translateY(-4px)'});
    c.addEventListener('pointerleave',function(){c.style.transform=''});
  });

  /* 5. Magnetic buttons */
  document.querySelectorAll('a.rounded-full,button.rounded-full,#submitBtn').forEach(function(b){
    b.addEventListener('pointermove',function(e){var r=b.getBoundingClientRect();
      b.style.transform='translate('+(e.clientX-r.left-r.width/2)*.18+'px,'+(e.clientY-r.top-r.height/2)*.28+'px)'});
    b.addEventListener('pointerleave',function(){b.style.transform=''});
  });
})();

/* ---- v3 extras ---- */
(function(){
  var rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
  /* aurora blobs */
  var au=document.createElement('div');au.className='bw-aurora';au.innerHTML='<i></i><i></i><i></i>';document.body.prepend(au);
  /* giant ticker after hero */
  var home=document.getElementById('home');
  if(home){
    var items=['FULL-STACK','EMBEDDED','AI / ML','DEVOPS','IoT','MERN','LEETCODE KNIGHT','PCB DESIGN'],html='';
    for(var r=0;r<4;r++)items.forEach(function(w){html+='<span>'+w+' ✦</span>'});
    var tk=document.createElement('div');tk.className='bw-ticker';tk.innerHTML='<div>'+html+'</div>';
    home.after(tk);
  }
  /* split hero name into popping letters */
  var nm=document.querySelector('#home h1 span');
  if(nm&&!rm){var s=nm.textContent,i=0;nm.innerHTML=s.split('').map(function(c){return c===' '?' ':'<span class="bw-ch" style="--i:'+(i++)+'">'+c+'</span>'}).join('')}
  /* parallax on aurora with scroll */
  if(!rm)addEventListener('scroll',function(){au.style.transform='translateY('+(scrollY*-.08)+'px)'},{passive:true});
})();