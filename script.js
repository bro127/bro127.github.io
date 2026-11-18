// BKHAWK — Certification Studio client
// Serves the landing page, the portal (app.html) and the admin console.
// All public copy routes through window.BK.t() so the Amharic/English switch
// re-renders live panels, not just static markup.

// Same-origin by default: the portal and its API are served by one process,
// so /api/... resolves on localhost, tunnels and hosted deploys alike.
// Override only when the UI is opened from a different origin than the API.
const API_BASE = window.BKHAWK_API_BASE || "";
const ADMIN_KEY = "bkhawk2026";
const TELEGRAM_MANUAL = "https://t.me/nameofbless";

let activeSubmissionId = null;
let pollTimer = null;
let adminRefreshTimer = null;
let cachedSubmissions = [];
let lastRenderedSub = null;

/* ---------------------------------------------------------------- */
/* Utilities                                                         */
/* ---------------------------------------------------------------- */

function t(key, vars) {
  if (window.BK && typeof window.BK.t === "function") return window.BK.t(key, vars);
  return key;
}

function esc(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Fill {placeholders} in strings that need runtime values. */
function fmt(template, vars) {
  let out = String(template);
  Object.keys(vars || {}).forEach((name) => {
    out = out.split(`{${name}}`).join(String(vars[name]));
  });
  return out;
}

function getAdminKey() {
  return sessionStorage.getItem("bkhawk_admin_key") || "";
}

function notify(message, type = "ok") {
  let root = document.querySelector(".toast-root");
  if (!root) {
    root = document.createElement("div");
    root.className = "toast-root";
    root.setAttribute("role", "status");
    root.setAttribute("aria-live", "polite");
    document.body.appendChild(root);
  }

  const toast = document.createElement("div");
  toast.className = "toast" + (type === "error" ? " toast-error" : "");
  const icon = document.createElement("span");
  icon.className = "toast-ic";
  icon.textContent = type === "error" ? "!" : "✓";
  const text = document.createElement("span");
  text.textContent = message;
  toast.append(icon, text);
  root.appendChild(toast);

  while (root.children.length > 3) root.removeChild(root.firstElementChild);

  setTimeout(() => {
    toast.classList.add("toast-out");
    setTimeout(() => toast.remove(), 320);
  }, 3600);
}

async function copyText(text, successMessage) {
  try {
    await navigator.clipboard.writeText(text);
    notify(successMessage);
  } catch (err) {
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    const copied = document.execCommand && document.execCommand("copy");
    field.remove();
    if (copied) notify(successMessage);
    else notify(t("toast.copyFail"), "error");
  }
}

function copyAccepterNumber() {
  const num = (document.getElementById("telebirrNumber")?.innerText || "").trim() || "+251960756111";
  copyText(num, fmt(t("toast.copied"), { value: num }));
}

function copySubmissionId() {
  const id = document.getElementById("resSubId")?.innerText.trim();
  if (!id || id === "BK-XXXXXX") {
    notify(t("toast.noId"), "error");
    return;
  }
  copyText(id, fmt(t("toast.copied"), { value: id }));
}

function copyReleasedPassword() {
  const value = document.getElementById("releasedPassword")?.innerText.trim();
  if (!value) {
    notify(t("toast.noPassword"), "error");
    return;
  }
  copyText(value, fmt(t("toast.copied"), { value: "Password" }));
}

/* ---------------------------------------------------------------- */
/* Theme, reveal, nav, tabs                                          */
/* ---------------------------------------------------------------- */

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem("bkhawk_theme", theme);
  } catch (e) {}
  const toggle = document.getElementById("themeToggle");
  if (toggle) {
    toggle.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
  }
}

function setupTheme() {
  const toggle = document.getElementById("themeToggle");
  if (!toggle) return;
  toggle.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(next);
  });
}

