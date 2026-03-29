const ACCOUNT_STORAGE_KEY = "greenhouseAccounts";
const SESSION_STORAGE_KEY = "greenhouseCurrentUser";
const POST_STORAGE_KEY = "greenhousePosts";
const PROJECT_STORAGE_KEY = "greenhouseProjects";

const defaultProjects = [
  {
    id: 1,
    title: "Solar-Powered Water Filter",
    description: "Affordable purification units for communities without clean water access.",
    availability: "5 hrs/week",
    stage: "Seed",
    author: "Priya, 16",
    needs: ["Engineer", "Solar Panels"]
  },
  {
    id: 2,
    title: "Braille Homework Helper",
    description: "A tactile device that converts digital worksheets into Braille for visually impaired students.",
    availability: "10 hrs/week",
    stage: "Sprout",
    author: "Marcus, 15",
    needs: ["3D Printer", "Accessibility Tester"]
  },
  {
    id: 3,
    title: "Refugee Language Bridge",
    description: "Peer-to-peer language exchange app connecting refugee teens with local students.",
    availability: "10 hrs/week",
    stage: "Oak",
    author: "Amira, 17",
    needs: ["Translator", "UX Designer"]
  },
  {
    id: 4,
    title: "Composting Network Map",
    description: "Mapping neighborhood drop-off points so food waste becomes community soil.",
    availability: "5 hrs/week",
    stage: "Seed",
    author: "Jordan, 14",
    needs: ["Web Developer", "Local Farms"]
  },
  {
    id: 5,
    title: "Micro-Library Kits",
    description: "Flat-pack free libraries designed for underserved neighborhoods, built from recycled wood.",
    availability: "10 hrs/week",
    stage: "Sprout",
    author: "Tomás, 16",
    needs: ["Carpenter", "Book Donations"]
  },
  {
    id: 6,
    title: "Period Product Dispensers",
    description: "Free, refillable dispensers for school bathrooms — designed and fundraised by students.",
    availability: "5 hrs/week",
    stage: "Oak",
    author: "Lena, 17",
    needs: ["3D Printer", "Sponsor"]
  }
];

const defaultPosts = [
  {
    id: 1,
    author: "@greenhouse",
    content: "Welcome to Greenhouse. Share what you're building and find collaborators.",
    audience: "Public",
    createdAt: "Just now"
  }
];

let accounts = loadAccounts();
let currentUser = loadCurrentUser();
let posts = loadPosts();
let projects = loadProjects();

