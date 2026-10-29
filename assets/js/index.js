const CONFIG = {
  NASA_API_KEYS: [
    'DEMO_KEY',
    'TN9s1xPWPKgJMlSPL285Jhw0pTO1wH8E6rzzvH0E',
    'YXoE0mwU7mHNdsdDvwlpJcEKV8fPHZoFk0ZYkcHe'
  ],
  NASA_APOD_URL: 'https://api.nasa.gov/planetary/apod',
  LAUNCHES_URL: 'https://ll.thespacedevs.com/2.3.0/launches/upcoming/?limit=10',
  PLANETS_URL: 'https://solar-system-opendata-proxy.vercel.app/api/planets',
  DEFAULT_PLACEHOLDER_IMAGE: './assets/images/placeholder.webp',
  LAUNCH_PLACEHOLDER_IMAGE: './assets/images/launch-placeholder.png',
  REQUEST_TIMEOUT_MS: 8000
};

const state = {
  activeSection: 'today-in-space',
  cachedLaunches: null,
  cachedPlanets: null,
  selectedPlanetId: 'earth',
  favorites: new Set(),
  reminders: new Set(),
  currentApod: null
};

window.cosmosState = state;

const PLANETS_DATA = [
  {
    id: 'mercury',
    englishName: 'Mercury',
    color: '#eab308',
    image: './assets/images/mercury.png',
    distanceAU: 0.39,
    semimajorAxis: 57909050,
    perihelion: 46001200,
    aphelion: 69816900,
    eccentricity: 0.2056,
    inclination: 7.0,
    meanRadius: 2439.7,
    mass: { massValue: 3.3011, massExponent: 23 },
    vol: { volValue: 6.083, volExponent: 10 },
    density: 5.427,
    gravity: 3.7,
    escape: 4250,
    sideralOrbit: 87.97,
    sideralRotation: 1407.6,
    moons: [],
    discoveredBy: 'Known since antiquity',
    discoveryDate: 'Ancient',
    bodyType: 'Terrestrial Planet',
    type: 'Terrestrial',
    avgTemp: 440,
    axialTilt: 0.034,
    description:
      'Mercury is the smallest planet in the Solar System and the closest to the Sun. Its orbit around the Sun takes 87.97 Earth days, the shortest of all the Sun’s planets.',
    facts: [
      'Smallest planet in the solar system, only slightly larger than Earth’s Moon.',
      'Experiences extreme temperature fluctuations ranging from -180°C to 430°C.',
      'Has virtually no atmosphere, resulting in a heavily cratered surface.',
      'A single solar day on Mercury lasts approximately 176 Earth days.'
    ]
  },
  {
    id: 'venus',
    englishName: 'Venus',
    color: '#f97316',
    image: './assets/images/venus.png',
    distanceAU: 0.72,
    semimajorAxis: 108208000,
    perihelion: 107477000,
    aphelion: 108939000,
    eccentricity: 0.0067,
    inclination: 3.39,
    meanRadius: 6051.8,
    mass: { massValue: 4.8675, massExponent: 24 },
    vol: { volValue: 9.2843, volExponent: 11 },
    density: 5.243,
    gravity: 8.87,
    escape: 10360,
    sideralOrbit: 224.7,
    sideralRotation: -5832.5,
    moons: [],
    discoveredBy: 'Known since antiquity',
    discoveryDate: 'Ancient',
    bodyType: 'Terrestrial Planet',
    type: 'Terrestrial',
    avgTemp: 737,
    axialTilt: 177.36,
    description:
      'Venus is the second planet from the Sun and Earth’s closest planetary neighbor. It has a thick, toxic atmosphere filled with carbon dioxide and yellowish clouds of sulfuric acid.',
    facts: [
      'Hottest planet in the solar system with a runaway greenhouse effect.',
      'Rotates in retrograde (clockwise), meaning the Sun rises in the west and sets in the east.',
      'Surface atmospheric pressure is over 90 times greater than Earth’s.',
      'Named after the Roman goddess of love and beauty.'
    ]
  },
  {
    id: 'earth',
    englishName: 'Earth',
    color: '#3b82f6',
    image: './assets/images/earth.png',
    distanceAU: 1.0,
    semimajorAxis: 149598023,
    perihelion: 147095000,
    aphelion: 152100000,
    eccentricity: 0.0167,
    inclination: 0.0,
    meanRadius: 6371.0,
    mass: { massValue: 5.9724, massExponent: 24 },
    vol: { volValue: 1.0832, volExponent: 12 },
    density: 5.514,
    gravity: 9.807,
    escape: 11190,
    sideralOrbit: 365.256,
    sideralRotation: 23.934,
    moons: [{ moon: 'Moon' }],
    discoveredBy: 'Known since antiquity',
    discoveryDate: 'Ancient',
    bodyType: 'Terrestrial Planet',
    type: 'Terrestrial',
    avgTemp: 288,
    axialTilt: 23.44,
    description:
      "Earth is the third planet from the Sun and the only astronomical object known to harbor life. About 29% of Earth's surface is land consisting of continents and islands. The remaining 71% is covered with water, mostly by oceans, seas, gulfs, and other salt-water bodies, but also by lakes, rivers, and other fresh water, which together constitute the hydrosphere.",
    facts: [
      'Only known planet with active plate tectonics and liquid surface water.',
      'Atmosphere contains 78% nitrogen, 21% oxygen, and 1% trace gases.',
      'Magnetic field protects life from ionizing solar winds.',
      'Formed approximately 4.54 billion years ago.'
    ]
  },
  {
    id: 'mars',
    englishName: 'Mars',
    color: '#ef4444',
    image: './assets/images/mars.png',
    distanceAU: 1.52,
    semimajorAxis: 227939200,
    perihelion: 206669000,
    aphelion: 249209300,
    eccentricity: 0.0934,
    inclination: 1.85,
    meanRadius: 3389.5,
    mass: { massValue: 6.4171, massExponent: 23 },
    vol: { volValue: 1.6318, volExponent: 11 },
    density: 3.934,
    gravity: 3.72,
    escape: 5030,
    sideralOrbit: 686.98,
    sideralRotation: 24.623,
    moons: [{ moon: 'Phobos' }, { moon: 'Deimos' }],
    discoveredBy: 'Known since antiquity',
    discoveryDate: 'Ancient',
    bodyType: 'Terrestrial Planet',
    type: 'Terrestrial',
    avgTemp: 210,
    axialTilt: 25.19,
    description:
      'Mars is the fourth planet from the Sun and the second-smallest planet in the Solar System. Known as the Red Planet due to iron oxide prevalent on its surface.',
    facts: [
      'Home to Olympus Mons, the largest volcano and mountain in the solar system.',
      'Possesses Valles Marineris, a canyon system 10 times longer than the Grand Canyon.',
      'Thin atmosphere composed primarily of 95% carbon dioxide.',
      'Has two small, irregular moons: Phobos and Deimos.'
    ]
  },
  {
    id: 'jupiter',
    englishName: 'Jupiter',
    color: '#fb923c',
    image: './assets/images/jupiter.png',
    distanceAU: 5.2,
    semimajorAxis: 778570000,
    perihelion: 740520000,
    aphelion: 816620000,
    eccentricity: 0.0489,
    inclination: 1.3,
    meanRadius: 69911,
    mass: { massValue: 1.8982, massExponent: 27 },
    vol: { volValue: 1.4313, volExponent: 15 },
    density: 1.326,
    gravity: 24.79,
    escape: 59500,
    sideralOrbit: 4332.59,
    sideralRotation: 9.925,
    moons: new Array(95).fill({}),
    discoveredBy: 'Known since antiquity',
    discoveryDate: 'Ancient',
    bodyType: 'Gas Giant',
    type: 'Gas Giant',
    avgTemp: 165,
    axialTilt: 3.13,
    description:
      'Jupiter is the fifth planet from the Sun and the largest in the Solar System. It is a gas giant with a mass more than two and a half times that of all the other planets combined.',
    facts: [
      'More than 1,300 Earths could fit inside Jupiter’s massive volume.',
      'Famous Great Red Spot is a persistent anticyclonic storm larger than Earth.',
      'Shortest day of any planet, completing a full rotation in under 10 hours.',
      'Possesses a strong magnetic field and at least 95 recognized moons.'
    ]
  },
  {
    id: 'saturn',
    englishName: 'Saturn',
    color: '#facc15',
    image: './assets/images/saturn.png',
    distanceAU: 9.58,
    semimajorAxis: 1433530000,
    perihelion: 1352550000,
    aphelion: 1514500000,
    eccentricity: 0.0565,
    inclination: 2.49,
    meanRadius: 58232,
    mass: { massValue: 5.6834, massExponent: 26 },
    vol: { volValue: 8.2713, volExponent: 14 },
    density: 0.687,
    gravity: 10.44,
    escape: 35500,
    sideralOrbit: 10759.22,
    sideralRotation: 10.656,
    moons: new Array(146).fill({}),
    discoveredBy: 'Known since antiquity',
    discoveryDate: 'Ancient',
    bodyType: 'Gas Giant',
    type: 'Gas Giant',
    avgTemp: 134,
    axialTilt: 26.73,
    description:
      'Saturn is the sixth planet from the Sun and the second-largest in the Solar System. It is best known for its prominent, spectacular ring system consisting mostly of water ice particles.',
    facts: [
      'The least dense planet in the solar system; it would float in a giant bathtub of water.',
      'Rings span up to 282,000 km across but are typically only about 10 meters thick.',
      'Hosts Titan, a moon with a dense atmosphere and liquid methane lakes.',
      'Has 146 officially confirmed moons, the highest count in the solar system.'
    ]
  },
  {
    id: 'uranus',
    englishName: 'Uranus',
    color: '#06b6d4',
    image: './assets/images/uranus.png',
    distanceAU: 19.22,
    semimajorAxis: 2872460000,
    perihelion: 2741300000,
    aphelion: 3003620000,
    eccentricity: 0.0463,
    inclination: 0.77,
    meanRadius: 25362,
    mass: { massValue: 8.681, massExponent: 25 },
    vol: { volValue: 6.833, volExponent: 13 },
    density: 1.27,
    gravity: 8.69,
    escape: 21300,
    sideralOrbit: 30685.4,
    sideralRotation: -17.24,
    moons: new Array(28).fill({}),
    discoveredBy: 'William Herschel',
    discoveryDate: '1781-03-13',
    bodyType: 'Ice Giant',
    type: 'Ice Giant',
    avgTemp: 76,
    axialTilt: 97.77,
    description:
      'Uranus is the seventh planet from the Sun. It has the third-largest planetary radius and fourth-largest planetary mass in the Solar System. It is an ice giant with an extreme axial tilt.',
    facts: [
      'Rotates on its side with an axial tilt of 97.8 degrees, causing 42-year seasons.',
      'Coldest atmosphere of any planet, dropping to as low as -224°C.',
      'First planet discovered with the use of an astronomical telescope in modern history.',
      'Atmosphere has methane clouds which give the planet its distinct cyan blue color.'
    ]
  },
  {
    id: 'neptune',
    englishName: 'Neptune',
    color: '#2563eb',
    image: './assets/images/neptune.png',
    distanceAU: 30.05,
    semimajorAxis: 4495060000,
    perihelion: 4444450000,
    aphelion: 4545670000,
    eccentricity: 0.0095,
    inclination: 1.77,
    meanRadius: 24622,
    mass: { massValue: 1.02413, massExponent: 26 },
    vol: { volValue: 6.254, volExponent: 13 },
    density: 1.638,
    gravity: 11.15,
    escape: 23500,
    sideralOrbit: 60189.0,
    sideralRotation: 16.11,
    moons: new Array(16).fill({}),
    discoveredBy: 'Urbain Le Verrier & J. Galle',
    discoveryDate: '1846-09-23',
    bodyType: 'Ice Giant',
    type: 'Ice Giant',
    avgTemp: 72,
    axialTilt: 28.32,
    description:
      'Neptune is the eighth and farthest-known Solar planet from the Sun. It is the fourth-largest planet in the Solar System by diameter, the third-most-massive planet, and the densest giant planet.',
    facts: [
      'Possesses the most supersonic, violent winds in the solar system, reaching over 2,100 km/h.',
      'Only planet located via mathematical prediction rather than empirical observation.',
      'Its largest moon, Triton, orbits backward in a retrograde orbit.',
      'Takes almost 165 Earth years to complete a single revolution around the Sun.'
    ]
  }
];