function setupReveal() {
  const targets = document.querySelectorAll("[data-reveal]");
  if (!targets.length) return;

  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("in"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  targets.forEach((el) => observer.observe(el));
}

function setupNav() {
  const nav = document.getElementById("navbar");
  if (!nav) return;
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* Two-panel portal: intake and status live on separate tabs, not one scroll. */
function showTab(name, { scroll = false } = {}) {
  const tabs = document.querySelectorAll(".app-tab");
  const panels = document.querySelectorAll(".app-panel");
  if (!tabs.length || !panels.length) return;

  const target = name === "status" ? "status" : "intake";

  tabs.forEach((tab) => {
    const active = tab.dataset.tab === target;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", active ? "true" : "false");
  });

  panels.forEach((panel) => {
    const active = panel.id === (target === "status" ? "panelStatus" : "panelIntake");
    panel.classList.toggle("active", active);
  });

  if (scroll) {
    const el = target === "status" ? document.getElementById("panelStatus") : document.getElementById("panelIntake");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (history.replaceState) {
    history.replaceState(null, "", `#${target}`);
  }
}

function setupTabs() {
  const tabs = document.querySelectorAll(".app-tab");
  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => showTab(tab.dataset.tab, { scroll: true }));
  });

  document.querySelectorAll("[data-tab-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      showTab(link.dataset.tabLink, { scroll: true });
    });
  });

  const initial = location.hash.replace("#", "");
  if (initial === "status" || initial === "intake") {
    showTab(initial);
  }
}

/* ---------------------------------------------------------------- */
/* Candidate submission                                              */
/* ---------------------------------------------------------------- */

function setSubmitState(disabled, label) {
  const btn = document.getElementById("submitBtn");
  if (!btn) return;
  btn.disabled = disabled;
  btn.textContent = label;
}

function setupSubmissionForm() {
  const form = document.getElementById("submissionForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("candidateName").value.trim();
    const email = document.getElementById("candidateEmail").value.trim();
    const password = document.getElementById("candidatePassword").value.trim();
    const phone = document.getElementById("candidatePhone").value.trim();

    const checked = document.querySelectorAll('input[name="track"]:checked');
    const courses = Array.from(checked).map((box) => box.value);

    if (!name || !email || !password || !phone) {
      notify(t("toast.needFields"), "error");
      return;
    }
    if (courses.length === 0) {
      notify(t("toast.needTrack"), "error");
      return;
    }

    setSubmitState(true, t("form.submitting"));

    try {
      const res = await fetch(`${API_BASE}/api/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone, courses, fee_etb: 50 }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Submission failed");

      activeSubmissionId = data.submission_id;
      localStorage.setItem("bkhawk_last_sub_id", activeSubmissionId);

      const pendingCard = document.getElementById("pendingResultCard");
      const idEl = document.getElementById("resSubId");
      const timeEl = document.getElementById("resSubmitTime");
      const nameEl = document.getElementById("resCandidateName");

      if (idEl) idEl.textContent = activeSubmissionId;
      if (timeEl) timeEl.textContent = data.created_at_fmt || new Date().toISOString();
      if (nameEl) nameEl.textContent = name;
      if (pendingCard) {
        pendingCard.style.display = "block";
        pendingCard.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      setSubmitState(true, t("form.submitted"));
      notify(t("toast.submitted"));
      startStatusPolling(activeSubmissionId);
    } catch (err) {
      notify(`${err.message}`, "error");
      setSubmitState(false, t("form.submit"));
    }
  });
}

function startStatusPolling(subId) {
  if (pollTimer) clearInterval(pollTimer);
  pollTimer = setInterval(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/submission/${subId}`);
      if (!res.ok) return;
      const sub = await res.json();

      if (sub.status === "RELEASED") {
        clearInterval(pollTimer);
        notify(t("toast.released"));
        checkCurrentStatus();
      } else if (sub.status === "APPROVED") {
        clearInterval(pollTimer);
        notify(t("toast.approved"));
        checkCurrentStatus();
      } else if (sub.status === "FAILED") {
        clearInterval(pollTimer);
        notify(t("toast.failed"), "error");
      }
    } catch (e) {}
  }, 6000);
}

function checkCurrentStatus() {
  const subId = activeSubmissionId || localStorage.getItem("bkhawk_last_sub_id");
  if (!subId) {
    notify(t("toast.noActive"), "error");
    return;
  }
  const lookupInput = document.getElementById("lookupIdInput");
  if (lookupInput) {
    lookupInput.value = subId;
    showTab("status", { scroll: true });
    lookupSubmission();
  }
}

