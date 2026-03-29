const ACCOUNT_STORAGE_KEY = "greenhouseAccounts";
const SESSION_STORAGE_KEY = "greenhouseCurrentUser";
const POST_STORAGE_KEY = "greenhousePosts";
const PROJECT_STORAGE_KEY = "greenhouseProjects";
const INTEREST_STORAGE_KEY = "greenhouseInterests";
const MESSAGE_STORAGE_KEY = "greenhouseMessages";

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

/* ---- Storage helpers ---- */

let accounts = loadAccounts();
let currentUser = loadCurrentUser();
let posts = loadPosts();
let projects = loadProjects();
let interests = loadInterests();
let messages = loadMessages();

function loadAccounts() {
  const s = localStorage.getItem(ACCOUNT_STORAGE_KEY);
  return s ? JSON.parse(s) : [];
}
function saveAccounts() {
  localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(accounts));
}

function loadCurrentUser() {
  const s = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!s) return null;
  try { return JSON.parse(s); } catch { return null; }
}
function saveCurrentUser() {
  if (currentUser) {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(currentUser));
  } else {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }
}
function getCurrentUsername() {
  return currentUser ? currentUser.username : "";
}
function getCurrentRole() {
  return currentUser ? currentUser.role : "";
}

function loadPosts() {
  const s = localStorage.getItem(POST_STORAGE_KEY);
  return s ? JSON.parse(s) : defaultPosts.slice();
}
function savePosts() {
  localStorage.setItem(POST_STORAGE_KEY, JSON.stringify(posts));
}

function loadProjects() {
  const s = localStorage.getItem(PROJECT_STORAGE_KEY);
  return s ? JSON.parse(s) : defaultProjects.slice();
}
function saveProjects() {
  localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(projects));
}

function loadInterests() {
  const s = localStorage.getItem(INTEREST_STORAGE_KEY);
  return s ? JSON.parse(s) : [];
}
function saveInterests() {
  localStorage.setItem(INTEREST_STORAGE_KEY, JSON.stringify(interests));
}

function loadMessages() {
  const s = localStorage.getItem(MESSAGE_STORAGE_KEY);
  return s ? JSON.parse(s) : [];
}
function saveMessages() {
  localStorage.setItem(MESSAGE_STORAGE_KEY, JSON.stringify(messages));
}

/* ---- Utilities ---- */

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

/* ---- Message Modal ---- */

