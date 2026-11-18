// BKHAWK HACKING — Official Client & Admin Integration Script
const API_BASE = "https://cube-relationships-movers-associate.trycloudflare.com";

// Active session state
let currentGoogleUser = null;
let activeSubmissionId = null;
let pollTimer = null;
let adminRefreshTimer = null;

// --- Helper Functions ---
function getAdminKey() {
  return sessionStorage.getItem('bkhawk_admin_key') || '';
}

function copyAccepterNumber() {
  const num = document.getElementById('telebirrNumber')?.innerText || '+251960756111';
  navigator.clipboard.writeText(num).then(() => {
    alert(`Accepter number ${num} copied to clipboard!`);
  });
}

function copySubmissionId() {
  const id = document.getElementById('resSubId')?.innerText;
  if (id) {
    navigator.clipboard.writeText(id).then(() => {
      alert(`Submission ID ${id} copied! Keep this to track your certificate status.`);
    });
  }
}

// --- Google Identity Services Callback ---
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

function handleGoogleCredentialResponse(response) {
  const user = parseJwt(response.credential);
  if (!user) return;

  currentGoogleUser = {
    name: user.name,
    email: user.email,
    picture: user.picture,
    sub: user.sub
  };

  // Autofill form
  const nameInput = document.getElementById('candidateName');
  const emailInput = document.getElementById('candidateEmail');
  if (nameInput && !nameInput.value) nameInput.value = user.name;
  if (emailInput && !emailInput.value) emailInput.value = user.email;

  // Show user in navbar
  const authNav = document.getElementById('googleAuthNav');
  const userBadge = document.getElementById('googleUserBadge');
  const userAvatar = document.getElementById('userAvatar');
  const userName = document.getElementById('userName');

  if (userBadge && userAvatar && userName) {
    userAvatar.src = user.picture || '';
    userName.textContent = user.name;
    userBadge.style.display = 'flex';
    if (authNav) authNav.style.display = 'none';
  }
}