/* ---------------------------------------------------------------- */
/* Status lookup                                                     */
/* ---------------------------------------------------------------- */

function statusBadge(status) {
  const map = {
    RUNNING: "badge-cyan",
    APPROVED: "badge-gold",
    PAYMENT_SUBMITTED: "badge-cyan",
    RELEASED: "badge-emerald",
    COMPLETED: "badge-emerald",
    FAILED: "badge-red",
  };
  const key = {
    RUNNING: "badge.running",
    APPROVED: "badge.approved",
    PAYMENT_SUBMITTED: "badge.payreview",
    RELEASED: "badge.released",
    COMPLETED: "badge.released",
    FAILED: "badge.failed",
  }[status] || "badge.pending";
  const cls = map[status] || "badge-gold";
  return `<span class="badge ${cls}">${esc(t(key))}</span>`;
}

function stageTracker(status) {
  const released = status === "RELEASED" || status === "COMPLETED";
  const active = { PENDING: 2, RUNNING: 2, APPROVED: 3, PAYMENT_SUBMITTED: 3, FAILED: 2 }[status] || 2;
  const labels = [t("step.submitted"), t("step.review"), t("step.approved"), t("step.claim")];

  return `<div class="step-tracker">${labels
    .map((label, index) => {
      const step = index + 1;
      const done = released || step < active;
      const current = !done && step === active;
      const cls = done ? "completed" : current ? "active" : "";
      return `<div class="step-item ${cls}">
        <div class="step-circle">${done ? "✓" : step}</div>
        <div class="step-text">${esc(label)}</div>
      </div>`;
    })
    .join("")}</div>`;
}

function claimPanel(sub) {
  const fee = sub.fee_etb || 50;
  return `<div class="claim-card">
    <div class="claim-head">
      <span class="claim-eyebrow">${esc(t("claim.eyebrow"))}</span>
      <span class="claim-amount">${esc(fee)} ETB</span>
    </div>
    <p class="claim-copy">${fmt(t("claim.copy"), { fee: esc(fee) })}</p>
    <div class="claim-number">
      <span>+251960756111</span>
      <span class="receiver">BKHAWK</span>
      <button type="button" class="copy-btn" data-copy-number>${esc(t("app.copy"))}</button>
    </div>
    <div class="claim-form">
      <input type="text" class="form-input" id="claimRefInput" data-sub="${esc(sub.id)}" placeholder="${esc(t("claim.reference"))}">
      <button type="button" class="btn btn-primary" id="claimBtn" data-submit-claim>${esc(t("claim.submit"))}</button>
    </div>
    <p class="claim-manual">${t("claim.manual")}</p>
  </div>`;
}

function releasePanel(sub) {
  const password = sub.escrow_password || sub.password || "";
  const rotated = Boolean(sub.escrow_password);

  return `<div class="release-card">
    <div class="release-head">
      <span class="release-title">${esc(t("release.title"))}</span>
      <span class="badge badge-emerald">${esc(t("release.unlocked"))}</span>
    </div>
    <div class="secret-box">
      <span class="secret-label">${esc(rotated ? t("release.newPassword") : t("release.password"))}</span>
      <div class="secret-row">
        <span class="secret-value" id="releasedPassword">${esc(password)}</span>
        <button type="button" class="copy-btn" data-copy-password>${esc(t("release.copy"))}</button>
      </div>
      <div class="secret-row">
        <span class="secret-label">${esc(t("release.account"))}</span>
        <span class="secret-value secret-email">${esc(sub.email)}</span>
      </div>
    </div>
    <p class="release-note">${esc(rotated ? t("release.rotated") : t("release.same"))}</p>
    ${renderCerts(sub)}
  </div>`;
}

