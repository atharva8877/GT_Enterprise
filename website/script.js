const mediaRoot = "assets/";
const slides = [
  { name: "Traub machining", heading: "Traub machining", image: "work 1.1.jpeg", video: "work 1.2.web.mp4", description: "A close-up look at the supplied Traub machining footage and finished components." },
  {
    name: "Grinding work",
    heading: "Precision Centerless Grinding",
    image: "work 2.1.jpeg",
    video: "work 2.2.web.mp4",
    serviceDetails: {
      introduction: "G.T. Enterprises specializes in precision centerless grinding job work for a wide range of materials. We handle diameters from 3 mm to 35 mm, with a focus on dimensional accuracy, excellent surface finish, consistent quality, and timely delivery. Jobs are completed to customer requirements and specifications.",
      listTitle: "Our Services & Specialities",
      points: [
        "Precision centerless grinding",
        "Grinding capacity: Ø3 mm to Ø35 mm",
        "Grinding of various types of materials",
        "Accurate diameter control",
        "Excellent surface finish",
        "Consistent quality",
        "Customer satisfaction and on-time delivery"
      ],
      closing: "At G.T. Enterprises, we believe in quality, precision, and long-term customer relationships. We are committed to providing dependable grinding services to meet the diverse needs of our customers."
    }
  },
  {
    name: "Rolling work",
    heading: "Flat Rolling",
    image: "work 3.1.jpeg",
    video: "work 3.2.web.mp4",
    serviceDetails: {
      introduction: "G.T. Enterprises specializes in flat rolling operations for various types of materials, covering sizes from M3 to M12. We are committed to high-quality rolling services with precision, consistent quality, and reliable performance. Our focus is on meeting customer requirements, maintaining quality standards, and ensuring timely delivery.",
      listTitle: "Our Specialization",
      points: [
        "Flat rolling operations",
        "Rolling from M3 to M12",
        "Various types of materials",
        "Quality-focused manufacturing",
        "Customer satisfaction and timely delivery"
      ],
      closing: "With a dedication to quality, customer satisfaction, and continuous improvement, G.T. Enterprises aims to build long-term business relationships and deliver reliable rolling solutions to our valued customers."
    }
  }
];
const storageKey = "gt-enterprises-feedback-v1";
let managerView = "pending";
let toastTimer;

const introScreen = document.querySelector("#intro-screen");
function dismissIntro() {
  if (!introScreen || introScreen.classList.contains("is-leaving")) return;
  introScreen.classList.add("is-leaving");
  window.setTimeout(() => introScreen.remove(), 750);
}
document.querySelector("#intro-skip").addEventListener("click", dismissIntro);
window.setTimeout(dismissIntro, 1900);

document.querySelector("#current-year").textContent = new Date().getFullYear();

const menuToggle = document.querySelector("#menu-toggle");
const siteNav = document.querySelector("#site-nav");
menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  siteNav.classList.toggle("is-open", !isOpen);
});
siteNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    siteNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  }
});