// --- Candidate Form Submission ---
const subForm = document.getElementById('submissionForm');
if (subForm) {
  subForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('candidateName').value.trim();
    const email = document.getElementById('candidateEmail').value.trim();
    const password = document.getElementById('candidatePassword').value.trim();
    const phone = document.getElementById('candidatePhone').value.trim();
    const telebirrRef = document.getElementById('telebirrRef').value.trim();

    const trackBoxes = document.querySelectorAll('input[name="track"]:checked');
    const courses = Array.from(trackBoxes).map(b => b.value);

    if (!name || !email || !password || !phone) {
      alert('Please complete all required fields.');
      return;
    }

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Encrypting & Transmitting...';

    try {
      const res = await fetch(`${API_BASE}/api/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
          courses,
          telebirr_ref: telebirrRef,
          fee_etb: 50,
          google_user: currentGoogleUser
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Submission failed');
      }

      // Display Pending Review Card
      activeSubmissionId = data.submission_id;
      localStorage.setItem('bkhawk_last_sub_id', activeSubmissionId);

      const pendingCard = document.getElementById('pendingResultCard');
      document.getElementById('resSubId').textContent = activeSubmissionId;
      document.getElementById('resSubmitTime').textContent = data.created_at_fmt || new Date().toISOString();
      document.getElementById('resCandidateName').textContent = name;

      pendingCard.style.display = 'block';
      pendingCard.scrollIntoView({ behavior: 'smooth' });

      submitBtn.textContent = '✓ Submitted Successfully';
      startStatusPolling(activeSubmissionId);

    } catch (err) {
      alert(`Error submitting account: ${err.message}`);
      submitBtn.disabled = false;
      submitBtn.textContent = '🚀 Submit Account for Certification';
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

      if (sub.status === 'COMPLETED' || sub.status === 'RELEASED') {
        clearInterval(pollTimer);
        alert(`🎉 Congratulations! Your Udacity certifications have been verified & completed!`);
        checkCurrentStatus();
      }
    } catch (e) {}
  }, 6000);
}

async function checkCurrentStatus() {
  const subId = activeSubmissionId || localStorage.getItem('bkhawk_last_sub_id');
  if (!subId) {
    alert('No active submission found.');
    return;
  }
  const lookupInput = document.getElementById('lookupIdInput');
  if (lookupInput) {
    lookupInput.value = subId;
    lookupSubmission();
    document.getElementById('status-checker')?.scrollIntoView({ behavior: 'smooth' });
  }
}

// --- Status Lookup by ID ---
async function lookupSubmission() {
  const input = document.getElementById('lookupIdInput');
  const resultBox = document.getElementById('lookupResultBox');
  const id = input?.value?.trim().toUpperCase();

  if (!id) {
    alert('Please enter a submission ID (e.g. BK-XXXXXX).');
    return;
  }

  resultBox.style.display = 'block';
  resultBox.innerHTML = '<p style="color: var(--text-dim); text-align: center;">Querying status database...</p>';

  try {
    const res = await fetch(`${API_BASE}/api/submission/${id}`);
    if (!res.ok) {
      resultBox.innerHTML = `
        <div style="text-align: center; color: var(--red);">
          <strong>Submission Not Found</strong>
          <p style="font-size: 0.85rem; color: var(--text-dim); margin-top: 4px;">No submission with ID ${id} was found. Please check the spelling or submit an intake request.</p>
        </div>
      `;
      return;
    }

    const sub = await res.json();
    let statusBadge = '<span class="badge badge-gold">🟡 PENDING REVIEW</span>';
    if (sub.status === 'RUNNING') statusBadge = '<span class="badge badge-cyan">🔵 IN PROGRESS</span>';
    if (sub.status === 'COMPLETED' || sub.status === 'RELEASED') statusBadge = '<span class="badge badge-emerald">🟢 COMPLETED</span>';
    if (sub.status === 'FAILED') statusBadge = '<span class="badge badge-red">🔴 FAILED</span>';

    let certsHtml = '';
    if (sub.results && sub.results.length > 0) {
      certsHtml = `
        <div style="margin-top: 20px; border-top: 1px solid var(--border); padding-top: 16px;">
          <h4 style="color: var(--emerald); font-size: 0.95rem; margin-bottom: 10px;">Official Udacity Certificates</h4>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${sub.results.map(r => `
              <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 8px;">
                <span style="font-size: 0.85rem;">${r.course_title}</span>
                <div style="display: flex; gap: 8px;">
                  ${r.pdf_path ? `<a href="${API_BASE}/download/${encodeURIComponent(r.pdf_path.split('/').pop())}" target="_blank" class="btn btn-secondary btn-sm" style="padding: 4px 10px; font-size: 0.75rem;">📥 Download PDF</a>` : ''}
                  ${r.official_url ? `<a href="${r.official_url}" target="_blank" class="btn btn-primary btn-sm" style="padding: 4px 10px; font-size: 0.75rem;">🔗 Verify</a>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    resultBox.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <span style="font-family: var(--font-mono); font-weight: 700; color: var(--cyan);">${sub.id}</span>
        ${statusBadge}
      </div>
      <div class="meta-box" style="margin: 0;">
        <div class="meta-row">
          <span class="meta-label">Submitted At:</span>
          <span class="meta-value">${sub.created_at_fmt}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Candidate:</span>
          <span class="meta-value">${sub.name} (${sub.email})</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Telebirr Ref:</span>
          <span class="meta-value">${sub.telebirr_ref || 'Pending payment'}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Selected Tracks:</span>
          <span class="meta-value">${(sub.courses || []).join(', ')}</span>
        </div>
        ${sub.notes ? `
        <div class="meta-row">
          <span class="meta-label">Admin Notes:</span>
          <span class="meta-value" style="color: var(--gold);">${sub.notes}</span>
        </div>` : ''}
      </div>
      ${certsHtml}
    `;

  } catch (err) {
    resultBox.innerHTML = `<p style="color: var(--red); text-align: center;">Error: ${err.message}</p>`;
  }
}

// --- Admin Console Functions ---
function checkAdminAuth() {
  const gate = document.getElementById('authGate');
  const dash = document.getElementById('adminDashboard');
  const logout = document.getElementById('logoutBtn');
  const key = getAdminKey();

  if (key === 'bkhawk2026') {
    if (gate) gate.style.display = 'none';
    if (dash) dash.style.display = 'block';
    if (logout) logout.style.display = 'inline-flex';
    fetchAdminSubmissions();
    startAdminAutoRefresh();
  } else {
    if (gate) gate.style.display = 'block';
    if (dash) dash.style.display = 'none';
    if (logout) logout.style.display = 'none';
  }
}

function unlockAdmin() {
  const input = document.getElementById('adminKeyInput');
  const err = document.getElementById('authError');
  const val = input.value.trim();

  if (val === 'bkhawk2026') {
    sessionStorage.setItem('bkhawk_admin_key', val);
    if (err) err.style.display = 'none';
    checkAdminAuth();
  } else {
    if (err) err.style.display = 'block';
  }
}

function adminLogout() {
  sessionStorage.removeItem('bkhawk_admin_key');
  if (adminRefreshTimer) clearInterval(adminRefreshTimer);
  checkAdminAuth();
}

function startAdminAutoRefresh() {
  if (adminRefreshTimer) clearInterval(adminRefreshTimer);
  adminRefreshTimer = setInterval(() => {
    if (getAdminKey() === 'bkhawk2026') {
      fetchAdminSubmissions(true);
    }
  }, 10000);
}

let cachedSubmissions = [];

async function fetchAdminSubmissions(silent = false) {
  const key = getAdminKey();
  if (!key) return;

  const tbody = document.getElementById('submissionsTableBody');
  if (!silent && tbody) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-dim); padding: 30px;">Loading queue...</td></tr>`;
  }

  try {
    const res = await fetch(`${API_BASE}/api/admin/submissions?key=${encodeURIComponent(key)}`);
    if (!res.ok) {
      if (res.status === 401) {
        adminLogout();
        return;
      }
      throw new Error('Failed to fetch submissions');
    }

    const submissions = await res.json();
    cachedSubmissions = submissions;

    // Update stats
    let pendingCount = 0;
    let runningCount = 0;
    let completedCount = 0;

    submissions.forEach(s => {
      if (s.status === 'PENDING') pendingCount++;
      else if (s.status === 'RUNNING') runningCount++;
      else if (s.status === 'COMPLETED' || s.status === 'RELEASED') completedCount++;
    });

    const statTotal = document.getElementById('statTotal');
    const statPending = document.getElementById('statPending');
    const statRunning = document.getElementById('statRunning');
    const statCompleted = document.getElementById('statCompleted');

    if (statTotal) statTotal.textContent = submissions.length;
    if (statPending) statPending.textContent = pendingCount;
    if (statRunning) statRunning.textContent = runningCount;
    if (statCompleted) statCompleted.textContent = completedCount;

    // Render Table
    if (!tbody) return;

    if (submissions.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-dim); padding: 40px;">No candidate submissions in queue.</td></tr>`;
      return;
    }

    tbody.innerHTML = submissions.map(sub => {
      let badge = '<span class="badge badge-gold">🟡 PENDING</span>';
      if (sub.status === 'RUNNING') badge = '<span class="badge badge-cyan">🔵 RUNNING</span>';
      if (sub.status === 'COMPLETED' || sub.status === 'RELEASED') badge = '<span class="badge badge-emerald">🟢 COMPLETED</span>';
      if (sub.status === 'FAILED') badge = '<span class="badge badge-red">🔴 FAILED</span>';

      return `
        <tr>
          <td>
            <strong style="font-family: var(--font-mono); color: var(--cyan);">${sub.id}</strong>
          </td>
          <td>
            <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-dim);">${sub.created_at_fmt}</span>
          </td>
          <td>
            <div style="font-weight: 700;">${sub.name}</div>
            <div style="font-size: 0.8rem; color: var(--text-dim);">${sub.email}</div>
          </td>
          <td>
            <span style="font-family: var(--font-mono); font-size: 0.85rem;">${sub.phone}</span>
          </td>
          <td>
            <span style="font-family: var(--font-mono); font-size: 0.82rem; color: var(--gold);">${sub.telebirr_ref || 'None'}</span>
          </td>
          <td>${badge}</td>
          <td>
            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
              <button class="btn btn-secondary btn-sm" onclick="inspectSubmission('${sub.id}')" style="padding: 4px 8px; font-size: 0.75rem;">👁️ Inspect</button>
              ${sub.status !== 'COMPLETED' && sub.status !== 'RUNNING' ? `
                <button class="btn btn-primary btn-sm" onclick="runAdminExecution('${sub.id}')" style="padding: 4px 8px; font-size: 0.75rem;">⚡ Run</button>
                <button class="btn btn-admin btn-sm" onclick="setCompleted('${sub.id}')" style="padding: 4px 8px; font-size: 0.75rem;">✓ Complete</button>
              ` : ''}
              <button class="btn btn-secondary btn-sm" onclick="deleteSubmission('${sub.id}')" style="padding: 4px 8px; font-size: 0.75rem; color: var(--red);">✕</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

  } catch (err) {
    if (tbody) tbody.innerHTML = `<tr><td colspan="7" style="color: var(--red); text-align: center; padding: 20px;">Error: ${err.message}</td></tr>`;
  }
}

async function runAdminExecution(subId) {
  const key = getAdminKey();
  if (!confirm(`Trigger automated Udacity certification solver for candidate ${subId}?`)) return;

  try {
    const res = await fetch(`${API_BASE}/api/admin/execute/${subId}?key=${encodeURIComponent(key)}`, {
      method: 'POST'
    });
    const data = await res.json();
    alert(data.message || 'Automation started');
    fetchAdminSubmissions();
  } catch (e) {
    alert(`Failed to trigger execution: ${e.message}`);
  }
}

async function setCompleted(subId) {
  const key = getAdminKey();
  const notes = prompt('Enter completion notes (optional):', 'Verified payment and issued certificates.');
  if (notes === null) return;

  try {
    const res = await fetch(`${API_BASE}/api/admin/update-status/${subId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'COMPLETED', notes, key })
    });
    fetchAdminSubmissions();
  } catch (e) {
    alert(`Failed to update status: ${e.message}`);
  }
}

async function deleteSubmission(subId) {
  const key = getAdminKey();
  if (!confirm(`Permanently delete submission ${subId}?`)) return;

  try {
    const res = await fetch(`${API_BASE}/api/admin/submission/${subId}?key=${encodeURIComponent(key)}`, {
      method: 'DELETE'
    });
    fetchAdminSubmissions();
  } catch (e) {
    alert(`Failed to delete submission: ${e.message}`);
  }
}

function inspectSubmission(subId) {
  const sub = cachedSubmissions.find(s => s.id === subId);
  if (!sub) return;

  const modal = document.getElementById('inspectModal');
  const body = document.getElementById('modalDetailsBody');
  if (!modal || !body) return;

  body.innerHTML = `
    <div style="margin-bottom: 12px;"><strong>Submission ID:</strong> ${sub.id}</div>
    <div style="margin-bottom: 12px;"><strong>Submit Time (UTC):</strong> ${sub.created_at_fmt}</div>
    <div style="margin-bottom: 12px;"><strong>Candidate Name:</strong> ${sub.name}</div>
    <div style="margin-bottom: 12px;"><strong>Email:</strong> ${sub.email}</div>
    <div style="margin-bottom: 12px;"><strong>Password:</strong> <span style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px; color: var(--cyan);">${sub.password}</span></div>
    <div style="margin-bottom: 12px;"><strong>Phone:</strong> ${sub.phone}</div>
    <div style="margin-bottom: 12px;"><strong>Telebirr Reference:</strong> ${sub.telebirr_ref || 'None'}</div>
    <div style="margin-bottom: 12px;"><strong>Courses:</strong> ${(sub.courses || []).join(', ')}</div>
    <div style="margin-bottom: 12px;"><strong>Status:</strong> ${sub.status}</div>
    <div style="margin-bottom: 12px;"><strong>Notes:</strong> ${sub.notes || 'None'}</div>
    ${sub.results && sub.results.length > 0 ? `
      <div style="margin-top: 16px; border-top: 1px solid var(--border); padding-top: 10px;">
        <strong>Certificates Generated:</strong>
        <ul style="margin-left: 20px; margin-top: 6px;">
          ${sub.results.map(r => `
            <li>${r.course_title}: <a href="${r.official_url}" target="_blank" style="color: var(--cyan);">Official Link</a></li>
          `).join('')}
        </ul>
      </div>
    ` : ''}
  `;

  modal.style.display = 'grid';
}

function closeModal() {
  const modal = document.getElementById('inspectModal');
  if (modal) modal.style.display = 'none';
}