const planetsMap = new Map();
PLANETS_DATA.forEach(p => planetsMap.set(p.id, p));

function formatNumber(num, maxDigits = 2) {
  if (num === null || num === undefined || isNaN(num)) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: maxDigits
  }).format(num);
}

function formatScientific(val, exp) {
  if (val === null || val === undefined || isNaN(val)) return 'N/A';
  return `${formatNumber(val, 2)} × 10<sup>${exp}</sup>`;
}

function formatDateLong(dateObj) {
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) return 'Unknown Date';
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(dateObj);
}

function formatDateShort(dateObj) {
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) return 'Unknown Date';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(dateObj);
}

function formatTimeUTC(dateObj) {
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) return 'TBD';
  return (
    new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'UTC'
    }).format(dateObj) + ' UTC'
  );
}

function calculateCountdown(dateString) {
  if (!dateString) {
    return { value: 'TBD', label: 'Date Pending' };
  }
  const target = new Date(dateString);
  if (isNaN(target.getTime())) {
    return { value: 'TBD', label: 'Date Pending' };
  }
  const now = new Date();
  const diffMs = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays > 1) {
    return { value: diffDays.toString(), label: 'Days Until Launch' };
  } else if (diffDays === 1) {
    return { value: '1', label: 'Day Until Launch' };
  } else if (diffDays === 0) {
    return { value: 'Today', label: 'Launch Scheduled Today' };
  } else {
    return { value: 'Launched', label: 'Past Mission' };
  }
}