function ensureMessageModal() {
  if (document.getElementById("message-modal")) return;
  const modal = document.createElement("div");
  modal.id = "message-modal";
  modal.className = "modal-overlay";
  modal.style.display = "none";
  modal.innerHTML = `
    <div class="modal-content">
      <h3 class="section-title" style="font-size:1.4rem;margin-bottom:1rem;">Send a Message</h3>
      <form id="message-form">
        <div class="form-group">
          <label for="msg-to">To</label>
          <input id="msg-to" type="text" readonly>
        </div>
        <div class="form-group">
          <label for="msg-subject">Subject</label>
          <input id="msg-subject" type="text" maxlength="100" required>
        </div>
        <div class="form-group">
          <label for="msg-body">Message</label>
          <textarea id="msg-body" rows="4" maxlength="500" placeholder="Write your message..." required></textarea>
        </div>
        <div class="modal-actions">
          <button type="button" class="seed-submit-btn modal-cancel-btn" id="modal-cancel">Cancel</button>
          <button type="submit" class="seed-submit-btn">Send</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  // Close on backdrop click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeMessageModal();
  });

  document.getElementById("modal-cancel").addEventListener("click", closeMessageModal);

  document.getElementById("message-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const to = document.getElementById("msg-to").value;
    const subject = document.getElementById("msg-subject").value.trim();
    const body = document.getElementById("msg-body").value.trim();

    if (!body) return;

    messages.push({
      id: messages.length + 1,
      from: getCurrentUsername(),
      fromRole: getCurrentRole(),
      to: to,
      subject: subject,
      body: body,
      timestamp: new Date().toLocaleString(),
      read: false
    });

    saveMessages();
    closeMessageModal();
    renderInbox();
    alert("Message sent!");
  });
}

function openMessageModal(recipient, subject) {
  if (!currentUser) {
    alert("Sign in to send messages.");
    return;
  }
  const modal = document.getElementById("message-modal");
  if (!modal) return;
  document.getElementById("msg-to").value = recipient;
  document.getElementById("msg-subject").value = subject || "";
  document.getElementById("msg-body").value = "";
  modal.style.display = "flex";
}

function closeMessageModal() {
  const modal = document.getElementById("message-modal");
  if (modal) modal.style.display = "none";
}

/* ---- Inbox ---- */

function ensureInboxSection() {
  if (document.getElementById("inbox-section")) return;
  const footer = document.querySelector(".greenhouse-footer");
  if (!footer) return;

  const section = document.createElement("section");
  section.id = "inbox-section";
  section.className = "seed-form-section post-section";
  section.innerHTML = `
    <h2 class="section-title">Inbox</h2>
    <p class="form-subtitle">Your direct messages.</p>
    <div id="inbox-feed" class="idea-grid"></div>
    <p id="inbox-empty" class="form-subtitle"></p>
  `;

  footer.insertAdjacentElement("beforebegin", section);
}

function renderInbox() {
  const feed = document.getElementById("inbox-feed");
  const empty = document.getElementById("inbox-empty");
  const section = document.getElementById("inbox-section");
  if (!feed) return;

  // Hide inbox if not signed in
  if (section) {
    section.style.display = currentUser ? "block" : "none";
  }
  if (!currentUser) return;

  const myMessages = messages.filter(
    (m) => m.to.toLowerCase() === getCurrentUsername().toLowerCase() ||
           m.from.toLowerCase() === getCurrentUsername().toLowerCase()
  );

  feed.innerHTML = "";

  if (myMessages.length === 0) {
    if (empty) empty.textContent = "No messages yet.";
    return;
  }
  if (empty) empty.textContent = "";

  myMessages.slice().reverse().forEach((msg) => {
    const card = document.createElement("article");
    const isIncoming = msg.to.toLowerCase() === getCurrentUsername().toLowerCase();
    card.className = "idea-card sprout inbox-card";
    const roleBadge = msg.fromRole === "mentor"
      ? `<span class="role-badge role-mentor">&#127891; Mentor</span>`
      : `<span class="role-badge role-student">&#127793; Student</span>`;
    const direction = isIncoming ? "From" : "To";
    const otherPerson = isIncoming ? msg.from : msg.to;

    card.innerHTML = `
      <div class="card-top">
        <div class="growth-icon">
          <span class="icon-symbol">${isIncoming ? "&#128229;" : "&#128228;"}</span>
          <span class="stage-label">${direction}</span>
        </div>
        <span class="availability-badge">${escapeHtml(msg.timestamp)}</span>
      </div>
      <h3 class="card-title">${escapeHtml(otherPerson)} ${isIncoming ? roleBadge : ""}</h3>
      <p class="card-desc"><strong>${escapeHtml(msg.subject)}</strong></p>
      <p class="card-desc">${escapeHtml(msg.body)}</p>
      ${isIncoming ? `<button class="connect-btn reply-btn" data-creator="${escapeHtml(msg.from)}" data-subject="Re: ${escapeHtml(msg.subject)}">Reply</button>` : ""}
    `;
    feed.appendChild(card);
  });
}