function renderCerts(sub) {
  const results = Array.isArray(sub.results) ? sub.results : [];
  const downloadBase = `${API_BASE}/download`;

  if (results.length === 0) {
    return `<div class="stage-note"><span class="dot"></span><span>${t("release.empty")}</span></div>`;
  }

  const rows = results
    .map((entry) => {
      const file = entry.zip_path || entry.pdf_path;
      const label = entry.zip_path ? t("release.download.zip") : t("release.download.pdf");
      const fileName = file ? String(file).split("/").pop() : "";
      const download = fileName
        ? `<a class="btn btn-secondary" href="${downloadBase}/${encodeURIComponent(fileName)}?sub_id=${encodeURIComponent(sub.id)}" target="_blank" rel="noopener">${esc(label)}</a>`
        : "";
      const verify = entry.official_url
        ? `<a class="btn btn-primary" href="${esc(entry.official_url)}" target="_blank" rel="noopener">${esc(t("release.verify"))}</a>`
        : "";
      return `<div class="cert-row">
        <span>${esc(entry.course_title || "Certificate")}</span>
        <div class="cert-actions">${download}${verify}</div>
      </div>`;
    })
    .join("");

  return `<div class="cert-list">
    <h4>${esc(t("release.certs"))}</h4>
    <div class="cert-items">${rows}</div>
  </div>`;
}

function stageContent(sub) {
  switch (sub.status) {
    case "APPROVED":
      return claimPanel(sub);

    case "PAYMENT_SUBMITTED":
      return `<div class="stage-note"><span class="dot"></span><span>${fmt(t("claim.verifiedNote"), {
        ref: esc(sub.telebirr_ref || ""),
      })}</span></div>`;

    case "RELEASED":
    case "COMPLETED":
      return releasePanel(sub);

    case "FAILED":
      return `<div class="stage-note"><span class="dot dot-danger"></span><span>${t("note.failed")}</span></div>`;

    case "RUNNING":
      return `<div class="stage-note"><span class="dot dot-info"></span><span>${esc(t("note.running"))}</span></div>`;

    default:
      return `<div class="stage-note"><span class="dot"></span><span>${esc(t("note.pending"))}</span></div>`;
  }
}

