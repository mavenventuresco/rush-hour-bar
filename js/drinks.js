// Glass types
const GL = [
  { id: 'wine',    l: 'Wine'    },
  { id: 'martini', l: 'Martini' },
  { id: 'shot',    l: 'Shot'    },
  { id: 'rocks',   l: 'Rocks'   },
  { id: 'tall',    l: 'Tall'    },
  { id: 'mug',     l: 'Mug'     },
];

// Shelf categories & items
const SHELVES = {
  cognac:  { ico: '✨', lbl: 'Cognac',  items: [{ id: 'vs', n: 'VS' }, { id: 'vsop', n: 'VSOP' }, { id: 'xo', n: 'XO' }] },
  liqueur: { ico: '🍊', lbl: 'Liqueur', items: [
    { id: 'baileys', n: 'Baileys' }, { id: 'kahlua', n: 'Kahlúa' }, { id: 'triple_sec', n: 'Triple Sec' },
    { id: 'cointreau', n: 'Cointreau' }, { id: 'vermouth', n: 'Vermouth' }, { id: 'bitters', n: 'Bitters' },
    { id: 'campari', n: 'Campari' }, { id: 'amaretto', n: 'Amaretto' },
  ]},
  rum:     { ico: '🍾', lbl: 'Rum',     items: [{ id: 'light_rum', n: 'Light Rum' }, { id: 'dark_rum', n: 'Dark Rum' }] },
  wine:    { ico: '🍷', lbl: 'Wine',    items: [{ id: 'red_wine', n: 'Red' }, { id: 'white_wine', n: 'White' }, { id: 'rose', n: 'Rosé' }] },
  juice:   { ico: '🍋', lbl: 'Juice',   items: [
    { id: 'apple', n: 'Apple' }, { id: 'coconut', n: 'Coconut' }, { id: 'cranberry', n: 'Cranberry' },
    { id: 'grapefruit', n: 'Grapefruit' }, { id: 'lemon', n: 'Lemon' }, { id: 'lime', n: 'Lime' },
    { id: 'orange', n: 'Orange' }, { id: 'peach', n: 'Peach' }, { id: 'pineapple', n: 'Pineapple' }, { id: 'tomato', n: 'Tomato' },
  ]},
  beverage:{ ico: '🥤', lbl: 'Beverage',items: [
    { id: 'citrus_soda', n: 'Citrus Soda' }, { id: 'cola', n: 'Cola' }, { id: 'energy', n: 'Energy' },
    { id: 'lemonade', n: 'Lemonade' }, { id: 'water', n: 'Water' }, { id: 'orange_soda', n: 'Org Soda' }, { id: 'tonic', n: 'Tonic' },
  ]},
  vodka:   { ico: '🧊', lbl: 'Spirits', items: [
    { id: 'absinthe', n: 'Absinthe' }, { id: 'gin', n: 'Gin' }, { id: 'schnapps', n: 'Schnapps' },
    { id: 'tequila', n: 'Tequila' }, { id: 'vodka', n: 'Vodka' },
  ]},
  whiskey: { ico: '🪵', lbl: 'Whiskey', items: [
    { id: 'bourbon', n: 'Bourbon' }, { id: 'scotch', n: 'Scotch' }, { id: 'rye', n: 'Rye' },
    { id: 'irish', n: 'Irish' }, { id: 'tennessee', n: 'Tennessee' },
  ]},
  syrup:   { ico: '🍬', lbl: 'Syrup',   items: [
    { id: 'simple', n: 'Simple' }, { id: 'grenadine', n: 'Grenadine' }, { id: 'elderflower', n: 'Elderflower' },
  ]},
};