async function fetchWithTimeout(url, options = {}, timeoutMs = CONFIG.REQUEST_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timer);
    return response;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.app-section');

  navLinks.forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      const targetSection = link.getAttribute('data-section');
      if (!targetSection) return;

      
      navLinks.forEach(item => {
        item.classList.remove('bg-blue-500/10', 'text-blue-400');
        item.classList.add('text-slate-300', 'hover:bg-slate-800');
      });
      link.classList.add('bg-blue-500/10', 'text-blue-400');
      link.classList.remove('text-slate-300', 'hover:bg-slate-800');

      
      sections.forEach(section => {
        if (section.getAttribute('data-section') === targetSection || section.id === targetSection) {
          section.classList.remove('hidden');
        } else {
          section.classList.add('hidden');
        }
      });

      state.activeSection = targetSection;

      
      if (targetSection === 'launches' && !state.cachedLaunches) {
        fetchUpcomingLaunches();
      } else if (targetSection === 'planets' && !state.cachedPlanets) {
        fetchPlanetsData();
      }

      closeMobileSidebar();
    });
  });
}

function initSidebarToggle() {
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  if (!sidebar || !sidebarToggle) return;

  sidebarToggle.addEventListener('click', () => {
    const isOpen = sidebar.classList.toggle('sidebar-open');
    if (isOpen) {
      createSidebarOverlay();
    } else {
      removeSidebarOverlay();
    }
  });
}

function createSidebarOverlay() {
  if (document.querySelector('.sidebar-overlay')) return;
  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  overlay.addEventListener('click', closeMobileSidebar);
  document.body.appendChild(overlay);
}

function removeSidebarOverlay() {
  const overlay = document.querySelector('.sidebar-overlay');
  if (overlay) overlay.remove();
}

function closeMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.classList.remove('sidebar-open');
  removeSidebarOverlay();
}