async function submitClaim() {
  const input = document.getElementById("claimRefInput");
  const btn = document.getElementById("claimBtn");
  const subId = input?.dataset.sub;
  const reference = input?.value.trim();

  if (!subId) return;
  if (!reference || reference.length < 6) {
    notify(t("claim.short"), "error");
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.textContent = t("claim.sending");
  }

  try {
    const res = await fetch(`${API_BASE}/api/claim/${encodeURIComponent(subId)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telebirr_ref: reference }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Claim failed");

    notify(t("claim.ok"));
    lookupSubmission();
  } catch (err) {
    notify(err.message, "error");
    if (btn) {
      btn.disabled = false;
      btn.textContent = t("claim.submit");
    }
  }
}

function renderLookupResult(sub) {
  const resultBox = document.getElementById("lookupResultBox");
  if (!resultBox || !sub) return;
  lastRenderedSub = sub;

  const refRow = sub.telebirr_ref
    ? `<div class="meta-row">
         <span class="meta-label">${esc(t("meta.reference"))}</span>
         <span class="meta-value">${esc(sub.telebirr_ref)}</span>
       </div>`
    : "";

  resultBox.innerHTML = `
    <div class="result-head">
      <div>
        <span class="result-id">${esc(sub.id)}</span>
        <span class="result-sub">${esc(t("meta.submitted"))} ${esc(sub.created_at_fmt || "—")}</span>
      </div>
      ${statusBadge(sub.status)}
    </div>
    ${stageTracker(sub.status)}
    <div class="meta-box meta-box-flush">
      <div class="meta-row">
        <span class="meta-label">${esc(t("meta.candidate"))}</span>
        <span class="meta-value">${esc(sub.name)} · ${esc(sub.email)}</span>
      </div>
      <div class="meta-row">
        <span class="meta-label">${esc(t("meta.tracks"))}</span>
        <span class="meta-value">${esc((sub.courses || []).join(", ") || "—")}</span>
      </div>
      ${refRow}
      ${
        sub.notes
          ? `<div class="meta-row">
               <span class="meta-label">${esc(t("meta.notes"))}</span>
               <span class="meta-value meta-note">${esc(sub.notes)}</span>
             </div>`
          : ""
      }
    </div>
    ${stageContent(sub)}`;
}

async function lookupSubmission() {
  const input = document.getElementById("lookupIdInput");
  const resultBox = document.getElementById("lookupResultBox");
  const id = input?.value?.trim().toUpperCase();

  if (!resultBox) return;
  if (!id) {
    notify(t("toast.enterId"), "error");
    return;
  }

  resultBox.style.display = "block";
  resultBox.innerHTML = `<p class="result-note">${esc(t("status.querying"))}</p>`;

  try {
    const res = await fetch(`${API_BASE}/api/submission/${id}`);

    if (!res.ok) {
      resultBox.innerHTML = `
        <div class="result-error">
          <strong>${esc(t("status.notfound"))}</strong>
          <p>${fmt(t("status.notfoundbody"), { id: esc(id) })}</p>
        </div>`;
      lastRenderedSub = null;
      return;
    }

    const sub = await res.json();
    renderLookupResult(sub);
  } catch (err) {
    resultBox.innerHTML = `<p class="result-note result-note-error">${esc(t("status.error"))}: ${esc(err.message)}</p>`;
  }
}

/* ---------------------------------------------------------------- */
/* Admin console                                                     */
/* ---------------------------------------------------------------- */

function checkAdminAuth() {
  const gate = document.getElementById("authGate");
  const dash = document.getElementById("adminDashboard");
  const logout = document.getElementById("logoutBtn");

  if (getAdminKey() === ADMIN_KEY) {
    if (gate) gate.style.display = "none";
    if (dash) dash.style.display = "block";
    if (logout) logout.style.display = "inline-flex";
    fetchAdminSubmissions();
    startAdminAutoRefresh();
  } else {
    if (gate) gate.style.display = "block";
    if (dash) dash.style.display = "none";
    if (logout) logout.style.display = "none";
  }
}

function unlockAdmin() {
  const input = document.getElementById("adminKeyInput");
  const err = document.getElementById("authError");
  const val = input ? input.value.trim() : "";

  if (val === ADMIN_KEY) {
    sessionStorage.setItem("bkhawk_admin_key", val);
    if (err) err.style.display = "none";
    checkAdminAuth();
    notify("Console unlocked");
  } else if (err) {
    err.style.display = "block";
  }
}

function adminLogout() {
  sessionStorage.removeItem("bkhawk_admin_key");
  if (adminRefreshTimer) clearInterval(adminRefreshTimer);
  checkAdminAuth();
}

function startAdminAutoRefresh() {
  if (adminRefreshTimer) clearInterval(adminRefreshTimer);
  adminRefreshTimer = setInterval(() => {
    if (getAdminKey() === ADMIN_KEY) fetchAdminSubmissions(true);
  }, 10000);
}

function adminStatusBadge(status) {
  switch (status) {
    case "RUNNING":
      return '<span class="badge badge-cyan">Running</span>';
    case "APPROVED":
      return '<span class="badge badge-gold">Ready to pay</span>';
    case "PAYMENT_SUBMITTED":
      return '<span class="badge badge-cyan">Payment review</span>';
    case "RELEASED":
    case "COMPLETED":
      return '<span class="badge badge-emerald">Released</span>';
    case "FAILED":
      return '<span class="badge badge-red">Failed</span>';
    default:
      return '<span class="badge badge-gold">Pending</span>';
  }
}

async function fetchAdminSubmissions(silent = false) {
  const key = getAdminKey();
  if (!key) return;

  const tbody = document.getElementById("submissionsTableBody");
  if (!silent && tbody) {
    tbody.innerHTML = '<tr><td colspan="7" class="admin-empty">Loading queue…</td></tr>';
  }

  try {
    const res = await fetch(`${API_BASE}/api/admin/submissions?key=${encodeURIComponent(key)}`);
    if (!res.ok) {
      if (res.status === 401) {
        adminLogout();
        return;
      }
      throw new Error("Failed to fetch submissions");
    }

    const submissions = await res.json();
    cachedSubmissions = submissions;

    let pendingCount = 0;
    let awaitingPayment = 0;
    let releasedCount = 0;

    submissions.forEach((s) => {
      if (s.status === "PENDING") pendingCount++;
      else if (s.status === "APPROVED" || s.status === "PAYMENT_SUBMITTED") awaitingPayment++;
      else if (s.status === "RELEASED" || s.status === "COMPLETED") releasedCount++;
    });

    const statTotal = document.getElementById("statTotal");
    const statPending = document.getElementById("statPending");
    const statAwaiting = document.getElementById("statAwaiting");
    const statReleased = document.getElementById("statReleased");

    if (statTotal) statTotal.textContent = submissions.length;
    if (statPending) statPending.textContent = pendingCount;
    if (statAwaiting) statAwaiting.textContent = awaitingPayment;
    if (statReleased) statReleased.textContent = releasedCount;

    if (!tbody) return;

    if (submissions.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="admin-empty">No candidate submissions in queue.</td></tr>';
      return;
    }

    tbody.innerHTML = submissions
      .map((sub) => {
        const canRun = sub.status === "PENDING" || sub.status === "FAILED";
        const canApprove = sub.status === "PENDING" || sub.status === "FAILED";
        const canRelease = sub.status === "APPROVED" || sub.status === "PAYMENT_SUBMITTED";
        return `
          <tr>
            <td><strong class="admin-id">${esc(sub.id)}</strong></td>
            <td><span class="admin-stamp">${esc(sub.created_at_fmt)}</span></td>
            <td>
              <div class="admin-name">${esc(sub.name)}</div>
              <div class="admin-email">${esc(sub.email)}</div>
            </td>
            <td><span class="admin-phone">${esc(sub.phone)}</span></td>
            <td><span class="admin-ref">${esc(sub.telebirr_ref || "—")}</span></td>
            <td>${adminStatusBadge(sub.status)}</td>
            <td>
              <div class="admin-actions">
                <button class="btn btn-secondary btn-sm" onclick="inspectSubmission('${esc(sub.id)}')">Inspect</button>
                ${canRun ? `<button class="btn btn-primary btn-sm" onclick="runAdminExecution('${esc(sub.id)}')">Run</button>` : ""}
                ${canApprove ? `<button class="btn btn-admin btn-sm" onclick="setApproved('${esc(sub.id)}')">Approve</button>` : ""}
                ${canRelease ? `<button class="btn btn-primary btn-sm" onclick="setReleased('${esc(sub.id)}')">Release</button>` : ""}
                ${
                  sub.status !== "RUNNING"
                    ? `<button class="btn btn-secondary btn-sm admin-delete" onclick="deleteSubmission('${esc(sub.id)}')" aria-label="Delete ${esc(sub.id)}">×</button>`
                    : ""
                }
              </div>
            </td>
          </tr>`;
      })
      .join("");
  } catch (err) {
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="7" class="admin-empty admin-empty-error">Error: ${esc(err.message)}</td></tr>`;
    }
  }
}