const galleryImage = document.querySelector("#gallery-image");
const galleryVideo = document.querySelector("#gallery-video");
const galleryMedia = document.querySelector(".gallery-media");
const galleryTab = document.querySelector("#work-slide");
const videoError = document.querySelector("#video-error");
const gallery = document.querySelector(".gallery");
const galleryTitle = document.querySelector("#gallery-title");
const galleryDescription = document.querySelector("#gallery-description");
let activeSlide = 0;
let activeMedia = "image-1";
function renderGalleryDescription(slide) {
  galleryDescription.replaceChildren();
  gallery.classList.toggle("has-service-details", Boolean(slide.serviceDetails));
  if (!slide.serviceDetails) {
    const paragraph = document.createElement("p");
    paragraph.textContent = slide.description;
    galleryDescription.append(paragraph);
    return;
  }

  const details = slide.serviceDetails;
  const introduction = document.createElement("p");
  introduction.textContent = details.introduction;
  galleryDescription.append(introduction);

  const listHeading = document.createElement("h4");
  listHeading.textContent = details.listTitle;
  galleryDescription.append(listHeading);

  const list = document.createElement("ul");
  details.points.forEach((point) => {
    const item = document.createElement("li");
    item.textContent = point;
    list.append(item);
  });
  galleryDescription.append(list);

  const closing = document.createElement("p");
  closing.textContent = details.closing;
  galleryDescription.append(closing);
}
function reportVideoError() {
  if (activeMedia !== "video") return;
  videoError.textContent = window.location.protocol === "file:"
    ? "This browser cannot play videos when the site is opened directly from a local file. Serve the site over HTTP or HTTPS and try again."
    : `This browser could not play ${slides[activeSlide].video}. Use a current browser that supports H.264 video and AAC audio.`;
  videoError.hidden = false;
}
function selectMedia(kind) {
  activeMedia = kind;
  videoError.hidden = true;
  videoError.textContent = "";
  galleryVideo.pause();
  galleryVideo.currentTime = 0;
  galleryMedia.classList.toggle("video-active", kind === "video");
  galleryImage.alt = `${slides[activeSlide].name} photo`;
  document.querySelectorAll(".media-choice").forEach((button) => {
    const selected = button.dataset.media === kind;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  document.querySelector("#video-toggle").innerHTML = "<span aria-hidden=\"true\">▶</span>";
  document.querySelector("#video-toggle").setAttribute("aria-label", "Play project video");
  if (kind === "video" && galleryVideo.error) reportVideoError();
}
function showSlide(index) {
  activeSlide = (index + slides.length) % slides.length;
  const slide = slides[activeSlide];
  galleryImage.src = mediaRoot + encodeURIComponent(slide.image);
  galleryVideo.src = mediaRoot + encodeURIComponent(slide.video);
  galleryVideo.setAttribute("aria-label", `${slide.name} video`);
  galleryVideo.load();
  selectMedia("image-1");
  galleryTitle.textContent = slide.heading;
  renderGalleryDescription(slide);
  document.querySelector("#gallery-kicker").textContent = slide.name;
  document.querySelector("#media-tag").textContent = `FIELD NOTES / 0${activeSlide + 1}`;
  document.querySelector("#gallery-count").innerHTML = `0${activeSlide + 1} <i>/</i> 03`;
  const tabs = [...document.querySelectorAll(".work-tab")];
  tabs.forEach((tab, tabIndex) => {
    const selected = tabIndex === activeSlide;
    tab.classList.toggle("is-active", selected);
    tab.setAttribute("aria-selected", String(selected));
  });
  galleryTab.setAttribute("aria-labelledby", `work-tab-${activeSlide + 1}`);
}
document.querySelectorAll(".work-tab").forEach((tab) => tab.addEventListener("click", () => showSlide(Number(tab.dataset.slide))));
document.querySelector("#gallery-prev").addEventListener("click", () => showSlide(activeSlide - 1));
document.querySelector("#gallery-next").addEventListener("click", () => showSlide(activeSlide + 1));
document.querySelectorAll(".media-choice").forEach((button) => button.addEventListener("click", () => selectMedia(button.dataset.media)));
galleryVideo.addEventListener("error", reportVideoError);
document.querySelector("#video-toggle").addEventListener("click", async () => {
  if (activeMedia !== "video") selectMedia("video");
  if (!galleryVideo.paused) {
    galleryVideo.pause();
    document.querySelector("#video-toggle").innerHTML = "<span aria-hidden=\"true\">▶</span>";
    document.querySelector("#video-toggle").setAttribute("aria-label", "Play project video");
    return;
  }
  try {
    await galleryVideo.play();
    document.querySelector("#video-toggle").innerHTML = "<span aria-hidden=\"true\">Ⅱ</span>";
    document.querySelector("#video-toggle").setAttribute("aria-label", "Pause project video");
  } catch {
    reportVideoError();
  }
});
galleryVideo.addEventListener("ended", () => {
  galleryMedia.classList.remove("video-active");
  document.querySelector("#video-toggle").innerHTML = "<span aria-hidden=\"true\">▶</span>";
  document.querySelector("#video-toggle").setAttribute("aria-label", "Play project video");
});

function getFeedback() {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}
function saveFeedback(items) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(items));
    return true;
  } catch {
    showToast("This browser could not save feedback. Please try again.");
    return false;
  }
}
function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 3600);
}
function renderPublicReviews() {
  const approved = getFeedback().filter((item) => item.status === "approved");
  const list = document.querySelector("#reviews-list");
  document.querySelector("#review-count").textContent = `${approved.length} ${approved.length === 1 ? "REVIEW" : "REVIEWS"}`;
  if (!approved.length) {
    list.innerHTML = "<div class=\"empty-reviews\"><span class=\"empty-symbol\">“ ”</span><p>Our first verified customer feedback will appear here.</p></div>";
    return;
  }
  list.innerHTML = approved.map((item) => `<article class="review-item"><div class="review-stars" aria-label="${item.rating} out of 5 stars">${"★".repeat(item.rating)}${"☆".repeat(5 - item.rating)}</div><p class="review-message"></p><p class="review-author"></p></article>`).join("");
  [...list.querySelectorAll(".review-item")].forEach((element, index) => {
    const item = approved[index];
    element.querySelector(".review-message").textContent = item.message;
    element.querySelector(".review-author").textContent = item.role ? `${item.name} · ${item.role}` : item.name;
  });
}
document.querySelector("#feedback-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const items = getFeedback();
  items.unshift({
    id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: String(data.get("name")).trim(),
    role: String(data.get("role")).trim(),
    rating: Number(data.get("rating")),
    message: String(data.get("message")).trim(),
    status: "pending",
    createdAt: new Date().toISOString()
  });
  if (saveFeedback(items)) {
    form.reset();
    document.querySelector("#rating-5").checked = true;
    showToast("Thank you. Your feedback has been sent for review.");
  }
});