function loadAccounts() {
  const stored = localStorage.getItem(ACCOUNT_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveAccounts() {
  localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(accounts));
}

function loadCurrentUser() {
  return localStorage.getItem(SESSION_STORAGE_KEY) || "";
}

function saveCurrentUser() {
  if (currentUser) {
    localStorage.setItem(SESSION_STORAGE_KEY, currentUser);
  } else {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }
}

function loadPosts() {
  const stored = localStorage.getItem(POST_STORAGE_KEY);
  return stored ? JSON.parse(stored) : defaultPosts.slice();
}

function savePosts() {
  localStorage.setItem(POST_STORAGE_KEY, JSON.stringify(posts));
}

function loadProjects() {
  const stored = localStorage.getItem(PROJECT_STORAGE_KEY);
  return stored ? JSON.parse(stored) : defaultProjects.slice();
}

function saveProjects() {
  localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(projects));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getStageIcon(stage) {
  if (stage === "Seed") return "&#127793;";
  if (stage === "Sprout") return "&#127807;";
  return "&#127795;";
}

function getStageClass(stage) {
  return stage.toLowerCase();
}

function renderGreenhouse() {
  const seedVault = document.getElementById("seed-vault");
  if (!seedVault) return;

  seedVault.innerHTML = "";

  projects.forEach((project) => {
    const article = document.createElement("article");
    article.className = `idea-card ${getStageClass(project.stage)}`;

    const needsMarkup = project.needs
      .map((need) => `<li class="resource-tag">[Need: ${escapeHtml(need)}]</li>`)
      .join("");

    article.innerHTML = `
      <div class="card-top">
        <div class="growth-icon">
          <span class="icon-symbol">${getStageIcon(project.stage)}</span>
          <span class="stage-label">${escapeHtml(project.stage)}</span>
        </div>
        <span class="availability-badge">${escapeHtml(project.availability)}</span>
      </div>
      <h3 class="card-title">${escapeHtml(project.title)}</h3>
      <p class="card-desc">${escapeHtml(project.description)}</p>
      <div class="card-author">by <strong>${escapeHtml(project.author)}</strong></div>
      <ul class="resource-requests">
        ${needsMarkup}
      </ul>
    `;

    seedVault.appendChild(article);
  });
}

function ensureAccountSection() {
  if (document.getElementById("create-account-form")) return;

  const intro = document.querySelector(".dashboard-intro");
  if (!intro) return;

  const section = document.createElement("section");
  section.id = "accounts";
  section.className = "seed-form-section";
  section.innerHTML = `
    <h2 class="section-title">Accounts</h2>
    <p class="form-subtitle">Create an account or sign in to post publicly.</p>

    <div id="account-status" class="account-status"></div>

    <div id="auth-forms" class="auth-forms">
      <form id="create-account-form" class="auth-form">
        <h3 class="auth-form-title">Create Account</h3>
        <div class="form-row">
          <div class="form-group">
            <label for="create-username">Username</label>
            <input id="create-username" name="username" type="text" placeholder="Pick a username" minlength="3" required>
          </div>
          <div class="form-group">
            <label for="create-password">Password</label>
            <input id="create-password" name="password" type="password" placeholder="Min 4 characters" minlength="4" required>
          </div>
        </div>
        <button type="submit" class="seed-submit-btn">Create Account</button>
      </form>

      <form id="sign-in-form" class="auth-form">
        <h3 class="auth-form-title">Sign In</h3>
        <div class="form-row">
          <div class="form-group">
            <label for="sign-in-username">Username</label>
            <input id="sign-in-username" name="username" type="text" placeholder="Your username" required>
          </div>
          <div class="form-group">
            <label for="sign-in-password">Password</label>
            <input id="sign-in-password" name="password" type="password" placeholder="Your password" required>
          </div>
        </div>
        <button type="submit" class="seed-submit-btn">Sign In</button>
      </form>
    </div>

    <button id="sign-out-button" class="seed-submit-btn sign-out-btn" type="button">Sign Out</button>
    <p id="account-message" class="form-subtitle account-message"></p>
  `;

  intro.insertAdjacentElement("afterend", section);
}

function ensurePostSection() {
  if (document.getElementById("post-form")) return;

  const gallery = document.getElementById("gallery");
  if (!gallery) return;

  const section = document.createElement("section");
  section.id = "community";
  section.className = "seed-form-section post-section";
  section.innerHTML = `
    <h2 class="section-title">Community Board</h2>
    <p class="form-subtitle">Share updates, ask questions, or find collaborators.</p>

    <form id="post-form">
      <div class="form-group">
        <label for="post-content">Message</label>
        <textarea id="post-content" name="content" rows="3" maxlength="500" placeholder="Share something with the community..." required></textarea>
      </div>
      <div class="post-form-footer">
        <span id="character-count" class="char-count">0 / 500</span>
        <button type="submit" class="seed-submit-btn">Publish Post</button>
      </div>
    </form>

    <p id="post-message" class="form-subtitle account-message"></p>
    <div id="post-feed" class="idea-grid"></div>
  `;

  gallery.insertAdjacentElement("beforebegin", section);
}

function updateAccountUI() {
  const status = document.getElementById("account-status");
  const signOutButton = document.getElementById("sign-out-button");
  const authForms = document.getElementById("auth-forms");
  const postForm = document.getElementById("post-form");
  const postMessage = document.getElementById("post-message");

  if (status) {
    if (currentUser) {
      status.textContent = `Signed in as @${currentUser}`;
      status.className = "account-status signed-in";
    } else {
      status.textContent = "No account signed in.";
      status.className = "account-status";
    }
  }

  if (authForms) {
    authForms.style.display = currentUser ? "none" : "grid";
  }

  if (signOutButton) {
    signOutButton.style.display = currentUser ? "inline-block" : "none";
  }

  if (postForm) {
    postForm.style.display = currentUser ? "block" : "none";
  }

  if (postMessage && !currentUser) {
    postMessage.textContent = "Sign in to publish a post.";
  }
}

function renderPosts() {
  const postFeed = document.getElementById("post-feed");
  if (!postFeed) return;

  postFeed.innerHTML = "";

  posts
    .slice()
    .reverse()
    .forEach((post) => {
      const card = document.createElement("article");
      card.className = "idea-card sprout";
      card.innerHTML = `
        <div class="card-top">
          <div class="growth-icon">
            <span class="icon-symbol">&#128172;</span>
            <span class="stage-label">Post</span>
          </div>
          <span class="availability-badge">${escapeHtml(post.createdAt)}</span>
        </div>
        <h3 class="card-title">${escapeHtml(post.author)}</h3>
        <p class="card-desc">${escapeHtml(post.content)}</p>
      `;
      postFeed.appendChild(card);
    });
}

function showMessage(elementId, text, isSuccess) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = text;
  el.className = `form-subtitle account-message ${isSuccess ? "msg-success" : "msg-error"}`;
  setTimeout(() => {
    el.textContent = "";
    el.className = "form-subtitle account-message";
  }, 4000);
}

