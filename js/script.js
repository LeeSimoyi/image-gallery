/* ============================================================
   APERTURE GALLERY — SCRIPT
   Palette: royal blue, white, grey, and black (see css/styles.css
   for the shared design tokens referenced below).
   Responsibilities:
   1. Hold the image data (title, category, src, alt)
   2. Render .gallery-item cards into .gallery
   3. Handle category filtering via #filterButtons
   4. Drive the .lightbox modal: open, close, prev/next, keyboard, swipe
   ============================================================ */

(function () {
  "use strict";

  /* ---------- 1. Image data ----------
     Swap these objects for your own photos any time — every other
     part of the app (grid, filters, lightbox) reads from this array. */
  const imageData = [
    {
      title: "Ridge Line at Dawn",
      category: "nature",
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80",
      alt: "Sunlit mountain ridge with layered peaks at dawn",
    },
    {
      title: "Deep Green Canopy",
      category: "nature",
      src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80",
      alt: "Sunlight streaming through a dense forest canopy",
    },
    {
      title: "Still Alpine Water",
      category: "nature",
      src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=900&q=80",
      alt: "Calm alpine lake reflecting surrounding mountains",
    },
    {
      title: "Path Through the Pines",
      category: "nature",
      src: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80",
      alt: "Sunlit dirt path winding through a pine forest",
    },
    {
      title: "Glass and Steel",
      category: "architecture",
      src: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=900&q=80",
      alt: "Low angle view of a modern glass office tower",
    },
    {
      title: "Curved Facade",
      category: "architecture",
      src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80",
      alt: "Modern building with a sweeping curved white facade",
    },
    {
      title: "Concrete Geometry",
      category: "architecture",
      src: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=900&q=80",
      alt: "Abstract geometric lines of a concrete building exterior",
    },
    {
      title: "Skyline Ascending",
      category: "architecture",
      src: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80",
      alt: "Skyscrapers rising against a bright sky",
    },
    {
      title: "Quiet Gaze",
      category: "people",
      src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80",
      alt: "Close portrait of a person with a calm expression",
    },
    {
      title: "Golden Hour Portrait",
      category: "people",
      src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
      alt: "Portrait of a person lit by warm golden hour light",
    },
    {
      title: "Candid Laughter",
      category: "people",
      src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80",
      alt: "Candid portrait of a woman laughing outdoors",
    },
    {
      title: "Studio Light",
      category: "people",
      src: "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=900&q=80",
      alt: "Studio portrait of a man with soft directional light",
    },
  ];

  /* ---------- 2. DOM references ---------- */
  const galleryEl = document.getElementById("gallery");
  const galleryEmptyEl = document.getElementById("galleryEmpty");
  const filterButtonsEl = document.getElementById("filterButtons");

  const lightboxEl = document.getElementById("lightbox");
  const lightboxBackdropEl = document.getElementById("lightboxBackdrop");
  const lightboxImageEl = document.getElementById("lightboxImage");
  const lightboxTitleEl = document.getElementById("lightboxTitle");
  const lightboxCategoryEl = document.getElementById("lightboxCategory");
  const lightboxCountEl = document.getElementById("lightboxCount");
  const lightboxCloseBtn = document.getElementById("lightboxClose");
  const lightboxPrevBtn = document.getElementById("lightboxPrev");
  const lightboxNextBtn = document.getElementById("lightboxNext");

  const CATEGORY_COLORS = {
    nature: "var(--color-nature)",
    architecture: "var(--color-architecture)",
    people: "var(--color-people)",
  };

  const CATEGORY_LABELS = {
    nature: "Nature",
    architecture: "Architecture",
    people: "People",
  };

  // Tracks which subset of imageData is currently visible, and where the
  // lightbox is positioned within that subset.
  let visibleItems = imageData.slice();
  let activeCategory = "all";
  let currentIndex = 0;
  let lastFocusedElement = null;

  /* ---------- 3. Render the gallery grid ---------- */
  function renderGallery(items) {
    galleryEl.innerHTML = "";

    items.forEach((item, index) => {
      const card = document.createElement("article");
      card.className = "gallery-item";
      card.dataset.category = item.category;
      card.style.setProperty("--delay", `${index * 60}ms`);
      card.setAttribute("tabindex", "0");
      card.setAttribute("role", "button");
      card.setAttribute(
        "aria-label",
        `Open enlarged view of ${item.title} (${CATEGORY_LABELS[item.category]})`
      );

      card.innerHTML = `
        <span class="gallery-item__accent" aria-hidden="true"></span>
        <div class="gallery-item__frame">
          <img class="gallery-image" src="${item.src}" alt="${item.alt}" loading="lazy" />
        </div>
        <div class="gallery-item__caption">
          <span class="gallery-item__category">${CATEGORY_LABELS[item.category]}</span>
          <span class="gallery-item__title">${item.title}</span>
        </div>
      `;

      // Open the lightbox on click or on Enter/Space when focused
      card.addEventListener("click", () => openLightbox(index));
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openLightbox(index);
        }
      });

      galleryEl.appendChild(card);
    });

    galleryEmptyEl.hidden = items.length > 0;
  }

  /* ---------- 4. Category filtering ---------- */
  filterButtonsEl.addEventListener("click", (event) => {
    const button = event.target.closest(".filter-btn");
    if (!button) return;

    activeCategory = button.dataset.category;

    // Toggle active state on buttons
    filterButtonsEl.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.classList.toggle("is-active", btn === button);
    });

    visibleItems =
      activeCategory === "all"
        ? imageData.slice()
        : imageData.filter((item) => item.category === activeCategory);

    renderGallery(visibleItems);
  });

  /* ---------- 5. Lightbox: open / close ---------- */
  function openLightbox(index) {
    currentIndex = index;
    lastFocusedElement = document.activeElement;

    updateLightboxContent();
    lightboxEl.hidden = false;
    document.body.style.overflow = "hidden"; // prevent background scroll
    lightboxCloseBtn.focus();

    document.addEventListener("keydown", handleLightboxKeydown);
  }

  function closeLightbox() {
    lightboxEl.hidden = true;
    document.body.style.overflow = "";
    document.removeEventListener("keydown", handleLightboxKeydown);

    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  function updateLightboxContent() {
    const item = visibleItems[currentIndex];
    if (!item) return;

    lightboxImageEl.src = item.src;
    lightboxImageEl.alt = item.alt;
    lightboxImageEl.style.borderColor = CATEGORY_COLORS[item.category];
    lightboxTitleEl.textContent = item.title;
    lightboxCategoryEl.textContent = CATEGORY_LABELS[item.category];
    lightboxCategoryEl.style.color = CATEGORY_COLORS[item.category];
    lightboxCountEl.textContent = `${String(currentIndex + 1).padStart(2, "0")} / ${String(
      visibleItems.length
    ).padStart(2, "0")}`;
  }

  /* ---------- 6. Lightbox: prev / next ---------- */
  function showPrev() {
    currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    updateLightboxContent();
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % visibleItems.length;
    updateLightboxContent();
  }

  /* ---------- 7. Keyboard controls ---------- */
  function handleLightboxKeydown(event) {
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") showPrev();
    if (event.key === "ArrowRight") showNext();
  }

  /* ---------- 8. Touch swipe (mobile) ---------- */
  let touchStartX = 0;

  lightboxEl.addEventListener(
    "touchstart",
    (event) => {
      touchStartX = event.changedTouches[0].clientX;
    },
    { passive: true }
  );

  lightboxEl.addEventListener(
    "touchend",
    (event) => {
      const deltaX = event.changedTouches[0].clientX - touchStartX;
      const SWIPE_THRESHOLD = 50;

      if (deltaX > SWIPE_THRESHOLD) showPrev();
      else if (deltaX < -SWIPE_THRESHOLD) showNext();
    },
    { passive: true }
  );

  /* ---------- 9. Wire up static lightbox controls ---------- */
  lightboxCloseBtn.addEventListener("click", closeLightbox);
  lightboxBackdropEl.addEventListener("click", closeLightbox);
  lightboxPrevBtn.addEventListener("click", showPrev);
  lightboxNextBtn.addEventListener("click", showNext);

  /* ---------- 10. Initial render ---------- */
  renderGallery(visibleItems);
})();