async function runAdminExecution(subId) {
  const key = getAdminKey();
  if (!confirm(`Trigger the certification solver for ${subId}? It will be marked approved when finished.`)) return;

  try {
    const res = await fetch(`${API_BASE}/api/admin/execute/${subId}?key=${encodeURIComponent(key)}`, {
      method: "POST",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Failed to trigger execution");
    notify(data.message || "Automation started");
    fetchAdminSubmissions();
  } catch (e) {
    notify(e.message, "error");
  }
}

async function setApproved(subId) {
  const key = getAdminKey();
  const notes = prompt("Approval notes (optional):", "Tracks approved. 50 ETB due at claim.");
  if (notes === null) return;

  try {
    const res = await fetch(`${API_BASE}/api/admin/update-status/${subId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "APPROVED", notes, key }),
    });
    if (!res.ok) throw new Error("Failed to approve submission");
    notify(`${subId} approved — payment claim open`);
    fetchAdminSubmissions();
  } catch (e) {
    notify(e.message, "error");
  }
}

async function setReleased(subId) {
  const key = getAdminKey();
  if (!confirm(`Confirm payment for ${subId} and release the password + certificates?`)) return;

  const notes = prompt("Release notes (optional):", "Payment verified. Package released.");
  if (notes === null) return;

  try {
    const res = await fetch(`${API_BASE}/api/admin/update-status/${subId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "RELEASED", notes, key }),
    });
    if (!res.ok) throw new Error("Failed to release submission");
    notify(`${subId} released`);
    fetchAdminSubmissions();
  } catch (e) {
    notify(e.message, "error");
  }
}