/* ---- Render idea cards (with Interested button) ---- */

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

    const interestCount = interests.filter((i) => i.projectId === project.id).length;
    const interestLabel = interestCount > 0 ? ` (${interestCount})` : "";

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
      <a href="detail.html?id=${project.id}" class="interested-btn">Interested${interestLabel}</a>
    `;

    seedVault.appendChild(article);
  });
}

/* ---- Account section ---- */

function ensureAccountSection() {
  if (document.getElementById("create-account-form")) return;

  const intro = document.querySelector(".dashboard-intro");
  if (!intro) return;

  const section = document.createElement("section");
  section.id = "accounts";
  section.className = "seed-form-section";
  section.innerHTML = `
    <h2 class="section-title">Accounts</h2>
    <p class="form-subtitle">Join as a student with an idea or a mentor who can help.</p>

    <div id="account-status" class="account-status"></div>

    <div id="auth-forms" class="auth-forms">
      <form id="create-account-form" class="auth-form">
        <h3 class="auth-form-title">Create Account</h3>

        <div class="role-picker">
          <button type="button" class="role-btn active" data-role="student">Student / Ideator</button>
          <button type="button" class="role-btn" data-role="mentor">Mentor</button>
        </div>

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

        <input type="hidden" id="create-role" name="role" value="student">

        <div id="mentor-fields" class="mentor-fields" style="display:none;">
          <div class="form-group">
            <label for="create-experience">Experience & Skills</label>
            <textarea id="create-experience" name="experience" rows="3" placeholder="e.g. 5 years mechanical engineering, mentored at FIRST Robotics, fluent in CAD..."></textarea>
          </div>
          <div class="form-group">
            <label for="create-expertise">Area of Expertise</label>
            <select id="create-expertise" name="expertise">
              <option value="">Select one...</option>
              <option value="Engineering">Engineering</option>
              <option value="Design">Design / UX</option>
              <option value="Business">Business / Fundraising</option>
              <option value="Science">Science / Research</option>
              <option value="Technology">Technology / Programming</option>
              <option value="Education">Education / Tutoring</option>
              <option value="Other">Other</option>
            </select>
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

/* ---- Post section ---- */

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

/* ---- UI updates ---- */

function updateAccountUI() {
  const status = document.getElementById("account-status");
  const signOutButton = document.getElementById("sign-out-button");
  const authForms = document.getElementById("auth-forms");
  const postForm = document.getElementById("post-form");
  const postMessage = document.getElementById("post-message");

  if (status) {
    if (currentUser) {
      const roleLabel = currentUser.role === "mentor" ? "Mentor" : "Student";
      const roleEmoji = currentUser.role === "mentor" ? "&#127891;" : "&#127793;";
      let html = `<span class="role-badge role-${currentUser.role}">${roleEmoji} ${roleLabel}</span> Signed in as <strong>@${escapeHtml(currentUser.username)}</strong>`;
      if (currentUser.role === "mentor" && currentUser.expertise) {
        html += ` &mdash; ${escapeHtml(currentUser.expertise)}`;
      }
      status.innerHTML = html;
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

  // Update inbox badge
  if (currentUser) {
    const unread = messages.filter(
      (m) => m.to.toLowerCase() === getCurrentUsername().toLowerCase() && !m.read
    ).length;
    const inboxLink = document.querySelector('a[href="#inbox-section"]');
    if (inboxLink) {
      inboxLink.textContent = unread > 0 ? `Inbox (${unread})` : "Inbox";
    }
  }
}

function renderPosts() {
  const postFeed = document.getElementById("post-feed");
  if (!postFeed) return;

  postFeed.innerHTML = "";

  posts.slice().reverse().forEach((post) => {
    const card = document.createElement("article");
    card.className = "idea-card sprout";
    const roleBadge = post.role === "mentor"
      ? `<span class="role-badge role-mentor">&#127891; Mentor</span>`
      : `<span class="role-badge role-student">&#127793; Student</span>`;
    card.innerHTML = `
      <div class="card-top">
        <div class="growth-icon">
          <span class="icon-symbol">&#128172;</span>
          <span class="stage-label">Post</span>
        </div>
        <span class="availability-badge">${escapeHtml(post.createdAt)}</span>
      </div>
      <h3 class="card-title">${escapeHtml(post.author)} ${roleBadge}</h3>
      <p class="card-desc">${escapeHtml(post.content)}</p>
    `;
    postFeed.appendChild(card);
  });
}

/* ---- Setup functions ---- */

function setupRolePicker() {
  const roleBtns = document.querySelectorAll(".role-btn");
  const roleInput = document.getElementById("create-role");
  const mentorFields = document.getElementById("mentor-fields");

  roleBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      roleBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const role = btn.dataset.role;
      roleInput.value = role;
      if (mentorFields) {
        mentorFields.style.display = role === "mentor" ? "block" : "none";
        const expField = document.getElementById("create-experience");
        if (expField) expField.required = role === "mentor";
      }
    });
  });
}

