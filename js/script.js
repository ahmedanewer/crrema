/**
 * CremaVera Moroccan Seafood - Vanilla JavaScript (ES6+)
 * High-performance, zero-framework, static interactive script.
 */

// =============================================================================
// Configuration Constants
// =============================================================================
// Replace this with your official Moroccan phone number (format: 212XXXXXXXXX)
const WHATSAPP_PHONE_NUMBER = "212600000000";

const DEFAULT_WHATSAPP_MESSAGE = 
  "مرحباً، أود الاستفسار عن الأسماك وفواكه البحر الطازجة المتوفرة اليوم لدى كريما فيرا.";

// Helper to construct WhatsApp URL
function createWhatsAppUrl(customMessage) {
  const text = encodeURIComponent(customMessage || DEFAULT_WHATSAPP_MESSAGE);
  return `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${text}`;
}

// =============================================================================
// DOM Ready Handler
// =============================================================================
document.addEventListener("DOMContentLoaded", () => {
  initStickyHeader();
  initMobileMenu();
  initProductFilter();
  initOrderBuilder();
  initGalleryLightbox();
  initScrollSpy();
  initStatsCounter();
  initDynamicWhatsAppLinks();
});

// =============================================================================
// 1. Sticky Header with Scroll Detection
// =============================================================================
function initStickyHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
}

// =============================================================================
// 2. Mobile Drawer Navigation
// =============================================================================
function initMobileMenu() {
  const menuBtn = document.querySelector(".mobile-menu-btn");
  const drawer = document.querySelector(".mobile-drawer");
  const backdrop = document.querySelector(".drawer-backdrop");
  const drawerLinks = document.querySelectorAll(".mobile-nav-link");

  if (!menuBtn || !drawer || !backdrop) return;

  const toggleMenu = (open) => {
    const isOpen = open !== undefined ? open : !drawer.classList.contains("open");
    menuBtn.classList.toggle("open", isOpen);
    drawer.classList.toggle("open", isOpen);
    backdrop.classList.toggle("open", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
  };

  menuBtn.addEventListener("click", () => toggleMenu());
  backdrop.addEventListener("click", () => toggleMenu(false));

  drawerLinks.forEach((link) => {
    link.addEventListener("click", () => toggleMenu(false));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer.classList.contains("open")) {
      toggleMenu(false);
    }
  });
}

// =============================================================================
// 3. Products Category Filtering
// =============================================================================
function initProductFilter() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const productCards = document.querySelectorAll(".product-card");

  if (!filterBtns.length || !productCards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remove active class from all
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const category = btn.getAttribute("data-category");

      productCards.forEach((card) => {
        const cardCat = card.getAttribute("data-category");
        if (category === "all" || cardCat === category) {
          card.style.display = "flex";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          }, 20);
        } else {
          card.style.opacity = "0";
          card.style.transform = "translateY(12px)";
          setTimeout(() => {
            card.style.display = "none";
          }, 250);
        }
      });
    });
  });
}

// =============================================================================
// 4. Interactive WhatsApp Order Form Builder
// =============================================================================
function initOrderBuilder() {
  const form = document.getElementById("seafood-order-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const product = document.getElementById("order-product")?.value || "أسماك متنوعة";
    const quantity = document.getElementById("order-quantity")?.value || "1";
    const city = document.getElementById("order-city")?.value || "غير محدد";
    const notes = document.getElementById("order-notes")?.value || "بدون ملاحظات";

    const formattedMessage = 
      `السلام عليكم ورحمة الله،\n` +
      `أود تقديم طلب سمك طازج من كريما فيرا:\n` +
      `• المنتج المطلوب: ${product}\n` +
      `• الكمية التقريبية: ${quantity} كغ\n` +
      `• مدينة التوصيل / العنوان: ${city}\n` +
      `• ملاحظات خاصة: ${notes}\n\n` +
      `يرجى تأكيد التوفر وسعر اليوم. شكراً جزيلاً!`;

    const url = createWhatsAppUrl(formattedMessage);
    window.open(url, "_blank", "noopener,noreferrer");
  });
}

