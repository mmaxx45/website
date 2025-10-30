// Simple Freedom Unit Converter
(function(){
  const unitsBase = {
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
      // standard can (12 fl oz) ~ 355 ml
      standard_dose: 0.355,
      // pickup truck bed approx. volume (~1.7 m^3 = 1700 L)
      pickup_bed: 1700,
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

  function units(category){
    // return a map of units for the given category, injecting dynamic "burger" units
    const map = Object.assign({}, unitsBase[category]);
    // hardcoded special units
    if(category === 'mass'){
      // M1 Abrams mass ~ 61,000 kg
      map['m1abrams'] = 62000000; // grams per M1 Abrams
      // burger as mass (hardcoded)
      map['burger'] = 200; // grams per burger
    }
    if(category === 'length'){
      // USS Nimitz-class length ~ 333 meters
      map['carrier'] = 333; // meters per aircraft carrier
      // American Bald Eagle wingspan ~ 2.3 m
      map['american_eagle'] = 2.3; // meters per eagle wingspan
      // American football field incl. end zones = 120 yards = 109.728 meters
      map['football_field'] = 109.728; // meters per football field
      // burger as length (hardcoded)
      map['burger'] = 0.13; // meters per burger 
    }
    return map;
  }

  function populateSelects(category){
    const display = {
      'm':'m','cm':'cm','in':'in','ft':'ft','yd':'yd','mi':'mi',
      'g':'g','kg':'kg','oz':'oz','lb':'lb','m1abrams':'M1 Abrams', 'burger':'Burger',
  'l':'l','ml':'ml','floz':'fl oz','standard_dose':'Standarddose','pickup_bed':'Pickup Bed','cup':'cup','pint':'pint','quart':'quart','gallon':'gallon',
      'c':'°C','f':'°F','carrier':'Flugzeugträger','american_eagle':'American Eagle','football_field':'Football Feld'
    };
    const from = document.getElementById('from');
    const to = document.getElementById('to');
    from.innerHTML = '';
    to.innerHTML = '';
    const list = units(category);
    // display mapping defined above
    Object.keys(list).forEach(k => {
      const opt1 = document.createElement('option'); opt1.value = k; opt1.textContent = display[k] || k;
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
  const map = units(category);
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
    // friendly unit label
    const labels = {
      'm':'m','cm':'cm','in':'in','ft':'ft','yd':'yd','mi':'mi',
      'g':'g','kg':'kg','oz':'oz','lb':'lb','m1abrams':'M1 Abrams','burger':'Burger',
  'l':'l','ml':'ml','floz':'fl oz','standard_dose':'Standarddose','pickup_bed':'Pickup Bed','cup':'cup','pint':'pint','quart':'quart','gallon':'gallon',
      'c':'°C','f':'°F','carrier':'Aircraft Carrier','american_eagle':'American Eagle','football_field':'Football Field'
    };
    const label = labels[to] || to;
    resEl.textContent = format(out) + (category === 'temperature' ? (' ' + label) : (' ' + label));

    // no hamburger-split UI anymore; burger is available as a unit in selects
  }

  // wire up
  document.addEventListener('DOMContentLoaded', function(){
    const cat = document.getElementById('category');
    populateSelects(cat.value);
    cat.addEventListener('change', function(){ populateSelects(cat.value); update(); });
    ['value','from','to'].forEach(id => {
      const el = document.getElementById(id);
      if(!el) return;
      el.addEventListener('input', update);
      el.addEventListener('change', update);
    });
    // initial update
    update();
  });
})();