// Drink recipes
const DRINKS = [
  { name: 'Draft Lager',      g: 'mug',     steps: [{ t: 'tap', id: 'light', l: 'Light Tap' }], mix: false },
  { name: 'Dark Ale',         g: 'mug',     steps: [{ t: 'tap', id: 'dark',  l: 'Dark Tap'  }], mix: false },
  { name: 'Red Wine',         g: 'wine',    steps: [{ t: 's', id: 'red_wine',  l: 'Red Wine'  }], mix: false },
  { name: 'White Wine',       g: 'wine',    steps: [{ t: 's', id: 'white_wine',l: 'White Wine'}], mix: false },
  { name: 'Rosé',             g: 'wine',    steps: [{ t: 's', id: 'rose',      l: 'Rosé'      }], mix: false },
  { name: 'Cognac XO',        g: 'rocks',   steps: [{ t: 's', id: 'xo',        l: 'XO'        }], mix: false },
  { name: 'Scotch Neat',      g: 'rocks',   steps: [{ t: 's', id: 'scotch', l: 'Scotch' }, { t: 'ice', l: 'Ice' }], mix: false },
  { name: 'Bourbon Rocks',    g: 'rocks',   steps: [{ t: 's', id: 'bourbon',l: 'Bourbon'}, { t: 'ice', l: 'Ice' }], mix: false },
  { name: 'Tequila Shot',     g: 'shot',    steps: [{ t: 's', id: 'tequila',l: 'Tequila'}], mix: false },
  { name: 'Rum & Cola',       g: 'tall',    steps: [{ t: 's', id: 'dark_rum', l: 'Dark Rum' }, { t: 'ice', l: 'Ice' }, { t: 's', id: 'cola', l: 'Cola' }], mix: false },
  { name: 'Vodka Soda',       g: 'tall',    steps: [{ t: 's', id: 'vodka', l: 'Vodka' }, { t: 'ice', l: 'Ice' }, { t: 's', id: 'tonic', l: 'Tonic' }], mix: false },
  { name: 'Screwdriver',      g: 'tall',    steps: [{ t: 's', id: 'vodka', l: 'Vodka' }, { t: 'ice', l: 'Ice' }, { t: 's', id: 'orange', l: 'Orange' }], mix: false },
  { name: 'Gin & Tonic',      g: 'tall',    steps: [{ t: 's', id: 'gin', l: 'Gin' }, { t: 'ice', l: 'Ice' }, { t: 's', id: 'tonic', l: 'Tonic' }], mix: false },
  { name: 'Moscow Mule',      g: 'mug',     steps: [{ t: 's', id: 'vodka', l: 'Vodka' }, { t: 'ice', l: 'Ice' }, { t: 's', id: 'citrus_soda', l: 'Citrus Soda' }, { t: 's', id: 'lime', l: 'Lime' }], mix: false },
  { name: 'Bloody Mary',      g: 'tall',    steps: [{ t: 's', id: 'vodka', l: 'Vodka' }, { t: 's', id: 'tomato', l: 'Tomato' }, { t: 's', id: 'lemon', l: 'Lemon' }], mix: false },
  { name: 'Tequila Sunrise',  g: 'tall',    steps: [{ t: 's', id: 'tequila', l: 'Tequila' }, { t: 's', id: 'orange', l: 'Orange' }, { t: 's', id: 'grenadine', l: 'Grenadine' }, { t: 'ice', l: 'Ice' }], mix: false },
  { name: 'Negroni',          g: 'rocks',   steps: [{ t: 's', id: 'gin', l: 'Gin' }, { t: 's', id: 'campari', l: 'Campari' }, { t: 's', id: 'vermouth', l: 'Vermouth' }, { t: 'ice', l: 'Ice' }], mix: false },
  { name: 'Aperol Spritz',    g: 'wine',    steps: [{ t: 's', id: 'campari', l: 'Campari' }, { t: 's', id: 'white_wine', l: 'White Wine' }, { t: 's', id: 'citrus_soda', l: 'Citrus Soda' }], mix: false },
  { name: 'Sex on the Beach', g: 'tall',    steps: [{ t: 's', id: 'vodka', l: 'Vodka' }, { t: 's', id: 'schnapps', l: 'Schnapps' }, { t: 's', id: 'cranberry', l: 'Cranberry' }, { t: 's', id: 'orange', l: 'Orange' }], mix: false },
  { name: 'Margarita',        g: 'martini', steps: [{ t: 's', id: 'tequila', l: 'Tequila' }, { t: 's', id: 'cointreau', l: 'Cointreau' }, { t: 's', id: 'lime', l: 'Lime' }, { t: 'ice', l: 'Ice' }], mix: true },
  { name: 'Whiskey Sour',     g: 'rocks',   steps: [{ t: 's', id: 'bourbon', l: 'Bourbon' }, { t: 's', id: 'lemon', l: 'Lemon' }, { t: 's', id: 'simple', l: 'Simple Syrup' }, { t: 'ice', l: 'Ice' }], mix: true },
  { name: 'Cosmopolitan',     g: 'martini', steps: [{ t: 's', id: 'vodka', l: 'Vodka' }, { t: 's', id: 'cointreau', l: 'Cointreau' }, { t: 's', id: 'cranberry', l: 'Cranberry' }, { t: 's', id: 'lime', l: 'Lime' }], mix: true },
  { name: 'Espresso Martini', g: 'martini', steps: [{ t: 's', id: 'vodka', l: 'Vodka' }, { t: 's', id: 'kahlua', l: 'Kahlúa' }, { t: 's', id: 'baileys', l: 'Baileys' }, { t: 'ice', l: 'Ice' }], mix: true },
  { name: 'Sidecar',          g: 'martini', steps: [{ t: 's', id: 'vsop', l: 'VSOP' }, { t: 's', id: 'cointreau', l: 'Cointreau' }, { t: 's', id: 'lemon', l: 'Lemon' }], mix: true },
  { name: 'Pina Colada',      g: 'tall',    steps: [{ t: 's', id: 'light_rum', l: 'Light Rum' }, { t: 's', id: 'coconut', l: 'Coconut' }, { t: 's', id: 'pineapple', l: 'Pineapple' }, { t: 'ice', l: 'Ice' }], mix: true },
  { name: 'Manhattan',        g: 'martini', steps: [{ t: 's', id: 'rye', l: 'Rye' }, { t: 's', id: 'vermouth', l: 'Vermouth' }, { t: 's', id: 'bitters', l: 'Bitters' }], mix: true },
];

// Character palette
const SKINS  = ['#f4c089', '#c68642', '#8d5524', '#fdd9b5', '#e8b080', '#a0522d', '#6b3a2a'];
const HAIRS  = ['#1a0a0a', '#3a1a0a', '#8B4513', '#FFD700', '#8B0000', '#2a1a1a', '#DEB887', '#c0c0c0'];
const CLOTHS = ['#e84393', '#3498db', '#2ecc71', '#e67e22', '#9b59b6', '#1abc9c', '#e74c3c', '#f39c12', '#34495e', '#16a085'];
const CNAMES = ['Earl', 'Sal', 'Mick', 'Donna', 'Ray', 'Lupe', 'Hank', 'Tina', 'Bo', 'Wanda', 'Clem', 'Rita', 'Gus', 'Faye', 'Rusty', 'June', 'Dale', 'Bev'];