function setupAccounts() {
  const createForm = document.getElementById("create-account-form");
  const signInForm = document.getElementById("sign-in-form");
  const signOutButton = document.getElementById("sign-out-button");

  setupRolePicker();

  if (createForm) {
    createForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const username = createForm.username.value.trim();
      const password = createForm.password.value;
      const role = createForm.role.value;

      const exists = accounts.find(
        (a) => a.username.toLowerCase() === username.toLowerCase()
      );

      if (exists) {
        showMessage("account-message", "That username already exists.", false);
        return;
      }

      const account = {
        id: accounts.length + 1,
        username,
        password,
        role,
        createdAt: new Date().toLocaleString()
      };

      if (role === "mentor") {
        account.experience = createForm.experience.value.trim();
        account.expertise = createForm.expertise.value;
        if (!account.experience) {
          showMessage("account-message", "Mentors must fill out their experience.", false);
          return;
        }
      }

      accounts.push(account);
      currentUser = { username, role, expertise: account.expertise || "" };
      saveAccounts();
      saveCurrentUser();
      createForm.reset();
      document.querySelectorAll(".role-btn").forEach((b) => b.classList.remove("active"));
      document.querySelector('.role-btn[data-role="student"]').classList.add("active");
      document.getElementById("mentor-fields").style.display = "none";
      document.getElementById("create-role").value = "student";

      if (signInForm) signInForm.reset();
      const roleLabel = role === "mentor" ? "Mentor" : "Student";
      showMessage("account-message", `${roleLabel} account created! Signed in as @${username}.`, true);
      updateAccountUI();
      renderInbox();
    });
  }

  if (signInForm) {
    signInForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const username = signInForm.username.value.trim();
      const password = signInForm.password.value;

      const match = accounts.find(
        (a) => a.username.toLowerCase() === username.toLowerCase() && a.password === password
      );

      if (!match) {
        showMessage("account-message", "Incorrect username or password.", false);
        return;
      }

      currentUser = { username: match.username, role: match.role, expertise: match.expertise || "" };
      saveCurrentUser();
      signInForm.reset();
      const roleLabel = match.role === "mentor" ? "Mentor" : "Student";
      showMessage("account-message", `Welcome back, @${match.username}! (${roleLabel})`, true);
      updateAccountUI();
      renderInbox();
    });
  }

  if (signOutButton) {
    signOutButton.addEventListener("click", () => {
      currentUser = null;
      saveCurrentUser();
      showMessage("account-message", "Signed out successfully.", true);
      updateAccountUI();
      renderInbox();
    });
  }
}

function setupSeedForm() {
  const form = document.getElementById("seed-form");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const stageMap = { seed: "Seed", sprout: "Sprout", oak: "Oak" };
    const rawNeeds = form.needs.value.trim();
    const newProject = {
      id: Date.now(),
      title: form.title.value.trim(),
      description: form.description.value.trim(),
      availability: form.hours.value,
      stage: stageMap[form.stage.value] || "Seed",
      author: form.name.value.trim(),
      creatorUsername: getCurrentUsername(),
      needs: rawNeeds
        ? rawNeeds.split(",").map((item) => item.trim()).filter(Boolean)
        : ["Collaborators"]
    };

    projects.push(newProject);
    saveProjects();
    renderGreenhouse();
    form.reset();

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
      author: `@${getCurrentUsername()}`,
      content,
      role: getCurrentRole(),
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

/* ---- Global click handler for connect/reply buttons ---- */

function setupGlobalClicks() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".connect-btn");
    if (btn) {
      const creator = btn.dataset.creator || "";
      const subject = btn.dataset.subject || "";
      openMessageModal(creator, subject);
    }
  });
}

/* ---- Nav ---- */

function updateNavLinks() {
  const nav = document.querySelector(".header-nav");
  if (!nav) return;

  if (!nav.querySelector('a[href="#accounts"]')) {
    const link = document.createElement("a");
    link.href = "#accounts";
    link.textContent = "Account";
    nav.insertBefore(link, nav.firstChild);
  }

  if (!nav.querySelector('a[href="#community"]')) {
    const link = document.createElement("a");
    link.href = "#community";
    link.textContent = "Community";
    const galleryLink = nav.querySelector('a[href="#gallery"]');
    if (galleryLink) {
      galleryLink.insertAdjacentElement("beforebegin", link);
    } else {
      nav.appendChild(link);
    }
  }

  if (!nav.querySelector('a[href="#inbox-section"]')) {
    const link = document.createElement("a");
    link.href = "#inbox-section";
    link.textContent = "Inbox";
    nav.appendChild(link);
  }
}