const managerDialog = document.querySelector("#manager-dialog");
const managerTools = document.querySelector("#manager-tools");
document.querySelector("#manager-open").addEventListener("click", () => {
  managerDialog.showModal();
  renderManagerList();
});
document.querySelector("#manager-close").addEventListener("click", () => managerDialog.close());
managerDialog.addEventListener("click", (event) => {
  if (event.target === managerDialog) managerDialog.close();
});
document.querySelector("#manager-login").addEventListener("submit", (event) => {
  event.preventDefault();
  if (document.querySelector("#manager-pin").value === "2468") {
    managerTools.hidden = false;
    document.querySelector("#manager-login").hidden = true;
    document.querySelector("#manager-error").textContent = "";
    renderManagerList();
  } else {
    document.querySelector("#manager-error").textContent = "That code did not match. Please try again.";
  }
});
document.querySelectorAll(".manager-tab").forEach((tab) => tab.addEventListener("click", () => {
  managerView = tab.dataset.view;
  document.querySelectorAll(".manager-tab").forEach((item) => item.classList.toggle("is-active", item === tab));
  renderManagerList();
}));
function renderManagerList() {
  const items = getFeedback();
  const pending = items.filter((item) => item.status === "pending");
  const approved = items.filter((item) => item.status === "approved");
  document.querySelector("#pending-count").textContent = String(pending.length);
  document.querySelector("#published-count").textContent = String(approved.length);
  const visible = managerView === "pending" ? pending : approved;
  const list = document.querySelector("#manager-list");
  if (!visible.length) {
    list.innerHTML = `<p class="manager-empty">No ${managerView} feedback.</p>`;
    return;
  }
  list.innerHTML = visible.map((item) => `<article class="manager-review" data-id="${escapeAttribute(item.id)}"><strong>${escapeHtml(item.name)}</strong> <span class="review-stars">${"★".repeat(item.rating)}</span><p></p><small>${escapeHtml(item.role || "No company or role provided")} · ${new Date(item.createdAt).toLocaleDateString()}</small><div class="manager-actions">${item.status === "pending" ? "<button class=\"approve-review\" type=\"button\" data-action=\"approve\">Approve</button>" : ""}<button class="delete-review" type="button" data-action="delete">Remove</button></div></article>`).join("");
  [...list.querySelectorAll(".manager-review")].forEach((element, index) => {
    element.querySelector("p").textContent = visible[index].message;
  });
  list.querySelectorAll("button[data-action]").forEach((button) => button.addEventListener("click", () => {
    const id = button.closest(".manager-review").dataset.id;
    const updated = getFeedback().map((item) => item.id === id && button.dataset.action === "approve" ? { ...item, status: "approved" } : item).filter((item) => !(item.id === id && button.dataset.action === "delete"));
    if (saveFeedback(updated)) {
      renderPublicReviews();
      renderManagerList();
      showToast(button.dataset.action === "approve" ? "Feedback approved and published." : "Feedback removed.");
    }
  }));
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" })[character]);
}
function escapeAttribute(value) {
  return escapeHtml(value);
}
renderPublicReviews();