function initApodModule() {
  const dateInput = document.getElementById('apod-date-input');
  const dateLabel = document.getElementById('apod-date-label');
  const loadDateBtn = document.getElementById('load-date-btn');
  const todayApodBtn = document.getElementById('today-apod-btn');
  const fullResBtn = document.getElementById('apod-full-res-btn');

  const today = new Date();
  const todayISO = today.toISOString().split('T')[0];

  if (dateInput) {
    dateInput.max = todayISO;
    dateInput.min = '1995-06-16';
    dateInput.value = todayISO;

    const formattedToday = formatDateShort(today);
    if (dateLabel) dateLabel.textContent = formattedToday;

    const wrapper = dateInput.closest('.date-input-wrapper');
    if (wrapper) wrapper.setAttribute('data-date', formattedToday);

    const onDateChange = () => syncDateInputDisplay(dateInput.value);
    dateInput.addEventListener('input', onDateChange);
    dateInput.addEventListener('change', onDateChange);
  }

  if (loadDateBtn && dateInput) {
    loadDateBtn.addEventListener('click', () => {
      const selected = dateInput.value;
      if (selected) {
        fetchApod(selected);
      }
    });
  }

  if (todayApodBtn && dateInput) {
    todayApodBtn.addEventListener('click', () => {
      dateInput.value = todayISO;
      syncDateInputDisplay(todayISO);
      fetchApod('');
    });
  }

  if (fullResBtn) {
    fullResBtn.addEventListener('click', () => {
      if (state.currentApod && (state.currentApod.hdurl || state.currentApod.url)) {
        window.open(state.currentApod.hdurl || state.currentApod.url, '_blank');
      }
    });
  }

  
  fetchApod('');
}

function syncDateInputDisplay(isoString) {
  if (!isoString) return;
  const parts = isoString.split('-');
  if (parts.length === 3) {
    const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    const formatted = formatDateShort(d);
    const dateLabel = document.getElementById('apod-date-label');
    if (dateLabel) dateLabel.textContent = formatted;
    const wrapper = document.querySelector('.date-input-wrapper');
    if (wrapper) wrapper.setAttribute('data-date', formatted);
  }
}

async function fetchApod(customDate = '') {
  const loadingEl = document.getElementById('apod-loading');
  const apodImg = document.getElementById('apod-image');
  const container = document.getElementById('apod-image-container');
  const titleEl = document.getElementById('apod-title');
  const dateHeaderEl = document.getElementById('apod-date');
  const dateDetailEl = document.getElementById('apod-date-detail');
  const explanationEl = document.getElementById('apod-explanation');
  const copyrightEl = document.getElementById('apod-copyright');
  const dateInfoEl = document.getElementById('apod-date-info');
  const mediaTypeEl = document.getElementById('apod-media-type');

  
  if (loadingEl) loadingEl.classList.remove('hidden');
  if (apodImg) apodImg.classList.add('hidden');
  const existingVideo = document.getElementById('apod-video-frame');
  if (existingVideo) existingVideo.classList.add('hidden');

  let data = null;
  let lastError = null;

  for (let i = 0; i < CONFIG.NASA_API_KEYS.length; i++) {
    const apiKey = CONFIG.NASA_API_KEYS[i];
    const url = `${CONFIG.NASA_APOD_URL}?api_key=${apiKey}${customDate ? `&date=${customDate}` : ''}`;
    try {
      const res = await fetchWithTimeout(url, {}, 6000);
      if (res.ok) {
        data = await res.json();
        break;
      } else {
        lastError = new Error(`NASA API HTTP ${res.status}`);
      }
    } catch (err) {
      lastError = err;
    }
  }

  
  if (!data && !customDate) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    try {
      const fallbackUrl = `${CONFIG.NASA_APOD_URL}?api_key=DEMO_KEY&date=${yesterday}`;
      const res = await fetchWithTimeout(fallbackUrl, {}, 6000);
      if (res.ok) {
        data = await res.json();
      }
    } catch (e) {
      
    }
  }

  if (loadingEl) loadingEl.classList.add('hidden');

  if (data && data.url) {
    state.currentApod = data;

    const parsedDate = new Date(data.date || customDate || Date.now());
    const displayLongDate = formatDateLong(parsedDate);

    if (dateHeaderEl) {
      dateHeaderEl.textContent = `Astronomy Picture of the Day - ${displayLongDate}`;
    }
    if (titleEl) {
      titleEl.textContent = data.title || 'Astronomy Picture of the Day';
    }
    if (dateDetailEl) {
      dateDetailEl.innerHTML = `<i class="far fa-calendar mr-2"></i>${data.date || displayLongDate}`;
    }
    if (explanationEl) {
      explanationEl.textContent = data.explanation || 'No description provided by NASA.';
    }
    if (copyrightEl) {
      copyrightEl.textContent = data.copyright ? `© ${data.copyright}` : '© Public Domain / NASA';
    }
    if (dateInfoEl) {
      dateInfoEl.textContent = data.date || displayLongDate;
    }
    if (mediaTypeEl) {
      const typeStr = (data.media_type || 'image').charAt(0).toUpperCase() + (data.media_type || 'image').slice(1);
      mediaTypeEl.textContent = typeStr;
    }

    if (data.media_type === 'video') {
      if (apodImg) apodImg.classList.add('hidden');
      let videoFrame = document.getElementById('apod-video-frame');
      if (!videoFrame && container) {
        videoFrame = document.createElement('iframe');
        videoFrame.id = 'apod-video-frame';
        videoFrame.className = 'w-full h-full object-cover rounded-2xl';
        videoFrame.setAttribute('allowfullscreen', 'true');
        videoFrame.setAttribute('loading', 'lazy');
        container.insertBefore(videoFrame, container.firstChild);
      }
      if (videoFrame) {
        videoFrame.src = data.url;
        videoFrame.classList.remove('hidden');
      }
    } else {
      if (existingVideo) existingVideo.classList.add('hidden');
      if (apodImg) {
        apodImg.src = data.url;
        apodImg.alt = data.title || 'Astronomy Picture of the Day';
        apodImg.classList.remove('hidden');
      }
    }
  } else {
    console.warn('APOD fetch notice:', lastError);
    if (titleEl) titleEl.textContent = 'Astronomy Picture of the Day';
    if (explanationEl) {
      explanationEl.textContent =
        'Unable to load the space image for this date. The NASA APOD service may be temporarily unavailable or rate-limited. Please choose another date or try again shortly.';
    }
    if (apodImg) {
      apodImg.src = CONFIG.DEFAULT_PLACEHOLDER_IMAGE;
      apodImg.classList.remove('hidden');
    }
  }
}

