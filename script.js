const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".primary-nav");

menuButton.addEventListener("click", () => {
  const open = navigation.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});

navigation.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    navigation.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  }
});

const indiaMenuTrigger = document.querySelector(".india-menu-trigger");
const indiaMegaMenu = document.querySelector("#study-india-menu");
const indiaMenuRegion = document.querySelector(".update-strip");
const supportsMenuHover = window.matchMedia("(hover: hover) and (pointer: fine)");

function setIndiaMenu(open) {
  indiaMegaMenu.hidden = !open;
  indiaMenuTrigger.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("india-menu-open", open);
}

indiaMenuTrigger.addEventListener("click", (event) => {
  event.stopPropagation();
  setIndiaMenu(indiaMegaMenu.hidden);
});

indiaMenuTrigger.addEventListener("mouseenter", () => {
  if (supportsMenuHover.matches) setIndiaMenu(true);
});

indiaMenuRegion.addEventListener("mouseleave", () => {
  if (supportsMenuHover.matches) setIndiaMenu(false);
});

indiaMegaMenu.addEventListener("click", (event) => {
  if (event.target.closest("a")) setIndiaMenu(false);
});

document.addEventListener("click", (event) => {
  if (!indiaMegaMenu.hidden && !indiaMegaMenu.contains(event.target)) setIndiaMenu(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !indiaMegaMenu.hidden) {
    setIndiaMenu(false);
    indiaMenuTrigger.focus();
  }
});

const form = document.querySelector("#waitlist-form");
const successMessage = document.querySelector("#success-message");
const destination = form.elements.destination;
const studyPreferenceField = document.querySelector("#study-preference-field");
const studyPreferenceLabel = document.querySelector("#study-preference-label");
const studyPreference = form.elements.studyPreference;

const indianStates = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka",
  "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim",
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

const studyCountries = [
  "Australia", "Canada", "France", "Germany", "Ireland", "Italy", "Malaysia", "Netherlands",
  "New Zealand", "Singapore", "Sweden", "United Arab Emirates", "United Kingdom", "United States",
  "Other",
];

function showError(field, message) {
  field.classList.toggle("is-invalid", Boolean(message));
  field.setAttribute("aria-invalid", String(Boolean(message)));
  field.closest("label").querySelector(".error").textContent = message;
}

const enquiryEndpoint = "https://cms.leadzstudyabroad.com/api/admissions-edu/enquiries";

function updateStudyPreference() {
  const isIndia = destination.value === "India";
  const isAbroad = destination.value === "Abroad";
  const options = isIndia ? indianStates : isAbroad ? studyCountries : [];

  studyPreferenceField.hidden = !options.length;
  studyPreference.disabled = !options.length;
  studyPreference.required = Boolean(options.length);
  studyPreferenceLabel.textContent = isIndia ? "Which state are you interested in?" : "Which country are you interested in?";
  studyPreference.innerHTML = `<option value="">${isIndia ? "Select a state" : "Select a country"}</option>`;
  options.forEach((option) => {
    const element = document.createElement("option");
    element.value = option;
    element.textContent = option;
    studyPreference.appendChild(element);
  });
}

destination.addEventListener("change", updateStudyPreference);
updateStudyPreference();

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  successMessage.textContent = "";

  const firstName = form.elements.firstName;
  const lastName = form.elements.lastName;
  const mobile = form.elements.mobile;
  const location = form.elements.location;
  const mobileIsValid = /^\+?[0-9\s()-]{7,20}$/.test(mobile.value.trim());
  const studyPreferenceIsValid = Boolean(destination.value && studyPreference.value);

  showError(firstName, firstName.value.trim() ? "" : "Please enter your first name.");
  showError(lastName, lastName.value.trim() ? "" : "Please enter your last name.");
  showError(mobile, mobileIsValid ? "" : "Please enter a valid mobile number.");
  showError(location, location.value.trim() ? "" : "Please enter your location.");
  showError(destination, destination.value ? "" : "Please select where you plan to study.");
  showError(studyPreference, !destination.value || studyPreferenceIsValid ? "" : destination.value === "India" ? "Please select a state." : "Please select a country.");

  if (!firstName.value.trim() || !lastName.value.trim() || !mobileIsValid || !location.value.trim() || !destination.value || !studyPreferenceIsValid) {
    form.querySelector(".is-invalid")?.focus();
    return;
  }

  const button = form.querySelector('button[type="submit"]');
  const originalButtonText = button.textContent;
  button.disabled = true;
  button.textContent = "Sending...";

  try {
    const response = await fetch(enquiryEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: firstName.value.trim(),
        lastName: lastName.value.trim(),
        mobile: mobile.value.trim(),
        location: location.value.trim(),
        destination: `${destination.value}: ${studyPreference.value}`,
        pageUrl: window.location.href,
        website: form.elements.website.value,
      }),
    });
    if (!response.ok) throw new Error("Submission failed");
    successMessage.textContent = "Thank you — your enquiry has been received. Our admissions team will contact you soon.";
    form.reset();
    updateStudyPreference();
  } catch {
    successMessage.textContent = "We could not send your enquiry right now. Please try again or call +91 9745000575.";
  } finally {
    button.disabled = false;
    button.textContent = originalButtonText;
  }
});

const educationSearch = document.querySelector("#education-search");
const educationSearchInput = document.querySelector("#education-search-input");

if (educationSearch && educationSearchInput) {
  educationSearch.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = educationSearchInput.value.trim().toLowerCase();
    if (!query) {
      educationSearchInput.focus();
      return;
    }

    if (query.includes("overseas") && query.includes("india")) {
      window.location.href = "/overseas-universities-in-india/";
      return;
    }

    if (["engineering", "medicine", "medical", "management", "mba", "law", "course", "career", "b.tech", "bba", "b.com", "mbbs", "nursing", "design", "science", "arts", "diploma", "ph.d"].some((term) => query.includes(term))) {
      window.location.href = `/courses/?q=${encodeURIComponent(educationSearchInput.value.trim())}`;
      return;
    }

    window.location.href = `/education-directory/?q=${encodeURIComponent(educationSearchInput.value.trim())}`;
  });
}
