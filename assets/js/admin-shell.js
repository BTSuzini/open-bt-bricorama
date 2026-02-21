// assets/js/admin-shell.js
import { auth } from "./firebase.js";
import { logout, getRoleByEmail } from "./session.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

/**
 * Shell Admin commun :
 * - Bandeau : Accueil public / Déconnexion
 * - Encart Zone : select (Général/DM/DD) + onglets adaptés
 *
 * Options :
 * - active: "home" | "infos" | "equipes" | "inscriptions" | "tirage"
 * - basePath: chemin relatif depuis /admin/* vers la racine (..)
 */
export function renderAdminShell({ active = "home", basePath = ".." } = {}) {
  const headerMount = document.getElementById("adminHeader");
  const zoneMount = document.getElementById("adminZone");

  if (!headerMount || !zoneMount) {
    console.warn("admin-shell: #adminHeader ou #adminZone manquant");
    return;
  }

  const params = new URLSearchParams(location.search);
  const scope = (params.get("scope") || "general").toLowerCase(); // general | dh | dd

  // ---------- Header commun ----------
  headerMount.innerHTML = `
    <header class="topbar">
      <div class="container">
        <div class="topbar-row">
          <div class="brand-logo">
            <img src="${basePath}/assets/img/logo-suzini.png" alt="Logo Suzini">
          </div>

          <h1 class="brand-title">🛠️ Admin — Gestion</h1>

          <div class="brand-logo">
            <img src="${basePath}/assets/img/logo-openbt.png" alt="Logo Open BT Bricorama">
          </div>
        </div>

        <nav class="nav">
          <a href="${basePath}/index.html">Accueil public</a>
          <a href="#" id="btnLogout">Déconnexion</a>
        </nav>
      </div>
    </header>
  `;

  // ---------- Encart Zone ----------
  zoneMount.innerHTML = `
    <section class="card" id="accessDenied" style="display:none;">
      <h2 style="margin:0 0 8px;">⛔ Accès refusé</h2>
      <p class="muted" style="margin:0;">Cette page est réservée aux administrateurs.</p>
    </section>

    <section class="card" id="adminUI" style="display:none;">
      <h2 style="margin:0 0 10px;">🎛️ Zone</h2>

      <div class="field">
        <label for="scope">Choisir</label>
        <select id="scope">
          <option value="general">Général</option>
          <option value="dh">DM</option>
          <option value="dd">DD</option>
        </select>
      </div>

      <div class="grid" style="margin-top:10px;" id="tabs"></div>
      <p class="muted" id="hint" style="margin-top:10px;"></p>
    </section>
  `;

  const accessDenied = document.getElementById("accessDenied");
  const adminUI = document.getElementById("adminUI");
  const scopeEl = document.getElementById("scope");
  const tabsEl = document.getElementById("tabs");
  const hintEl = document.getElementById("hint");

  scopeEl.value = ["general", "dh", "dd"].includes(scope) ? scope : "general";

  function mkTab(label, href, isActive) {
    const a = document.createElement("a");
    a.className = "btn";
    a.href = href;
    a.textContent = label;
    if (isActive) {
      a.setAttribute("aria-current", "page");
      a.style.borderColor = "#111";
    }
    return a;
  }

  function setTabs(nextScope) {
    tabsEl.innerHTML = "";

    if (nextScope === "general") {
      hintEl.textContent = "Zone Général : publication / modification / suppression des infos.";
      tabsEl.appendChild(
        mkTab("📰 Infos", `${basePath}/admin/index.html?scope=general`, active === "home" || active === "infos")
      );
      return;
    }

    hintEl.textContent = `Zone ${nextScope.toUpperCase()} : équipes / inscriptions / tirage.`;

    tabsEl.appendChild(
      mkTab("👥 Équipes", `${basePath}/admin/equipes.html?scope=${encodeURIComponent(nextScope)}`, active === "equipes")
    );
    tabsEl.appendChild(
      mkTab("📝 Inscriptions", `${basePath}/admin/inscriptions.html?scope=${encodeURIComponent(nextScope)}`, active === "inscriptions")
    );
    tabsEl.appendChild(
      mkTab("🎲 Tirage", `${basePath}/admin/tirage.html?scope=${encodeURIComponent(nextScope)}`, active === "tirage")
    );
  }

  setTabs(scopeEl.value);

  // Changement de scope : on reste sur la même rubrique si possible
  scopeEl.addEventListener("change", () => {
    const s = scopeEl.value;

    if (s === "general") {
      window.location.href = `${basePath}/admin/index.html?scope=general`;
      return;
    }

    const map = {
      equipes: "equipes.html",
      inscriptions: "inscriptions.html",
      tirage: "tirage.html",
      home: "index.html",
      infos: "index.html",
    };

    const target = map[active] || "index.html";
    window.location.href = `${basePath}/admin/${target}?scope=${encodeURIComponent(s)}`;
  });

  // Déconnexion
  headerMount.querySelector("#btnLogout").addEventListener("click", async (e) => {
    e.preventDefault();
    await logout();
    window.location.href = `${basePath}/index.html`;
  });

  // Guard admin
  onAuthStateChanged(auth, async (user) => {
    accessDenied.style.display = "none";
    adminUI.style.display = "none";

    if (!user) {
      accessDenied.style.display = "block";
      return;
    }

    try {
      const role = await getRoleByEmail(user.email);
      if (role !== "admin") {
        accessDenied.style.display = "block";
        return;
      }
      adminUI.style.display = "block";
    } catch (e) {
      console.warn(e);
      accessDenied.style.display = "block";
    }
  });
}