async function fetchUpcomingLaunches() {
  if (state.cachedLaunches) {
    renderLaunches(state.cachedLaunches);
    return;
  }

  try {
    const res = await fetchWithTimeout(CONFIG.LAUNCHES_URL, {}, 8000);
    if (!res.ok) {
      throw new Error(`SpaceDevs API HTTP ${res.status}`);
    }
    const data = await res.json();
    if (data && data.results && data.results.length > 0) {
      state.cachedLaunches = data.results;
      renderLaunches(data.results);
      updateLaunchesCount(data.results.length);
    } else {
      throw new Error('No launch results found');
    }
  } catch (err) {
    console.warn('Launches API Notice (maintaining current launch list):', err.message);
    wireExistingStaticLaunches();
  }
}

function updateLaunchesCount(count) {
  const countEl = document.getElementById('launches-count');
  const countMobileEl = document.getElementById('launches-count-mobile');
  if (countEl) countEl.textContent = `${count} Launches`;
  if (countMobileEl) countMobileEl.textContent = `${count}`;
}

function getStatusBadgeStyle(status) {
  const name = (status?.name || status?.abbrev || 'TBD').toUpperCase();
  if (name.includes('GO') || name === 'SUCCESS') {
    return { bg: 'bg-green-500/20 text-green-400', cardBg: 'bg-green-500/90' };
  } else if (name.includes('TBC') || name.includes('HOLD')) {
    return { bg: 'bg-yellow-500/20 text-yellow-400', cardBg: 'bg-yellow-500/90' };
  } else if (name.includes('FAILURE') || name.includes('FAIL')) {
    return { bg: 'bg-red-500/20 text-red-400', cardBg: 'bg-red-500/90' };
  } else {
    return { bg: 'bg-blue-500/20 text-blue-400', cardBg: 'bg-blue-500/90' };
  }
}

function getLaunchImageUrl(launch) {
  if (launch.image && typeof launch.image === 'object') {
    return launch.image.image_url || launch.image.thumbnail_url || CONFIG.LAUNCH_PLACEHOLDER_IMAGE;
  } else if (typeof launch.image === 'string' && launch.image.startsWith('http')) {
    return launch.image;
  }
  return CONFIG.LAUNCH_PLACEHOLDER_IMAGE;
}

function renderLaunches(launchesList) {
  if (!launchesList || launchesList.length === 0) return;

  const featured = launchesList[0];
  const remaining = launchesList.slice(1);

  renderFeaturedLaunch(featured);
  renderLaunchesGrid(remaining);
}

