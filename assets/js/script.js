// Einfaches Theme (persistiert in localStorage) - robustere Version
(function(){
    const KEY = 'theme';
    const btn = document.getElementById('theme-toggle');
    const icon = document.getElementById('theme-icon');
    const text = document.getElementById('theme-text');

    function storedOrPref(){
        try {
            const s = localStorage.getItem(KEY);
            if(s === 'dark' || s === 'light') return s;
        } catch(e) {}
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function updateButtonUI(t){
        if(!btn) return;
        btn.setAttribute('aria-pressed', t === 'dark' ? 'true' : 'false');
        if(icon) icon.textContent = t === 'dark' ? '🌙' : '☀️';
        if(text) text.textContent = t === 'dark' ? 'Dark' : 'Light';
    }

    function apply(t){
        if(t === 'dark'){
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        updateButtonUI(t);
    }

    function toggle(){
        const cur = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        const next = cur === 'dark' ? 'light' : 'dark';
        apply(next);
        try { localStorage.setItem(KEY, next); } catch(e) {}
    }

    // init: ensure UI matches current state (may have been set by early script)
    if(btn){
        const initial = document.documentElement.classList.contains('dark') ? 'dark' : storedOrPref();
        apply(initial);
        btn.addEventListener('click', toggle);
        btn.addEventListener('keydown', e => { if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }});
    }
})();