// =============================================================================
// 5. Interactive Photo Gallery Lightbox
// =============================================================================
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll(".gallery-item");
  const lightbox = document.getElementById("gallery-lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const closeBtn = document.querySelector(".lightbox-close-btn");
  const prevBtn = document.querySelector(".lightbox-prev");
  const nextBtn = document.querySelector(".lightbox-next");

  if (!galleryItems.length || !lightbox) return;

  let currentIndex = 0;
  const itemsData = Array.from(galleryItems).map((item) => {
    const img = item.querySelector(".gallery-item-img");
    const caption = item.querySelector(".gallery-caption");
    return {
      src: img?.getAttribute("src") || "",
      caption: caption?.textContent || "",
    };
  });

  const showImage = (index) => {
    currentIndex = (index + itemsData.length) % itemsData.length;
    const item = itemsData[currentIndex];
    if (lightboxImg) lightboxImg.src = item.src;
    if (lightboxCaption) lightboxCaption.textContent = item.caption;
  };

  const openLightbox = (index) => {
    showImage(index);
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
  };

  galleryItems.forEach((item, index) => {
    item.addEventListener("click", () => openLightbox(index));
  });

  if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
  if (prevBtn) prevBtn.addEventListener("click", (e) => { e.stopPropagation(); showImage(currentIndex - 1); });
  if (nextBtn) nextBtn.addEventListener("click", (e) => { e.stopPropagation(); showImage(currentIndex + 1); });

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") showImage(currentIndex - 1); // RTL right is previous
    if (e.key === "ArrowLeft") showImage(currentIndex + 1);  // RTL left is next
  });
}

// =============================================================================
// 6. Scroll Spy for Active Navigation Links
// =============================================================================
function initScrollSpy() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  if (!sections.length || !navLinks.length) return;

  window.addEventListener("scroll", () => {
    let currentId = "";
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentId = section.getAttribute("id") || "";
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentId}`) {
        link.classList.add("active");
      }
    });
  }, { passive: true });
}

// =============================================================================
// 7. Dynamic Animated Stats Counter
// =============================================================================
function initStatsCounter() {
  const statNumbers = document.querySelectorAll(".stat-number[data-target]");
  if (!statNumbers.length) return;

  let hasAnimated = false;

  const animateCounters = () => {
    statNumbers.forEach((counter) => {
      const target = +counter.getAttribute("data-target");
      const duration = 1500; // ms
      const stepTime = 30;
      const steps = duration / stepTime;
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = target + (counter.getAttribute("data-suffix") || "");
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(current) + (counter.getAttribute("data-suffix") || "");
        }
      }, stepTime);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        animateCounters();
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector(".ocean-heritage-section");
  if (statsSection) observer.observe(statsSection);
}

// =============================================================================
// 8. Bind Dynamic WhatsApp Links Across Products & CTAs
// =============================================================================
function initDynamicWhatsAppLinks() {
  // Update floating button
  const floatingBtn = document.querySelector(".floating-whatsapp-btn");
  if (floatingBtn) {
    floatingBtn.setAttribute("href", createWhatsAppUrl());
    floatingBtn.setAttribute("target", "_blank");
    floatingBtn.setAttribute("rel", "noopener noreferrer");
  }

  // Header WhatsApp button
  const headerBtn = document.querySelector(".btn-header-whatsapp");
  if (headerBtn) {
    headerBtn.setAttribute("href", createWhatsAppUrl());
    headerBtn.setAttribute("target", "_blank");
    headerBtn.setAttribute("rel", "noopener noreferrer");
  }

  // Hero WhatsApp CTA
  const heroWhatsApp = document.querySelector(".btn-hero-whatsapp");
  if (heroWhatsApp) {
    heroWhatsApp.setAttribute("href", createWhatsAppUrl("مرحباً كريما فيرا، أرغب بالاستفسار عن طلب سمك طازج اليوم."));
    heroWhatsApp.setAttribute("target", "_blank");
    heroWhatsApp.setAttribute("rel", "noopener noreferrer");
  }

  // Product Card WhatsApp Buttons
  const productButtons = document.querySelectorAll(".btn-card-whatsapp[data-product]");
  productButtons.forEach((btn) => {
    const productName = btn.getAttribute("data-product");
    const msg = `السلام عليكم كريما فيرا، أود الاستفسار عن طلب: ${productName} (الكمية وسعر اليوم).`;
    btn.setAttribute("href", createWhatsAppUrl(msg));
    btn.setAttribute("target", "_blank");
    btn.setAttribute("rel", "noopener noreferrer");
  });
}