function renderFeaturedLaunch(launch) {
  const featuredContainer = document.getElementById('featured-launch');
  if (!featuredContainer || !launch) return;

  const statusBadge = getStatusBadgeStyle(launch.status);
  const statusAbbrev = launch.status?.abbrev || launch.status?.name || 'Go';
  const countdown = calculateCountdown(launch.net);
  const dateObj = launch.net ? new Date(launch.net) : null;
  const dateStr = dateObj ? formatDateLong(dateObj) : 'TBD';
  const timeStr = dateObj ? formatTimeUTC(dateObj) : 'TBD';
  const provider = launch.launch_service_provider?.name || 'Space Exploration Agency';
  const rocket = launch.rocket?.configuration?.full_name || launch.rocket?.configuration?.name || 'Launch Vehicle';
  const location = launch.pad?.location?.name || launch.pad?.name || 'Orbital Spaceport';
  const country = launch.pad?.country?.name || launch.pad?.location?.country?.name || 'International';
  const description =
    launch.mission?.description ||
    launch.description ||
    'Upcoming commercial/scientific orbital mission delivering payload to space.';
  const imgUrl = getLaunchImageUrl(launch);
  const isFav = state.favorites.has(launch.id);
  const isBell = state.reminders.has(launch.id);

  featuredContainer.innerHTML = `
    <div class="relative bg-slate-800/30 border border-slate-700 rounded-3xl overflow-hidden group hover:border-blue-500/50 transition-all">
      <div class="absolute inset-0 bg-linear-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div class="relative grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">
        <div class="flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-3 mb-4">
              <span class="px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold flex items-center gap-2">
                <i class="fas fa-star"></i>
                Featured Launch
              </span>
              <span class="px-4 py-1.5 ${statusBadge.bg} rounded-full text-sm font-semibold">
                ${statusAbbrev}
              </span>
            </div>
            <h3 class="text-3xl font-bold mb-3 leading-tight">
              ${escapeHtml(launch.name)}
            </h3>
            <div class="flex flex-col xl:flex-row xl:items-center gap-4 mb-6 text-slate-400">
              <div class="flex items-center gap-2">
                <i class="fas fa-building"></i>
                <span>${escapeHtml(provider)}</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="fas fa-rocket"></i>
                <span>${escapeHtml(rocket)}</span>
              </div>
            </div>
            <div class="inline-flex items-center gap-3 px-6 py-3 bg-linear-to-r from-blue-500/20 to-purple-500/20 rounded-xl mb-6">
              <i class="fas fa-clock text-2xl text-blue-400"></i>
              <div>
                <p id="featured-countdown-val" class="text-2xl font-bold text-blue-400">${countdown.value}</p>
                <p id="featured-countdown-lbl" class="text-xs text-slate-400">${countdown.label}</p>
              </div>
            </div>
            <div class="grid xl:grid-cols-2 gap-4 mb-6">
              <div class="bg-slate-900/50 rounded-xl p-4">
                <p class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                  <i class="fas fa-calendar"></i>
                  Launch Date
                </p>
                <p class="font-semibold">${dateStr}</p>
              </div>
              <div class="bg-slate-900/50 rounded-xl p-4">
                <p class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                  <i class="fas fa-clock"></i>
                  Launch Time
                </p>
                <p class="font-semibold">${timeStr}</p>
              </div>
              <div class="bg-slate-900/50 rounded-xl p-4">
                <p class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                  <i class="fas fa-map-marker-alt"></i>
                  Location
                </p>
                <p class="font-semibold text-sm line-clamp-1">${escapeHtml(location)}</p>
              </div>
              <div class="bg-slate-900/50 rounded-xl p-4">
                <p class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                  <i class="fas fa-globe"></i>
                  Country
                </p>
                <p class="font-semibold">${escapeHtml(country)}</p>
              </div>
            </div>
            <p class="text-slate-300 leading-relaxed mb-6">
              ${escapeHtml(description)}
            </p>
          </div>
          <div class="flex flex-col md:flex-row gap-3">
            <button id="featured-details-btn" class="flex-1 self-start md:self-center px-6 py-3 bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors font-semibold flex items-center justify-center gap-2">
              <i class="fas fa-info-circle"></i>
              View Full Details
            </button>
            <div class="icons self-end md:self-center flex gap-2">
              <button id="featured-fav-btn" class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors" title="Favorite">
                <i class="${isFav ? 'fas text-red-500' : 'far'} fa-heart"></i>
              </button>
              <button id="featured-bell-btn" class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors" title="Reminder">
                <i class="${isBell ? 'fas text-yellow-400' : 'far'} fa-bell"></i>
              </button>
            </div>
          </div>
        </div>
        <div class="relative">
          <div class="relative h-full min-h-[400px] rounded-2xl overflow-hidden bg-slate-900/50 flex items-center justify-center">
            <img src="${imgUrl}" alt="${escapeHtml(launch.name)}" class="w-full h-full object-cover" onerror="this.onerror=null;this.src='${CONFIG.LAUNCH_PLACEHOLDER_IMAGE}';" />
            <div class="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  `;

  const favBtn = document.getElementById('featured-fav-btn');
  if (favBtn) {
    favBtn.addEventListener('click', () => {
      const icon = favBtn.querySelector('i');
      if (state.favorites.has(launch.id)) {
        state.favorites.delete(launch.id);
        icon.className = 'far fa-heart';
      } else {
        state.favorites.add(launch.id);
        icon.className = 'fas fa-heart text-red-500';
      }
    });
  }

  const bellBtn = document.getElementById('featured-bell-btn');
  if (bellBtn) {
    bellBtn.addEventListener('click', () => {
      const icon = bellBtn.querySelector('i');
      if (state.reminders.has(launch.id)) {
        state.reminders.delete(launch.id);
        icon.className = 'far fa-bell';
      } else {
        state.reminders.add(launch.id);
        icon.className = 'fas fa-bell text-yellow-400';
      }
    });
  }
}