async function deleteSubmission(subId) {
  const key = getAdminKey();
  if (!confirm(`Permanently delete submission ${subId}?`)) return;

  try {
    const res = await fetch(`${API_BASE}/api/admin/submission/${subId}?key=${encodeURIComponent(key)}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete submission");
    notify(`${subId} deleted`);
    fetchAdminSubmissions();
  } catch (e) {
    notify(e.message, "error");
  }
}

function inspectSubmission(subId) {
  const sub = cachedSubmissions.find((s) => s.id === subId);
  if (!sub) return;

  const modal = document.getElementById("inspectModal");
  const body = document.getElementById("modalDetailsBody");
  if (!modal || !body) return;

  body.innerHTML = `
    <div class="meta-box meta-box-flush">
      <div class="meta-row"><span class="meta-label">Submission ID</span><span class="meta-value">${esc(sub.id)}</span></div>
      <div class="meta-row"><span class="meta-label">Submitted</span><span class="meta-value">${esc(sub.created_at_fmt)}</span></div>
      <div class="meta-row"><span class="meta-label">Name</span><span class="meta-value">${esc(sub.name)}</span></div>
      <div class="meta-row"><span class="meta-label">Email</span><span class="meta-value">${esc(sub.email)}</span></div>
      <div class="meta-row"><span class="meta-label">Password</span><span class="meta-value meta-password">${esc(sub.password)}</span></div>
      <div class="meta-row"><span class="meta-label">Escrow password</span><span class="meta-value">${esc(sub.escrow_password || "not rotated")}</span></div>
      <div class="meta-row"><span class="meta-label">Phone</span><span class="meta-value">${esc(sub.phone)}</span></div>
      <div class="meta-row"><span class="meta-label">Telebirr ref</span><span class="meta-value">${esc(sub.telebirr_ref || "None")}</span></div>
      <div class="meta-row"><span class="meta-label">Courses</span><span class="meta-value">${esc((sub.courses || []).join(", "))}</span></div>
      <div class="meta-row"><span class="meta-label">Status</span><span class="meta-value">${esc(sub.status)}</span></div>
      <div class="meta-row"><span class="meta-label">Notes</span><span class="meta-value">${esc(sub.notes || "None")}</span></div>
    </div>
    ${
      sub.results && sub.results.length > 0
        ? `<div class="cert-list cert-list-flush">
             <h4>Certificates generated</h4>
             <ul class="admin-cert-list">
               ${sub.results
                 .map(
                   (r) =>
                     `<li>${esc(r.course_title)}${r.official_url ? ` — <a href="${esc(r.official_url)}" target="_blank" rel="noopener">official link</a>` : ""}</li>`
                 )
                 .join("")}
             </ul>
           </div>`
        : ""
    }`;

  modal.style.display = "grid";
}

function closeModal() {
  const modal = document.getElementById("inspectModal");
  if (modal) modal.style.display = "none";
}

/* ---------------------------------------------------------------- */
/* Boot                                                              */
/* ---------------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  setupTheme();
  setupReveal();
  setupNav();
  setupTabs();
  setupSubmissionForm();

  // Delegated actions — the panels are re-rendered on every lookup and on
  // language change, so inline handlers would rot.
  document.addEventListener("click", (event) => {
    const target = event.target.closest(
      "[data-copy-number], [data-copy-id], [data-copy-password], [data-open-status], [data-submit-claim]"
    );
    if (!target) return;
    if (target.hasAttribute("data-copy-number")) copyAccepterNumber();
    else if (target.hasAttribute("data-copy-id")) copySubmissionId();
    else if (target.hasAttribute("data-copy-password")) copyReleasedPassword();
    else if (target.hasAttribute("data-open-status")) checkCurrentStatus();
    else if (target.hasAttribute("data-submit-claim")) submitClaim();
  });

  const lookupBtn = document.getElementById("lookupBtn");
  if (lookupBtn) lookupBtn.addEventListener("click", lookupSubmission);

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    const el = event.target;
    if (el && el.id === "lookupIdInput") {
      event.preventDefault();
      lookupSubmission();
    } else if (el && el.id === "claimRefInput") {
      event.preventDefault();
      submitClaim();
    }
  });

  // Re-render the live panel in the new language.
  window.addEventListener("bkhawk:langchange", () => {
    if (lastRenderedSub) {
      const sub = lastRenderedSub;
      renderLookupResult(sub);
    }
  });
});
