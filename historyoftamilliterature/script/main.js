
(function(){
  var root = document.documentElement.getAttribute("data-root") || "./";

  function inject(id, html){
    var el = document.getElementById(id);
    if(!el) return;
    el.innerHTML = html.replaceAll("{{ROOT}}", root);
  }

  
  var HEADER = `<header class="site-header">
  <div class="nav-wrap">
    <a class="brand" href="{{ROOT}}index.html" aria-label="QuietStrength Home">
      <span class="brand-mark" aria-hidden="true"></span>
      <span class="brand-text">
        <span class="brand-name">QuietStrength</span>
        <span class="brand-tag">by SafeHaven Mind Campaign</span>
      </span>
    </a>

    <nav class="site-nav" aria-label="Primary">
      <a href="{{ROOT}}index.html">Home</a>

      <details class="nav-dd">
        <summary>Disorders</summary>
        <div class="nav-dd-menu" role="menu">
          <a role="menuitem" href="{{ROOT}}disorders/index.html">All Disorders</a>
          <span class="nav-dd-sep" aria-hidden="true"></span>
          <a role="menuitem" href="{{ROOT}}disorders/anxiety.html">Anxiety</a>
          <a role="menuitem" href="{{ROOT}}disorders/depression.html">Depression</a>
          <a role="menuitem" href="{{ROOT}}disorders/adhd.html">ADHD</a>
          <a role="menuitem" href="{{ROOT}}disorders/autism.html">Autism</a>
          <a role="menuitem" href="{{ROOT}}disorders/bipolar.html">Bipolar</a>
          <a role="menuitem" href="{{ROOT}}disorders/schizophrenia.html">Schizophrenia</a>
          <a role="menuitem" href="{{ROOT}}disorders/dmdd.html">DMDD</a>
        </div>
      </details>

      <a href="{{ROOT}}coping.html">Coping Tools</a>
      <a href="{{ROOT}}research.html">Research</a>
      <a href="{{ROOT}}stories.html">Stories</a>
      <a href="{{ROOT}}community.html">Community</a>

      <a class="nav-cta" href="{{ROOT}}help.html">Get Help</a>
    </nav>
  </div>

  <div class="safety-strip" role="note">
    <span class="pill">Educational only</span>
    <span class="safety-text">If you or someone you know is in immediate danger, call your local emergency number.</span>
    <a class="safety-link" href="{{ROOT}}help.html">988 resources</a>
  </div>
</header>
`;
  var FOOTER = `<footer class="site-footer">
  <div class="footer-grid">
    <div>
      <h3>QuietStrength</h3>
      <p class="muted">A SafeHaven Mind Campaign website for mental health awareness, education, and support.</p>
    </div>

    <div>
      <h4>Explore</h4>
      <ul>
        <li><a href="{{ROOT}}disorders/index.html">Disorders</a></li>
        <li><a href="{{ROOT}}coping.html">Coping Tools</a></li>
        <li><a href="{{ROOT}}research.html">Research</a></li>
        <li><a href="{{ROOT}}stories.html">Stories</a></li>
      </ul>
    </div>

    <div>
      <h4>Trust & Safety</h4>
      <p class="muted">This website provides educational information and does not replace professional medical advice, diagnosis, or treatment.</p>
      <p class="muted small">In crisis? Visit <a href="{{ROOT}}help.html">Get Help</a> for 988 and other resources.</p>
    </div>

    <div>
      <h4>Sources</h4>
      <ul>
        <li><a href="https://www.nami.org/" target="_blank" rel="noopener">NAMI</a></li>
        <li><a href="https://www.samhsa.gov/" target="_blank" rel="noopener">SAMHSA</a></li>
        <li><a href="https://www.cdc.gov/mentalhealth/" target="_blank" rel="noopener">CDC</a></li>
        <li><a href="https://www.nimh.nih.gov/health" target="_blank" rel="noopener">NIMH</a></li>
        <li><a href="https://www.who.int/health-topics/mental-health" target="_blank" rel="noopener">WHO</a></li>
      </ul>
    </div>
  </div>

  <div class="footer-bottom">
    <span>© <span id="year"></span> QuietStrength • SafeHaven Mind Campaign</span>
    <span class="muted small">Built with care for mental well-being.</span>
  </div>
</footer>
`;

  inject("siteHeader", HEADER);
  inject("siteFooter", FOOTER);


  var y = document.getElementById("year");
  if(y){ y.textContent = new Date().getFullYear(); }

  
  var form = document.getElementById("boardForm");
  var list = document.getElementById("postList");
  var clearBtn = document.getElementById("clearPosts");
  if(form && list){
    var KEY = "quietstrength_posts_v1";

    function escapeHtml(str){
      return String(str)
        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;")
        .replaceAll('"',"&quot;")
        .replaceAll("'","&#39;");
    }

    function load(){
      try{
        var raw = localStorage.getItem(KEY);
        return raw ? JSON.parse(raw) : [];
      }catch(e){ return []; }
    }

    function save(posts){
      localStorage.setItem(KEY, JSON.stringify(posts));
    }

    function render(){
      var posts = load();
      list.innerHTML = "";
      if(posts.length === 0){
        list.innerHTML = `<div class="muted small">No posts yet. Be the first to share something encouraging.</div>`;
        return;
      }
      posts.slice().reverse().forEach(function(p){
        var date = new Date(p.ts);
        var nice = isNaN(date.getTime()) ? "" : date.toLocaleString();
        var card = document.createElement("div");
        card.className = "post";
        card.innerHTML = `
          <div class="meta">
            <span><strong>${escapeHtml(p.name || "Anonymous")}</strong></span>
            <span>${escapeHtml(nice)}</span>
          </div>
          <p class="text">${escapeHtml(p.text || "")}</p>
        `;
        list.appendChild(card);
      });
    }

    render();

    form.addEventListener("submit", function(e){
      e.preventDefault();
      var name = (document.getElementById("name") || {}).value || "";
      var text = (document.getElementById("message") || {}).value || "";

      if(text.trim().length < 3){
        alert("Please write a short message (at least 3 characters).");
        return;
      }

      var posts = load();
      posts.push({ name: name.trim().slice(0, 40), text: text.trim().slice(0, 900), ts: Date.now() });
      save(posts);

      form.reset();
      render();
    });

    if(clearBtn){
      clearBtn.addEventListener("click", function(){
        if(confirm("Clear all posts on this device?")){
          localStorage.removeItem(KEY);
          render();
        }
      });
    }
  }
})();