function renderLaunchesGrid(launches) {
  const grid = document.getElementById('launches-grid');
  if (!grid || !launches) return;

  grid.innerHTML = launches
    .map((launch, index) => {
      const statusBadge = getStatusBadgeStyle(launch.status);
      const statusAbbrev = launch.status?.abbrev || 'Go';
      const dateObj = launch.net ? new Date(launch.net) : null;
      const dateStr = dateObj ? formatDateShort(dateObj) : 'TBD';
      const timeStr = dateObj ? formatTimeUTC(dateObj) : 'TBD';
      const provider = launch.launch_service_provider?.name || 'Space Agency';
      const rocket = launch.rocket?.configuration?.full_name || launch.rocket?.configuration?.name || 'Rocket';
      const location = launch.pad?.location?.name || launch.pad?.name || 'Launch Site';
      const imgUrl = getLaunchImageUrl(launch);
      const isFav = state.favorites.has(launch.id);

      return `
      <div class="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group cursor-pointer flex flex-col justify-between" data-launch-index="${index}">
        <div class="relative h-48 bg-slate-900/50 flex items-center justify-center overflow-hidden">
          <img src="${imgUrl}" alt="${escapeHtml(launch.name)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onerror="this.onerror=null;this.src='${CONFIG.LAUNCH_PLACEHOLDER_IMAGE}';" />
          <div class="absolute top-3 right-3">
            <span class="px-3 py-1 ${statusBadge.cardBg} text-white backdrop-blur-sm rounded-full text-xs font-semibold">
              ${statusAbbrev}
            </span>
          </div>
        </div>
        <div class="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div class="mb-3">
              <h4 class="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                ${escapeHtml(launch.name)}
              </h4>
              <p class="text-sm text-slate-400 flex items-center gap-2">
                <i class="fas fa-building text-xs"></i>
                <span class="line-clamp-1">${escapeHtml(provider)}</span>
              </p>
            </div>
            <div class="space-y-2 mb-4">
              <div class="flex items-center gap-2 text-sm">
                <i class="fas fa-calendar text-slate-500 w-4"></i>
                <span class="text-slate-300">${dateStr}</span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <i class="fas fa-clock text-slate-500 w-4"></i>
                <span class="text-slate-300">${timeStr}</span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <i class="fas fa-rocket text-slate-500 w-4"></i>
                <span class="text-slate-300 line-clamp-1">${escapeHtml(rocket)}</span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <i class="fas fa-map-marker-alt text-slate-500 w-4"></i>
                <span class="text-slate-300 line-clamp-1">${escapeHtml(location)}</span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2 pt-4 border-t border-slate-700">
            <button class="launch-details-btn flex-1 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-sm font-semibold" data-launch-id="${launch.id}">
              Details
            </button>
            <button class="launch-fav-btn px-3 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors" data-launch-id="${launch.id}">
              <i class="${isFav ? 'fas text-red-500' : 'far'} fa-heart"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    })
    .join('');

  grid.querySelectorAll('.launch-fav-btn').forEach((btn, idx) => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const launch = launches[idx];
      if (!launch) return;
      const icon = btn.querySelector('i');
      if (state.favorites.has(launch.id)) {
        state.favorites.delete(launch.id);
        icon.className = 'far fa-heart';
      } else {
        state.favorites.add(launch.id);
        icon.className = 'fas fa-heart text-red-500';
      }
    });
  });
}

function wireExistingStaticLaunches() {
  const heartBtns = document.querySelectorAll('#launches button i.fa-heart');
  heartBtns.forEach(icon => {
    const parentBtn = icon.closest('button');
    if (parentBtn) {
      parentBtn.addEventListener('click', () => {
        icon.classList.toggle('fas');
        icon.classList.toggle('far');
        icon.classList.toggle('text-red-500');
      });
    }
  });
}

async function fetchPlanetsData() {
  try {
    const res = await fetchWithTimeout(CONFIG.PLANETS_URL, {}, 6000);
    if (!res.ok) {
      throw new Error(`Planets API HTTP ${res.status}`);
    }
    const data = await res.json();
    if (data && data.bodies && Array.isArray(data.bodies)) {
      data.bodies.forEach(body => {
        const key = (body.englishName || body.id || '').toLowerCase();
        const existing = planetsMap.get(key);
        if (existing) {
          Object.assign(existing, {
            semimajorAxis: body.semimajorAxis || existing.semimajorAxis,
            perihelion: body.perihelion || existing.perihelion,
            aphelion: body.aphelion || existing.aphelion,
            meanRadius: body.meanRadius || existing.meanRadius,
            eccentricity: body.eccentricity !== undefined ? body.eccentricity : existing.eccentricity,
            inclination: body.inclination !== undefined ? body.inclination : existing.inclination,
            axialTilt: body.axialTilt !== undefined ? body.axialTilt : existing.axialTilt,
            density: body.density || existing.density,
            gravity: body.gravity || existing.gravity,
            escape: body.escape || existing.escape,
            sideralOrbit: body.sideralOrbit || existing.sideralOrbit,
            sideralRotation: body.sideralRotation || existing.sideralRotation,
            avgTemp: body.avgTemp || existing.avgTemp,
            discoveredBy: body.discoveredBy || existing.discoveredBy,
            discoveryDate: body.discoveryDate || existing.discoveryDate,
            description: body.description || existing.description,
            type: body.type || existing.type
          });
          if (body.mass) existing.mass = body.mass;
          if (body.vol) existing.vol = body.vol;
          if (body.moons && Array.isArray(body.moons)) existing.moons = body.moons;
        }
      });
      state.cachedPlanets = true;
    }
  } catch (err) {
    console.warn('Planets API Notice (using embedded comprehensive dataset):', err.message);
  }

  
  selectPlanet(state.selectedPlanetId);
}

function initPlanetsModule() {
  
  const planetCards = document.querySelectorAll('#planets-grid .planet-card');
  planetCards.forEach(card => {
    const planetId = card.getAttribute('data-planet-id');
    card.addEventListener('click', () => {
      if (planetId) {
        selectPlanet(planetId);
      }
    });
  });

  
  const favBtn = document.getElementById('planet-favorite-btn');
  if (favBtn) {
    favBtn.addEventListener('click', () => {
      const icon = favBtn.querySelector('i');
      if (state.favorites.has(state.selectedPlanetId)) {
        state.favorites.delete(state.selectedPlanetId);
        icon.className = 'far fa-heart';
      } else {
        state.favorites.add(state.selectedPlanetId);
        icon.className = 'fas fa-heart text-red-500';
      }
    });
  }

  
  const tableRows = document.querySelectorAll('#planet-comparison-tbody tr');
  tableRows.forEach(row => {
    const planetNameEl = row.querySelector('td:first-child span');
    if (planetNameEl) {
      const name = planetNameEl.textContent.trim().toLowerCase();
      row.style.cursor = 'pointer';
      row.addEventListener('click', () => {
        selectPlanet(name);
      });
    }
  });

  
  selectPlanet('earth');
}

function selectPlanet(planetId) {
  const planet = planetsMap.get(planetId.toLowerCase());
  if (!planet) return;

  state.selectedPlanetId = planet.id;

  
  const planetCards = document.querySelectorAll('#planets-grid .planet-card');
  planetCards.forEach(card => {
    const cardId = card.getAttribute('data-planet-id');
    if (cardId === planet.id) {
      card.style.borderColor = planet.color || '#3b82f6';
      card.classList.add('ring-2', 'ring-blue-500/50');
    } else {
      card.style.borderColor = '#334155';
      card.classList.remove('ring-2', 'ring-blue-500/50');
    }
  });

  
  const imgEl = document.getElementById('planet-detail-image');
  const nameEl = document.getElementById('planet-detail-name');
  const descEl = document.getElementById('planet-detail-description');

  if (imgEl) {
    imgEl.src = planet.image || `./assets/images/${planet.id}.png`;
    imgEl.alt = `${planet.englishName} planet render`;
  }
  if (nameEl) nameEl.textContent = planet.englishName;
  if (descEl) descEl.textContent = planet.description;

  
  const favBtn = document.getElementById('planet-favorite-btn');
  if (favBtn) {
    const icon = favBtn.querySelector('i');
    if (icon) {
      if (state.favorites.has(planet.id)) {
        icon.className = 'fas fa-heart text-red-500';
      } else {
        icon.className = 'far fa-heart';
      }
    }
  }

  
  const distEl = document.getElementById('planet-distance');
  const radiusEl = document.getElementById('planet-radius');
  const massEl = document.getElementById('planet-mass');
  const densityEl = document.getElementById('planet-density');
  const orbitEl = document.getElementById('planet-orbital-period');
  const rotEl = document.getElementById('planet-rotation');
  const moonsEl = document.getElementById('planet-moons');
  const gravityEl = document.getElementById('planet-gravity');

  if (distEl) {
    const distM = planet.semimajorAxis / 1e6;
    distEl.textContent = `${formatNumber(distM, 1)}M km`;
  }
  if (radiusEl) {
    radiusEl.textContent = `${formatNumber(planet.meanRadius, 0)} km`;
  }
  if (massEl) {
    if (planet.mass && planet.mass.massValue) {
      massEl.innerHTML = `${formatScientific(planet.mass.massValue, planet.mass.massExponent)} kg`;
    } else {
      massEl.textContent = 'N/A';
    }
  }
  if (densityEl) {
    densityEl.textContent = `${formatNumber(planet.density, 2)} g/cm³`;
  }
  if (orbitEl) {
    if (planet.sideralOrbit < 730) {
      orbitEl.textContent = `${formatNumber(planet.sideralOrbit, 1)} days`;
    } else {
      const years = planet.sideralOrbit / 365.25;
      orbitEl.textContent = `${formatNumber(years, 1)} years`;
    }
  }
  if (rotEl) {
    rotEl.textContent = `${formatNumber(Math.abs(planet.sideralRotation), 1)} hours`;
  }
  if (moonsEl) {
    const moonCount = planet.moons ? planet.moons.length : 0;
    moonsEl.textContent = `${moonCount}`;
  }
  if (gravityEl) {
    gravityEl.textContent = `${formatNumber(planet.gravity, 1)} m/s²`;
  }

  
  const discByEl = document.getElementById('planet-discoverer');
  const discDateEl = document.getElementById('planet-discovery-date');
  const bodyTypeEl = document.getElementById('planet-body-type');
  const volEl = document.getElementById('planet-volume');

  if (discByEl) discByEl.textContent = planet.discoveredBy || 'Known since antiquity';
  if (discDateEl) discDateEl.textContent = planet.discoveryDate || 'Ancient';
  if (bodyTypeEl) bodyTypeEl.textContent = planet.type || planet.bodyType || 'Planet';
  if (volEl) {
    if (planet.vol && planet.vol.volValue) {
      volEl.innerHTML = `${formatScientific(planet.vol.volValue, planet.vol.volExponent)} km³`;
    } else {
      volEl.textContent = 'N/A';
    }
  }

  
  const factsList = document.getElementById('planet-facts');
  if (factsList && planet.facts && Array.isArray(planet.facts)) {
    factsList.innerHTML = planet.facts
      .map(
        fact => `
      <li class="flex items-start">
        <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
        <span class="text-slate-300">${escapeHtml(fact)}</span>
      </li>
    `
      )
      .join('');
  }

  
  const periEl = document.getElementById('planet-perihelion');
  const aphEl = document.getElementById('planet-aphelion');
  const eccEl = document.getElementById('planet-eccentricity');
  const incEl = document.getElementById('planet-inclination');
  const tiltEl = document.getElementById('planet-axial-tilt');
  const tempEl = document.getElementById('planet-temp');
  const escapeEl = document.getElementById('planet-escape');

  if (periEl) periEl.textContent = `${formatNumber(planet.perihelion / 1e6, 1)}M km`;
  if (aphEl) aphEl.textContent = `${formatNumber(planet.aphelion / 1e6, 1)}M km`;
  if (eccEl) eccEl.textContent = `${formatNumber(planet.eccentricity, 4)}`;
  if (incEl) incEl.textContent = `${formatNumber(planet.inclination, 2)}°`;
  if (tiltEl) tiltEl.textContent = `${formatNumber(planet.axialTilt, 2)}°`;
  if (tempEl) {
    const celsius = Math.round(planet.avgTemp - 273.15);
    tempEl.textContent = `${celsius}°C`;
  }
  if (escapeEl) {
    const escapeKm = planet.escape / 1000;
    escapeEl.textContent = `${formatNumber(escapeKm, 1)} km/s`;
  }

  
  const rows = document.querySelectorAll('#planet-comparison-tbody tr');
  rows.forEach(row => {
    const span = row.querySelector('td:first-child span');
    if (span && span.textContent.trim().toLowerCase() === planet.englishName.toLowerCase()) {
      row.classList.add('bg-blue-500/10');
    } else {
      row.classList.remove('bg-blue-500/10');
    }
  });
}

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function initApp() {
  initNavigation();
  initSidebarToggle();
  initApodModule();
  initPlanetsModule();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
