// Simple Freedom Unit Converter
(function(){
  const units = {
    length: {
      m: 1,
      cm: 0.01,
      in: 0.0254,
      ft: 0.3048,
      yd: 0.9144,
      mi: 1609.344
    },
    mass: {
      g: 1,
      kg: 1000,
      oz: 28.349523125,
      lb: 453.59237
    },
    volume: {
      l: 1,
      ml: 0.001,
      floz: 0.0295735295625, // US fl oz
      cup: 0.2365882365, // US cup
      pint: 0.473176473,
      quart: 0.946352946,
      gallon: 3.785411784
    },
    temperature: {
      c: 'c',
      f: 'f'
    }
  };

  function populateSelects(category){
    const from = document.getElementById('from');
    const to = document.getElementById('to');
    from.innerHTML = '';
    to.innerHTML = '';
    const list = units[category];
    Object.keys(list).forEach(k => {
      const opt1 = document.createElement('option'); opt1.value = k; opt1.textContent = k;
      const opt2 = opt1.cloneNode(true);
      from.appendChild(opt1);
      to.appendChild(opt2);
    });
    // sensible defaults
    if(category === 'length'){ from.value='in'; to.value='cm'; }
    if(category === 'mass'){ from.value='lb'; to.value='kg'; }
    if(category === 'volume'){ from.value='cup'; to.value='l'; }
    if(category === 'temperature'){ from.value='f'; to.value='c'; }
  }

  function convert(category, value, from, to){
    if(category === 'temperature'){
      const v = Number(value);
      if(from === to) return v;
      if(from === 'c' && to === 'f') return v * 9/5 + 32;
      if(from === 'f' && to === 'c') return (v - 32) * 5/9;
      return NaN;
    }
    const map = units[category];
    const baseFrom = map[from];
    const baseTo = map[to];
    if(baseFrom == null || baseTo == null) return NaN;
    const inBase = Number(value) * baseFrom; // value in base (m, g, l)
    const result = inBase / baseTo;
    return result;
  }

  function format(n){
    if(!isFinite(n)) return '—';
    if(Math.abs(n) < 0.0001) return n.toExponential(3);
    return Number(n.toFixed(6)).toString();
  }

  function update(){
    const category = document.getElementById('category').value;
    const value = document.getElementById('value').value;
    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
    const resEl = document.getElementById('result');
    let out = convert(category, value, from, to);
    if(category === 'temperature'){
      resEl.textContent = format(out) + ' ' + to.toUpperCase();
    } else {
      resEl.textContent = format(out) + ' ' + to;
    }

    // hamburger split if enabled and category is mass
    const doBurger = document.getElementById('do-hamburger').checked;
    const burgerResult = document.getElementById('burger-result');
    if(doBurger && category === 'mass'){
      const burgerWeight = Number(document.getElementById('burger-weight').value) || 150; // grams
      // convert the input to grams
      const grams = convert('mass', value, from, 'g');
      const count = Math.floor(grams / burgerWeight);
      burgerResult.textContent = `${count} Burger (~${burgerWeight} g)`;
    } else if(doBurger){
      burgerResult.textContent = 'Hamburger-Split nur für Massenwerte verfügbar';
    } else {
      burgerResult.textContent = '';
    }
  }

  // wire up
  document.addEventListener('DOMContentLoaded', function(){
    const cat = document.getElementById('category');
    populateSelects(cat.value);
    cat.addEventListener('change', function(){ populateSelects(cat.value); update(); });
    ['value','from','to','do-hamburger','burger-weight'].forEach(id => {
      const el = document.getElementById(id);
      if(!el) return;
      el.addEventListener('input', update);
      el.addEventListener('change', update);
    });
    // initial update
    update();
  });
})();