/* ---- Detail page (detail.html) ---- */

function initDetailPage() {
  const container = document.getElementById("project-detail");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const projectId = parseInt(params.get("id"), 10);
  const project = projects.find((p) => p.id === projectId);

  if (!project) {
    container.innerHTML = `
      <div class="detail-card">
        <p>Project not found.</p>
        <a href="index.html" class="back-link">&larr; Back to the Garden</a>
      </div>`;
    return;
  }

  const needsMarkup = project.needs
    .map((need) => `<li class="resource-tag">[Need: ${escapeHtml(need)}]</li>`)
    .join("");

  const projectInterests = interests.filter((i) => i.projectId === projectId);
  const alreadyInterested = currentUser && projectInterests.some(
    (i) => i.username.toLowerCase() === getCurrentUsername().toLowerCase()
  );

  let interestListMarkup = "";
  if (projectInterests.length > 0) {
    interestListMarkup = `
      <div class="interest-list">
        <h4>People Interested (${projectInterests.length})</h4>
        <ul>
          ${projectInterests.map((i) => `<li><strong>@${escapeHtml(i.username)}</strong> <span class="role-badge role-${i.role}">${i.role === "mentor" ? "&#127891; Mentor" : "&#127793; Student"}</span> &mdash; ${escapeHtml(i.timestamp)}</li>`).join("")}
        </ul>
      </div>`;
  }

  const connectTarget = project.creatorUsername || project.author;

  container.innerHTML = `
    <a href="index.html" class="back-link">&larr; Back to the Garden</a>
    <div class="detail-card ${getStageClass(project.stage)}">
      <div class="card-top">
        <div class="growth-icon">
          <span class="icon-symbol" style="font-size:2.5rem;">${getStageIcon(project.stage)}</span>
          <span class="stage-label">${escapeHtml(project.stage)}</span>
        </div>
        <span class="availability-badge">${escapeHtml(project.availability)}</span>
      </div>
      <h2 class="detail-title">${escapeHtml(project.title)}</h2>
      <p class="detail-desc">${escapeHtml(project.description)}</p>
      <div class="card-author" style="font-size:1rem;margin-bottom:1rem;">by <strong>${escapeHtml(project.author)}</strong></div>
      <ul class="resource-requests" style="margin-bottom:1.25rem;">
        ${needsMarkup}
      </ul>

      <div class="detail-actions">
        <button id="interest-btn" class="interested-btn ${alreadyInterested ? "interested-active" : ""}">
          ${alreadyInterested ? "You're Interested!" : "Express Interest"}
        </button>
        <button class="connect-btn" data-creator="${escapeHtml(connectTarget)}" data-subject="Re: ${escapeHtml(project.title)}">
          Message ${escapeHtml(project.author.split(",")[0])}
        </button>
      </div>

      ${interestListMarkup}
    </div>
  `;

  // Express interest button
  document.getElementById("interest-btn").addEventListener("click", () => {
    if (!currentUser) {
      alert("Sign in to express interest.");
      return;
    }

    const already = interests.some(
      (i) => i.projectId === projectId && i.username.toLowerCase() === getCurrentUsername().toLowerCase()
    );
    if (already) return;

    interests.push({
      projectId,
      username: getCurrentUsername(),
      role: getCurrentRole(),
      timestamp: new Date().toLocaleString()
    });
    saveInterests();
    // Re-render detail page
    initDetailPage();
  });
}

/* ---- Main init ---- */

function initGreenhouse() {
  ensureAccountSection();
  ensurePostSection();
  ensureInboxSection();
  ensureMessageModal();
  updateNavLinks();
  renderGreenhouse();
  renderPosts();
  renderInbox();
  updateAccountUI();
  setupAccounts();
  setupSeedForm();
  setupPostForm();
  setupGlobalClicks();
}

document.addEventListener("DOMContentLoaded", () => {
  initGreenhouse();
  initDetailPage();
});
