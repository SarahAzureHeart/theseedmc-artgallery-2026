const maparts = [

  // ==========================
  // ===== Template ====
  // ==========================
  {
    image: "images/REPLACEME.png",
    title: "REPLACEME",
    artist: "REPLACEME",
    warp: "/warp REPLACEME",
    size: "1x1",
    dateAdded: "2025-12-29",
    categories: ["Server", "Utility"],
    transparent: false
  },
// ==========================
// ===== Artist Name ========
// ==========================
];

// ==========================
// DOM
const gallery = document.getElementById("gallery");
const searchInput = document.getElementById("search");
const sizeFilter = document.getElementById("sizeFilter");
const artistFilter = document.getElementById("artistFilter");
const warpFilter = document.getElementById("warpFilter");
const sortSelect = document.getElementById("sort");
const bgFilter = document.getElementById("bgFilter");
const resetBtn = document.getElementById("reset");
const categoryFilters = document.getElementById("categoryFilters");
const mapartCount = document.getElementById("mapartCount");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");

// ===== NEW BADGE =====
function markNewMaparts() {
  const today = new Date();
  maparts.forEach(a => {
    if (!a.dateAdded) return;
    const diff = (today - new Date(a.dateAdded)) / (1000 * 60 * 60 * 24);
    a.newest = diff <= 7;
  });
}
  
// ===== FILTER SETUP =====
function populateFilters() {
  const artists = [...new Set(maparts.map(a => a.artist))];
  const warps = [...new Set(maparts.map(a => a.warp))];
  const categories = [...new Set(maparts.flatMap(a => a.categories || []))].sort();

  artists.forEach(a => {
    const opt = document.createElement("option");
    opt.value = a;
    opt.textContent = a;
    artistFilter.appendChild(opt);
  });

  warps.forEach(w => {
    const opt = document.createElement("option");
    opt.value = w;
    opt.textContent = w;
    warpFilter.appendChild(opt);
  });

  // ===== CHIPS =====
  categories.forEach(c => {
    const chip = document.createElement("div");
    chip.className = "chip";
    chip.textContent = c;

    chip.onclick = () => {
      chip.classList.toggle("active");
      filterGallery();
    };

    categoryFilters.appendChild(chip);
  });
}

// ===== RENDER =====
function renderGallery(list) {
  gallery.innerHTML = "";

  if (!list.length) {
    gallery.innerHTML = "<p>No mapart found.</p>";
  }

  list.forEach(art => {

    const card = document.createElement("div");
    card.className = "card";

    const status = art.status || "active";

    card.innerHTML = `
      <img src="${art.image}">
      <div class="card-content">
        <h3>${art.title}</h3>
        <p><strong>Artist:</strong> ${art.artist}</p>
        <p>
          <strong>Warp:</strong> 
          <code>${art.warp}</code>
          ${status === "expired" ? "<span style='color:red;'> (expired)</span>" : ""}
        </p>
        <p><strong>Size:</strong> ${art.size}</p>
        <p><strong>Category:</strong> ${(art.categories || []).join(", ")}</p>
      </div>
    `;

    // Lightbox
    card.querySelector("img").onclick = () => {
      lightboxImg.src = art.image;
      lightbox.classList.add("show");
    };

    // Expired badge
    if (status === "expired") {
      const badge = document.createElement("div");
      badge.className = "badge";
      badge.textContent = "Expired";
      badge.style.background = "#ff4d4d";
      card.appendChild(badge);
    }

    // New badge
    if (art.newest) {
      const badge = document.createElement("div");
      badge.className = "badge";
      badge.textContent = "New!";
      card.appendChild(badge);
    }

    gallery.appendChild(card);
  });

  mapartCount.textContent = `Showing ${list.length} of ${maparts.length} maparts`;
}

// ===== FILTER =====
function filterGallery() {
  const s = searchInput.value.toLowerCase();
  const size = sizeFilter.value;
  const artist = artistFilter.value;
  const warp = warpFilter.value;
  const sort = sortSelect.value;
  const bg = bgFilter.value;

  const selectedCategories = [...document.querySelectorAll(".chip.active")]
    .map(c => c.textContent);

  let filtered = maparts.filter(a =>
    (a.title.toLowerCase().includes(s) ||
     a.artist.toLowerCase().includes(s) ||
     a.warp.toLowerCase().includes(s)) &&
    (!size || a.size === size) &&
    (!artist || a.artist === artist) &&
    (!warp || a.warp === warp) &&
    (
      selectedCategories.length === 0 ||
      selectedCategories.some(cat => (a.categories || []).includes(cat))
    ) &&
    (
      !bg ||
      (bg === "transparent" && a.transparent) ||
      (bg === "solid" && !a.transparent)
    )
  );

  if (sort === "az") filtered.sort((a,b)=>a.title.localeCompare(b.title));
  if (sort === "size") filtered.sort((a,b)=>a.size.localeCompare(b.size));
  if (sort === "newest") filtered.reverse();

  renderGallery(filtered);
}

// ===== RESET =====
resetBtn.onclick = () => {
  document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
  searchInput.value = "";
  sizeFilter.value = "";
  artistFilter.value = "";
  warpFilter.value = "";
  sortSelect.value = "";
  bgFilter.value = "";
  renderGallery(maparts);
};

// ===== EVENTS =====
searchInput.oninput = filterGallery;
sizeFilter.onchange = filterGallery;
artistFilter.onchange = filterGallery;
warpFilter.onchange = filterGallery;
sortSelect.onchange = filterGallery;
bgFilter.onchange = filterGallery;

// ===== INIT =====
markNewMaparts();
populateFilters();
renderGallery(maparts);

// ===== LIGHTBOX =====
lightbox.onclick = () => lightbox.classList.remove("show");