function setupAccounts() {
  const createForm = document.getElementById("create-account-form");
  const signInForm = document.getElementById("sign-in-form");
  const signOutButton = document.getElementById("sign-out-button");

  if (createForm) {
    createForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const username = createForm.username.value.trim();
      const password = createForm.password.value;

      const exists = accounts.find(
        (account) => account.username.toLowerCase() === username.toLowerCase()
      );

      if (exists) {
        showMessage("account-message", "That username already exists.", false);
        return;
      }

      accounts.push({
        id: accounts.length + 1,
        username,
        password,
        createdAt: new Date().toLocaleString()
      });

      currentUser = username;
      saveAccounts();
      saveCurrentUser();
      createForm.reset();
      if (signInForm) signInForm.reset();
      showMessage("account-message", `Account created! Signed in as @${username}.`, true);
      updateAccountUI();
    });
  }

  if (signInForm) {
    signInForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const username = signInForm.username.value.trim();
      const password = signInForm.password.value;

      const match = accounts.find(
        (account) =>
          account.username.toLowerCase() === username.toLowerCase() &&
          account.password === password
      );

      if (!match) {
        showMessage("account-message", "Incorrect username or password.", false);
        return;
      }

      currentUser = match.username;
      saveCurrentUser();
      signInForm.reset();
      showMessage("account-message", `Welcome back, @${currentUser}!`, true);
      updateAccountUI();
    });
  }

  if (signOutButton) {
    signOutButton.addEventListener("click", () => {
      currentUser = "";
      saveCurrentUser();
      showMessage("account-message", "Signed out successfully.", true);
      updateAccountUI();
    });
  }
}

function setupSeedForm() {
  const form = document.getElementById("seed-form");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const stageMap = {
      seed: "Seed",
      sprout: "Sprout",
      oak: "Oak"
    };

    const rawNeeds = form.needs.value.trim();
    const newProject = {
      id: projects.length + 1,
      title: form.title.value.trim(),
      description: form.description.value.trim(),
      availability: form.hours.value,
      stage: stageMap[form.stage.value] || "Seed",
      author: form.name.value.trim(),
      needs: rawNeeds
        ? rawNeeds.split(",").map((item) => item.trim()).filter(Boolean)
        : ["Collaborators"]
    };

    projects.push(newProject);
    saveProjects();
    renderGreenhouse();
    form.reset();

    // Scroll to the new card
    const seedVault = document.getElementById("seed-vault");
    if (seedVault && seedVault.lastElementChild) {
      seedVault.lastElementChild.scrollIntoView({ behavior: "smooth", block: "center" });
      seedVault.lastElementChild.classList.add("card-new");
      setTimeout(() => {
        seedVault.lastElementChild.classList.remove("card-new");
      }, 2000);
    }
  });
}

function setupPostForm() {
  const form = document.getElementById("post-form");
  const text = document.getElementById("post-content");
  const counter = document.getElementById("character-count");

  if (text && counter) {
    text.addEventListener("input", () => {
      const len = text.value.length;
      counter.textContent = `${len} / 500`;
      counter.className = len > 450 ? "char-count char-warn" : "char-count";
    });
  }

  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!currentUser) {
      showMessage("post-message", "You need to sign in before posting.", false);
      return;
    }

    const content = form.content.value.trim();

    if (!content || content.length > 500) {
      showMessage("post-message", "Post must be between 1 and 500 characters.", false);
      return;
    }

    posts.push({
      id: posts.length + 1,
      author: `@${currentUser}`,
      content,
      audience: "Public",
      createdAt: new Date().toLocaleString()
    });

    savePosts();
    renderPosts();
    form.reset();
    if (counter) counter.textContent = "0 / 500";
    showMessage("post-message", "Post published!", true);
  });
}

function updateNavLinks() {
  const nav = document.querySelector(".header-nav");
  if (!nav) return;

  // Add nav links for Account and Community sections if not already present
  if (!nav.querySelector('a[href="#accounts"]')) {
    const accountLink = document.createElement("a");
    accountLink.href = "#accounts";
    accountLink.textContent = "Account";
    nav.insertBefore(accountLink, nav.firstChild);
  }

  if (!nav.querySelector('a[href="#community"]')) {
    const communityLink = document.createElement("a");
    communityLink.href = "#community";
    communityLink.textContent = "Community";
    // Insert after Ideas link
    const galleryLink = nav.querySelector('a[href="#gallery"]');
    if (galleryLink) {
      galleryLink.insertAdjacentElement("beforebegin", communityLink);
    } else {
      nav.appendChild(communityLink);
    }
  }
}

function initGreenhouse() {
  ensureAccountSection();
  ensurePostSection();
  updateNavLinks();
  renderGreenhouse();
  renderPosts();
  updateAccountUI();
  setupAccounts();
  setupSeedForm();
  setupPostForm();
}

document.addEventListener("DOMContentLoaded", initGreenhouse);
