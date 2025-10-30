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
    // Apply stored or preferred theme even if there is no toggle button on this page
    const initial = document.documentElement.classList.contains('dark') ? 'dark' : storedOrPref();
    apply(initial);
    if(btn){
        btn.addEventListener('click', toggle);
        btn.addEventListener('keydown', e => { if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }});
    }
})();

// Expand/collapse project cards (accessible)
(function(){
    function setMaxHeight(details, open){
        if(!details) return;
        if(open){
            details.style.maxHeight = details.scrollHeight + 'px';
        } else {
            details.style.maxHeight = null;
        }
    }

    function toggleForMain(main){
        const card = main.closest('.card');
        if(!card) return;
        const id = main.getAttribute('aria-controls');
        const details = id ? document.getElementById(id) : null;
        const isOpening = !card.classList.contains('is-open');

        // Close any other open cards first (animate their collapse)
        document.querySelectorAll('.card.is-open').forEach(c => {
            if (c === card) return;
            const mainOther = c.querySelector('.card-main');
            const ctrl = mainOther && mainOther.getAttribute('aria-controls');
            const det = ctrl ? document.getElementById(ctrl) : null;
            // remove open state on the card so visual indicators (chevron) update
            c.classList.remove('is-open');
            if (mainOther) mainOther.setAttribute('aria-expanded', 'false');
            if (det) {
                // animate from current height to 0
                try {
                    // set explicit start values to ensure transition animates
                    const computed = window.getComputedStyle(det);
                    det.style.maxHeight = det.scrollHeight + 'px';
                    det.style.paddingTop = computed.paddingTop;
                    // ensure transition is enabled (use CSS-defined transition)
                    // force reflow
                    // eslint-disable-next-line no-unused-expressions
                    det.offsetHeight;
                    // then collapse
                    det.setAttribute('aria-hidden', 'true');
                    det.style.maxHeight = '0px';
                    det.style.paddingTop = '0px';

                    const onEnd = (ev) => {
                        if (ev.propertyName === 'max-height') {
                            // cleanup inline styles after animation
                            det.style.maxHeight = null;
                            det.style.paddingTop = null;
                            det.removeEventListener('transitionend', onEnd);
                        }
                    };
                    det.addEventListener('transitionend', onEnd);
                } catch (e) {
                    // fallback: close instantly
                    det.setAttribute('aria-hidden', 'true');
                    det.style.maxHeight = null;
                    det.style.paddingTop = null;
                }
            }
        });

        // Toggle current card
        if(isOpening){
            card.classList.add('is-open');
            main.setAttribute('aria-expanded', 'true');
            if(details) details.setAttribute('aria-hidden', 'false');
            setMaxHeight(details, true);
        } else {
            card.classList.remove('is-open');
            main.setAttribute('aria-expanded', 'false');
            if(details) details.setAttribute('aria-hidden', 'true');
            setMaxHeight(details, false);
        }
    }

    document.addEventListener('click', function(e){
        const main = e.target.closest && e.target.closest('.card-main');
        if(!main) return;
        e.preventDefault();
        toggleForMain(main);
    });

    document.addEventListener('keydown', function(e){
        if(e.key !== 'Enter' && e.key !== ' ') return;
        const main = e.target.closest && e.target.closest('.card-main');
        if(!main) return;
        e.preventDefault();
        toggleForMain(main);
    });

    // Prevent card click from triggering when clicking internal links
    document.querySelectorAll && document.querySelectorAll('.card a').forEach(a => {
        a.addEventListener('click', e => e.stopPropagation());
    });
})();
