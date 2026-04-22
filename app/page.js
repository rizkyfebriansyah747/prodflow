"use client";
import { useState, useEffect } from "react";

// ============================================================
// DATA & CONSTANTS
// ============================================================
const USERS = {
  "manager@prodflow.com": {
    name: "Manager",
    init: "MG",
    cls: "av-gray",
    role: "manager",
    pass: "1234",
  },
  "rina@prodflow.com": {
    name: "Rina",
    init: "RI",
    cls: "av-pink",
    role: "pic",
    cats: ["Instagram", "Artikel"],
    pass: "1234",
  },
  "budi@prodflow.com": {
    name: "Budi",
    init: "BU",
    cls: "av-blue",
    role: "pic",
    cats: ["TikTok", "Podcast"],
    pass: "1234",
  },
  "inul@prodflow.com": {
    name: "Inul",
    init: "IN",
    cls: "av-teal",
    role: "member",
    pass: "1234",
  },
  "redul@prodflow.com": {
    name: "Redul",
    init: "RE",
    cls: "av-amber",
    role: "member",
    pass: "1234",
  },
};

const TEAM = ["Rina", "Budi", "Inul", "Redul", "Andi", "Sinta", "Reza"];
const ROLES_LIST = [
  "Cameraman",
  "Editor Video",
  "Desain Cover",
  "Talent",
  "Penulis",
  "Scripting",
  "Fotografer",
  "Desainer",
];
const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];
const DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const CAT_CLS = {
  Instagram: "ig",
  TikTok: "tt",
  YouTube: "yt",
  Artikel: "ar",
  Podcast: "pk",
  Event: "ev",
};
const CAT_LABEL = {
  ig: "Instagram",
  tt: "TikTok",
  yt: "YouTube",
  ar: "Artikel",
  pk: "Podcast",
  ev: "Event",
};
const AV_CLS = {
  "av-blue": "#E6F1FB:#185FA5",
  "av-teal": "#E1F5EE:#0F6E56",
  "av-purple": "#EEEDFE:#534AB7",
  "av-coral": "#FAECE7:#993C1D",
  "av-pink": "#FBEAF0:#993556",
  "av-amber": "#FAEEDA:#854F0B",
  "av-green": "#EAF3DE:#3B6D11",
  "av-gray": "#F1EFE8:#5F5E5A",
};

const INIT_EVENTS = [
  {
    id: 1,
    title: "Reels IG — Kenapa Paspor Penting?",
    cat: "Instagram",
    start: "2025-04-19",
    end: "2025-04-21",
    status: "review",
    pic: "Rina",
    assignees: [
      { name: "Rina", role: "Cameraman", cls: "av-pink", status: "review" },
      { name: "Inul", role: "Editor Video", cls: "av-teal", status: "aktif" },
      { name: "Redul", role: "Desain Cover", cls: "av-amber", status: "aktif" },
    ],
  },
  {
    id: 2,
    title: "TikTok — Tips Hemat Belanja",
    cat: "TikTok",
    start: "2025-04-21",
    end: "2025-04-23",
    status: "aktif",
    pic: "Budi",
    assignees: [
      { name: "Inul", role: "Talent", cls: "av-teal", status: "aktif" },
      { name: "Sinta", role: "Scripting", cls: "av-green", status: "aktif" },
    ],
  },
  {
    id: 3,
    title: "Artikel: Cara Urus Visa Schengen",
    cat: "Artikel",
    start: "2025-04-22",
    end: "2025-04-25",
    status: "aktif",
    pic: "Rina",
    assignees: [
      { name: "Redul", role: "Penulis", cls: "av-amber", status: "aktif" },
    ],
  },
  {
    id: 4,
    title: "YouTube — Travel Vlog Jepang",
    cat: "YouTube",
    start: "2025-04-23",
    end: "2025-04-28",
    status: "aktif",
    pic: "Budi",
    assignees: [
      { name: "Rina", role: "Cameraman", cls: "av-pink", status: "aktif" },
      { name: "Inul", role: "Editor Video", cls: "av-teal", status: "aktif" },
    ],
  },
  {
    id: 5,
    title: "Podcast — Eps. 12 Tips Traveling",
    cat: "Podcast",
    start: "2025-04-17",
    end: "2025-04-20",
    status: "revisi",
    pic: "Budi",
    assignees: [
      { name: "Redul", role: "Editor", cls: "av-amber", status: "revisi" },
    ],
  },
  {
    id: 6,
    title: "IG Story — Promo Event Mei",
    cat: "Instagram",
    start: "2025-04-24",
    end: "2025-04-26",
    status: "aktif",
    pic: "Rina",
    assignees: [
      { name: "Redul", role: "Desainer", cls: "av-amber", status: "aktif" },
      { name: "Andi", role: "Copywriting", cls: "av-blue", status: "aktif" },
    ],
  },
  {
    id: 7,
    title: "Event: Liputan Festival Kuliner",
    cat: "Event",
    start: "2025-04-27",
    end: "2025-04-27",
    status: "aktif",
    pic: "Rina",
    assignees: [
      { name: "Inul", role: "Cameraman", cls: "av-teal", status: "aktif" },
      { name: "Reza", role: "Fotografer", cls: "av-purple", status: "aktif" },
    ],
  },
  {
    id: 8,
    title: "TikTok — OOTD Ramadan",
    cat: "TikTok",
    start: "2025-04-14",
    end: "2025-04-16",
    status: "selesai",
    pic: "Budi",
    assignees: [
      { name: "Rina", role: "Talent", cls: "av-pink", status: "selesai" },
      { name: "Redul", role: "Desainer", cls: "av-amber", status: "selesai" },
    ],
  },
  {
    id: 9,
    title: "Artikel: 10 Destinasi Domestik",
    cat: "Artikel",
    start: "2025-04-28",
    end: "2025-04-30",
    status: "aktif",
    pic: "Rina",
    assignees: [
      { name: "Sinta", role: "Penulis", cls: "av-green", status: "aktif" },
    ],
  },
  {
    id: 10,
    title: "YouTube — Review Kamera Terbaru",
    cat: "YouTube",
    start: "2025-05-02",
    end: "2025-05-06",
    status: "aktif",
    pic: "Budi",
    assignees: [
      { name: "Inul", role: "Editor", cls: "av-teal", status: "aktif" },
      { name: "Rina", role: "Talent", cls: "av-pink", status: "aktif" },
    ],
  },
];

// ============================================================
// SMALL COMPONENTS
// ============================================================
function Avatar({ cls = "av-gray", init = "?", size = 32 }) {
  const [bg, fg] = (AV_CLS[cls] || "#F1EFE8:#5F5E5A").split(":");
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg,
        color: fg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.35,
        fontWeight: 500,
        flexShrink: 0,
      }}
    >
      {init}
    </div>
  );
}

function Badge({ type = "gray", children }) {
  const styles = {
    green: { background: "#EAF3DE", color: "#3B6D11" },
    amber: { background: "#FAEEDA", color: "#854F0B" },
    red: { background: "#FCEBEB", color: "#A32D2D" },
    blue: { background: "#E6F1FB", color: "#185FA5" },
    gray: { background: "#F1EFE8", color: "#5F5E5A" },
    purple: { background: "#EEEDFE", color: "#534AB7" },
    teal: { background: "#E1F5EE", color: "#0F6E56" },
  };
  return (
    <span
      style={{
        ...(styles[type] || styles.gray),
        display: "inline-block",
        fontSize: 11,
        padding: "2px 8px",
        borderRadius: 6,
        fontWeight: 500,
      }}
    >
      {children}
    </span>
  );
}

function CatPill({ cat }) {
  const clsMap = {
    ig: ["#FBEAF0", "#993556"],
    tt: ["#E6F1FB", "#185FA5"],
    yt: ["#FCEBEB", "#A32D2D"],
    ar: ["#EAF3DE", "#3B6D11"],
    pk: ["#EEEDFE", "#534AB7"],
    ev: ["#FAEEDA", "#854F0B"],
  };
  const key = CAT_CLS[cat] || "ar";
  const [bg, fg] = clsMap[key] || ["#F1EFE8", "#5F5E5A"];
  return (
    <span
      style={{
        background: bg,
        color: fg,
        fontSize: 10,
        padding: "2px 6px",
        borderRadius: 3,
        fontWeight: 500,
      }}
    >
      {cat}
    </span>
  );
}

function StatusDot({ status }) {
  const colors = {
    aktif: "#378ADD",
    review: "#BA7517",
    revisi: "#E24B4A",
    selesai: "#639922",
  };
  return (
    <div
      style={{
        width: 7,
        height: 7,
        borderRadius: "50%",
        background: colors[status] || "#888",
        flexShrink: 0,
      }}
    />
  );
}

function Card({ children, style = {} }) {
  return (
    <div
      style={{
        background: "white",
        border: "0.5px solid #e5e5e5",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Toast({ msg, onClose }) {
  useEffect(() => {
    if (msg) {
      const t = setTimeout(onClose, 2500);
      return () => clearTimeout(t);
    }
  }, [msg]);
  if (!msg) return null;
  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        background: "#1a1a1a",
        color: "white",
        padding: "10px 16px",
        borderRadius: 8,
        fontSize: 13,
        zIndex: 9999,
      }}
    >
      {msg}
    </div>
  );
}

// ============================================================
// LOGIN PAGE
// ============================================================
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  function doLogin() {
    const u = USERS[email.toLowerCase().trim()];
    if (!u || pass !== "1234") {
      setErr("Email atau password salah.");
      return;
    }
    onLogin(email.toLowerCase().trim(), u);
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#f5f5f3",
      }}
    >
      <div
        style={{
          background: "white",
          border: "0.5px solid #e5e5e5",
          borderRadius: 12,
          padding: 32,
          width: 360,
        }}
      >
        <div style={{ fontSize: 20, fontWeight: 500, marginBottom: 2 }}>
          ProdFlow
        </div>
        <div style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>
          Masuk dengan email tim kamu
        </div>

        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>
            Email
          </div>
          <input
            style={{
              width: "100%",
              padding: "8px 10px",
              border: "0.5px solid #ccc",
              borderRadius: 8,
              fontSize: 13,
              boxSizing: "border-box",
            }}
            type="email"
            placeholder="email@produksi.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErr("");
            }}
            onKeyDown={(e) => e.key === "Enter" && doLogin()}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>
            Password
          </div>
          <input
            style={{
              width: "100%",
              padding: "8px 10px",
              border: "0.5px solid #ccc",
              borderRadius: 8,
              fontSize: 13,
              boxSizing: "border-box",
            }}
            type="password"
            placeholder="••••••••"
            value={pass}
            onChange={(e) => {
              setPass(e.target.value);
              setErr("");
            }}
            onKeyDown={(e) => e.key === "Enter" && doLogin()}
          />
        </div>
        {err && (
          <div style={{ fontSize: 12, color: "#A32D2D", marginBottom: 8 }}>
            {err}
          </div>
        )}

        <button
          onClick={doLogin}
          style={{
            width: "100%",
            padding: "9px 0",
            background: "#1a1a1a",
            color: "white",
            border: "none",
            borderRadius: 8,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          Masuk
        </button>

        <div
          style={{
            marginTop: 14,
            borderTop: "0.5px solid #eee",
            paddingTop: 12,
          }}
        >
          <div style={{ fontSize: 11, color: "#888", marginBottom: 6 }}>
            Login cepat (demo · password: 1234)
          </div>
          {[
            ["manager@prodflow.com", "Manager"],
            ["rina@prodflow.com", "PIC Instagram"],
            ["budi@prodflow.com", "PIC TikTok"],
            ["inul@prodflow.com", "Tim Produksi"],
            ["redul@prodflow.com", "Tim Produksi"],
          ].map(([e, label]) => (
            <button
              key={e}
              onClick={() => {
                setEmail(e);
                setPass("1234");
                setTimeout(() => {
                  const u = USERS[e];
                  onLogin(e, u);
                }, 50);
              }}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "6px 10px",
                fontSize: 12,
                border: "0.5px solid #e5e5e5",
                borderRadius: 8,
                background: "transparent",
                color: "#666",
                cursor: "pointer",
                marginBottom: 4,
              }}
            >
              {e} <span style={{ float: "right", fontSize: 10 }}>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SIDEBAR
// ============================================================
function Sidebar({ user, activePage, onNav, onLogout }) {
  const isMgr = user.role === "manager";
  const isPIC = user.role === "pic";
  const isMember = user.role === "member";

  const navItems = [
    { id: "calendar", label: "Kalender", show: true },
    { id: "dashboard", label: "Dashboard", show: true },
    {
      id: "mywork",
      label: isMgr ? "Semua Konten" : isPIC ? "Konten Saya" : "Tugas Saya",
      show: true,
    },
    { id: "submit", label: "Submit Konten", show: isMember },
    { id: "delegate", label: "Buat & Delegasi", show: isPIC || isMgr },
    { id: "review", label: "Review Submit", show: isPIC || isMgr },
    { id: "users", label: "Manajemen User", show: isMgr },
  ].filter((n) => n.show);

  return (
    <div
      style={{
        width: 200,
        flexShrink: 0,
        background: "white",
        borderRight: "0.5px solid #e5e5e5",
        display: "flex",
        flexDirection: "column",
        padding: "16px 0",
      }}
    >
      <div
        style={{
          padding: "0 16px 14px",
          borderBottom: "0.5px solid #e5e5e5",
          marginBottom: 8,
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 500 }}>ProdFlow</div>
        <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>
          {user.role === "manager"
            ? "Manager"
            : user.role === "pic"
              ? "PIC Kategori"
              : "Tim Produksi"}
        </div>
      </div>

      {navItems.map((n) => (
        <div
          key={n.id}
          onClick={() => onNav(n.id)}
          style={{
            padding: "7px 16px",
            fontSize: 13,
            color: activePage === n.id ? "#1a1a1a" : "#888",
            background: activePage === n.id ? "#f5f5f3" : "transparent",
            fontWeight: activePage === n.id ? 500 : 400,
            cursor: "pointer",
          }}
        >
          {n.label}
        </div>
      ))}

      <div
        style={{
          marginTop: "auto",
          padding: "12px 16px",
          borderTop: "0.5px solid #e5e5e5",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 8,
          }}
        >
          <Avatar cls={user.cls} init={user.init} size={26} />
          <div>
            <div style={{ fontSize: 12, fontWeight: 500 }}>{user.name}</div>
            <div style={{ fontSize: 11, color: "#888" }}>{user.email}</div>
          </div>
        </div>
        <button
          onClick={onLogout}
          style={{
            width: "100%",
            padding: "5px 0",
            fontSize: 11,
            border: "0.5px solid #ccc",
            borderRadius: 8,
            background: "transparent",
            cursor: "pointer",
          }}
        >
          Keluar
        </button>
      </div>
    </div>
  );
}

// ============================================================
// CALENDAR PAGE
// ============================================================
function CalendarPage({ user, events, setEvents, onNav, onToast }) {
  const [year, setYear] = useState(2025);
  const [month, setMonth] = useState(3);
  const [view, setView] = useState("month");
  const [filters, setFilters] = useState(
    new Set(["ig", "tt", "yt", "ar", "pk", "ev"]),
  );
  const [selectedEvent, setSelectedEvent] = useState(null);

  function userEvents() {
    if (user.role === "manager") return events;
    if (user.role === "pic") return events.filter((e) => e.pic === user.name);
    return events.filter((e) => e.assignees.some((a) => a.name === user.name));
  }

  function filteredEvents() {
    return userEvents().filter((e) => filters.has(CAT_CLS[e.cat]));
  }

  function eventsOnDate(ds) {
    return filteredEvents().filter((e) => e.start <= ds && e.end >= ds);
  }

  function toggleFilter(key) {
    setFilters((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        if (next.size > 1) next.delete(key);
      } else next.add(key);
      return next;
    });
  }

  function navMonth(dir) {
    setMonth((prev) => {
      let m = prev + dir;
      if (m > 11) {
        setYear((y) => y + 1);
        return 0;
      }
      if (m < 0) {
        setYear((y) => y - 1);
        return 11;
      }
      return m;
    });
  }

  const clsMap = {
    ig: ["#FBEAF0", "#993556"],
    tt: ["#E6F1FB", "#185FA5"],
    yt: ["#FCEBEB", "#A32D2D"],
    ar: ["#EAF3DE", "#3B6D11"],
    pk: ["#EEEDFE", "#534AB7"],
    ev: ["#FAEEDA", "#854F0B"],
  };

  function EventPill({ ev, small = false }) {
    const key = CAT_CLS[ev.cat] || "ar";
    const [bg, fg] = clsMap[key];
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          setSelectedEvent(ev);
        }}
        style={{
          background: bg,
          color: fg,
          fontSize: small ? 9 : 10,
          padding: "2px 5px",
          borderRadius: 3,
          marginBottom: 2,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          cursor: "pointer",
          fontWeight: 500,
        }}
        title={ev.title}
      >
        {ev.title}
      </div>
    );
  }

  function renderMonth() {
    const first = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrev = new Date(year, month, 0).getDate();
    const cells = [];

    for (let i = 0; i < first; i++) {
      cells.push(
        <div
          key={`p${i}`}
          style={{
            minHeight: 80,
            padding: 4,
            borderRight: "0.5px solid #eee",
            borderBottom: "0.5px solid #eee",
            opacity: 0.4,
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 500,
              width: 22,
              height: 22,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {daysInPrev - first + 1 + i}
          </div>
        </div>,
      );
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const ds = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const isToday = ds === "2025-04-21";
      const evs = eventsOnDate(ds);
      cells.push(
        <div
          key={d}
          onClick={() => {
            if (evs.length === 1) setSelectedEvent(evs[0]);
          }}
          style={{
            minHeight: 80,
            padding: 4,
            borderRight: "0.5px solid #eee",
            borderBottom: "0.5px solid #eee",
            cursor: "pointer",
            background: "white",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#f9f9f9")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
        >
          <div
            style={{
              width: 22,
              height: 22,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 500,
              borderRadius: "50%",
              background: isToday ? "#1a1a1a" : "transparent",
              color: isToday ? "white" : "#1a1a1a",
              marginBottom: 3,
            }}
          >
            {d}
          </div>
          {evs.slice(0, 2).map((ev) => (
            <EventPill key={ev.id} ev={ev} />
          ))}
          {evs.length > 2 && (
            <div style={{ fontSize: 10, color: "#888" }}>
              +{evs.length - 2} lainnya
            </div>
          )}
        </div>,
      );
    }

    const remaining = (7 - (cells.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      cells.push(
        <div
          key={`n${i}`}
          style={{
            minHeight: 80,
            padding: 4,
            borderRight: "0.5px solid #eee",
            borderBottom: "0.5px solid #eee",
            opacity: 0.4,
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 500,
              width: 22,
              height: 22,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {i}
          </div>
        </div>,
      );
    }

    return (
      <div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7,1fr)",
            borderTop: "0.5px solid #eee",
          }}
        >
          {DAYS.map((d) => (
            <div
              key={d}
              style={{
                textAlign: "center",
                padding: "8px 4px",
                fontSize: 11,
                color: "#888",
                fontWeight: 500,
                borderRight: "0.5px solid #eee",
              }}
            >
              {d}
            </div>
          ))}
          {cells}
        </div>
      </div>
    );
  }

  function renderList() {
    const monthStr = `${year}-${String(month + 1).padStart(2, "0")}`;
    const evs = filteredEvents().filter(
      (e) => e.start.startsWith(monthStr) || e.end.startsWith(monthStr),
    );
    evs.sort((a, b) => a.start.localeCompare(b.start));
    return (
      <div style={{ padding: 16 }}>
        {evs.length === 0 && (
          <div style={{ fontSize: 13, color: "#888", padding: "8px 0" }}>
            Tidak ada konten di bulan ini.
          </div>
        )}
        {evs.map((ev) => {
          const statusColor =
            {
              aktif: "#378ADD",
              review: "#BA7517",
              revisi: "#E24B4A",
              selesai: "#639922",
            }[ev.status] || "#888";
          return (
            <div
              key={ev.id}
              onClick={() => setSelectedEvent(ev)}
              style={{
                border: `0.5px solid ${ev.status === "revisi" ? "#E24B4A" : "#e5e5e5"}`,
                borderLeft:
                  ev.status === "revisi"
                    ? "3px solid #E24B4A"
                    : "0.5px solid #e5e5e5",
                borderRadius: 8,
                padding: 12,
                marginBottom: 8,
                cursor: "pointer",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "flex-start", gap: 8 }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginBottom: 4,
                    }}
                  >
                    <CatPill cat={ev.cat} />
                    <span style={{ fontSize: 13, fontWeight: 500 }}>
                      {ev.title}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: "#888" }}>
                    PIC: {ev.pic} · {ev.start} → {ev.end}
                  </div>
                  <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>
                    {ev.assignees
                      .map((a) => `${a.name} (${a.role})`)
                      .join(", ")}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: statusColor,
                    }}
                  />
                  <span style={{ fontSize: 11, color: "#888" }}>
                    {ev.status}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  const statusBadgeType = {
    aktif: "blue",
    review: "amber",
    revisi: "red",
    selesai: "green",
  };
  const statusLabel = {
    aktif: "On Progress",
    review: "Menunggu Review",
    revisi: "Butuh Revisi",
    selesai: "Selesai",
  };

  return (
    <div style={{ flex: 1, overflow: "auto", padding: 20 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <div>
          <div style={{ fontSize: 18, fontWeight: 500 }}>Kalender Produksi</div>
          <div style={{ fontSize: 13, color: "#888" }}>
            Pantau semua jadwal konten tim
          </div>
        </div>
        {(user.role === "pic" || user.role === "manager") && (
          <button
            onClick={() => onNav("delegate")}
            style={{
              padding: "6px 14px",
              background: "#1a1a1a",
              color: "white",
              border: "none",
              borderRadius: 8,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            + Buat Konten
          </button>
        )}
      </div>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          gap: 6,
          alignItems: "center",
          flexWrap: "wrap",
          margin: "12px 0",
        }}
      >
        <span style={{ fontSize: 12, color: "#888" }}>Filter:</span>
        {[
          ["ig", "Instagram", "#FBEAF0", "#993556"],
          ["tt", "TikTok", "#E6F1FB", "#185FA5"],
          ["yt", "YouTube", "#FCEBEB", "#A32D2D"],
          ["ar", "Artikel", "#EAF3DE", "#3B6D11"],
          ["pk", "Podcast", "#EEEDFE", "#534AB7"],
          ["ev", "Event", "#FAEEDA", "#854F0B"],
        ].map(([key, label, bg, fg]) => (
          <button
            key={key}
            onClick={() => toggleFilter(key)}
            style={{
              padding: "3px 10px",
              borderRadius: 12,
              fontSize: 11,
              border: `0.5px solid ${filters.has(key) ? fg : "#ccc"}`,
              background: filters.has(key) ? bg : "transparent",
              color: filters.has(key) ? fg : "#888",
              cursor: "pointer",
              fontWeight: filters.has(key) ? 500 : 400,
            }}
          >
            {label}
          </button>
        ))}
        <span style={{ width: 1, height: 14, background: "#e5e5e5" }} />
        {["month", "list"].map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            style={{
              padding: "4px 10px",
              borderRadius: 8,
              fontSize: 12,
              border: "0.5px solid #ccc",
              background: view === v ? "#1a1a1a" : "transparent",
              color: view === v ? "white" : "#888",
              cursor: "pointer",
            }}
          >
            {v === "month" ? "Bulan" : "List"}
          </button>
        ))}
      </div>

      {/* Calendar box */}
      <div
        style={{
          background: "white",
          border: "0.5px solid #e5e5e5",
          borderRadius: 12,
          overflow: "hidden",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 16px",
            borderBottom: "0.5px solid #e5e5e5",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={() => navMonth(-1)}
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                border: "0.5px solid #ccc",
                background: "transparent",
                cursor: "pointer",
                fontSize: 16,
                color: "#666",
              }}
            >
              ‹
            </button>
            <div
              style={{
                fontSize: 15,
                fontWeight: 500,
                minWidth: 140,
                textAlign: "center",
              }}
            >
              {MONTHS[month]} {year}
            </div>
            <button
              onClick={() => navMonth(1)}
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                border: "0.5px solid #ccc",
                background: "transparent",
                cursor: "pointer",
                fontSize: 16,
                color: "#666",
              }}
            >
              ›
            </button>
          </div>
          <button
            onClick={() => {
              setMonth(3);
              setYear(2025);
            }}
            style={{
              padding: "4px 12px",
              border: "0.5px solid #ccc",
              borderRadius: 8,
              background: "transparent",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            Hari ini
          </button>
        </div>
        {view === "month" ? renderMonth() : renderList()}
      </div>

      {/* Event detail panel */}
      {selectedEvent && (
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: 320,
            height: "100%",
            background: "white",
            borderLeft: "0.5px solid #e5e5e5",
            zIndex: 100,
            padding: 20,
            overflowY: "auto",
          }}
        >
          <button
            onClick={() => setSelectedEvent(null)}
            style={{
              position: "absolute",
              top: 14,
              right: 14,
              width: 28,
              height: 28,
              borderRadius: "50%",
              border: "0.5px solid #ccc",
              background: "transparent",
              cursor: "pointer",
              fontSize: 16,
              color: "#666",
            }}
          >
            ×
          </button>
          <CatPill cat={selectedEvent.cat} />
          <div style={{ fontSize: 16, fontWeight: 500, margin: "8px 0 6px" }}>
            {selectedEvent.title}
          </div>
          <Badge type={statusBadgeType[selectedEvent.status]}>
            {statusLabel[selectedEvent.status]}
          </Badge>
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 3 }}>
              PIC
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12 }}>
              {selectedEvent.pic}
            </div>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 3 }}>
              Jadwal
            </div>
            <div style={{ fontSize: 13, marginBottom: 12 }}>
              {selectedEvent.start} → {selectedEvent.end}
            </div>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>
              Assignee
            </div>
            {selectedEvent.assignees.map((a, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "7px 0",
                  borderBottom: "0.5px solid #eee",
                }}
              >
                <Avatar
                  cls={a.cls}
                  init={a.name.slice(0, 2).toUpperCase()}
                  size={26}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 500 }}>{a.name}</div>
                  <div style={{ fontSize: 11, color: "#888" }}>{a.role}</div>
                </div>
                <StatusDot status={a.status} />
                <span style={{ fontSize: 11, color: "#888" }}>{a.status}</span>
              </div>
            ))}
          </div>
          {user.role === "member" && selectedEvent.status === "aktif" && (
            <button
              onClick={() => {
                setSelectedEvent(null);
                onNav("submit");
              }}
              style={{
                width: "100%",
                marginTop: 16,
                padding: "8px 0",
                background: "#1a1a1a",
                color: "white",
                border: "none",
                borderRadius: 8,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Submit Hasil
            </button>
          )}
          {(user.role === "pic" || user.role === "manager") &&
            selectedEvent.status === "review" && (
              <button
                onClick={() => {
                  setSelectedEvent(null);
                  onNav("review");
                }}
                style={{
                  width: "100%",
                  marginTop: 16,
                  padding: "8px 0",
                  background: "#1a1a1a",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Review Submit
              </button>
            )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// DASHBOARD PAGE
// ============================================================
function DashboardPage({ user, events, onNav }) {
  function userEvents() {
    if (user.role === "manager") return events;
    if (user.role === "pic") return events.filter((e) => e.pic === user.name);
    return events.filter((e) => e.assignees.some((a) => a.name === user.name));
  }
  const evs = userEvents();
  const aktif = evs.filter(
    (e) => e.status === "aktif" || e.status === "review",
  ).length;
  const revisi = evs.filter((e) => e.status === "revisi").length;
  const selesai = evs.filter((e) => e.status === "selesai").length;
  const deadline = evs.filter((e) => {
    const d = new Date(e.end);
    const t = new Date("2025-04-21");
    const diff = (d - t) / 86400000;
    return diff >= 0 && diff <= 7;
  }).length;
  const upcoming = evs
    .filter((e) => {
      const d = new Date(e.end);
      const t = new Date("2025-04-21");
      const diff = (d - t) / 86400000;
      return diff >= 0 && diff <= 7;
    })
    .slice(0, 5);
  const statusBadgeType = {
    aktif: "blue",
    review: "amber",
    revisi: "red",
    selesai: "green",
  };

  return (
    <div style={{ flex: 1, overflow: "auto", padding: 20 }}>
      <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 4 }}>
        {user.role === "manager"
          ? "Dashboard Manager"
          : `Halo, ${user.name.split(" ")[0]}!`}
      </div>
      <div style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>
        Senin, 21 April 2025
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 12,
          marginBottom: 20,
        }}
      >
        {[
          ["Konten Aktif", aktif, ""],
          ["Deadline Minggu Ini", deadline, ""],
          ["Butuh Revisi", revisi, ""],
          ["Selesai Bulan Ini", selesai, ""],
        ].map(([label, val]) => (
          <div
            key={label}
            style={{
              background: "#f5f5f3",
              borderRadius: 8,
              padding: "12px 14px",
            }}
          >
            <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>
              {label}
            </div>
            <div style={{ fontSize: 22, fontWeight: 500 }}>{val}</div>
          </div>
        ))}
      </div>
      <Card>
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 12 }}>
          Konten deadline minggu ini
        </div>
        {upcoming.length === 0 && (
          <div style={{ fontSize: 13, color: "#888" }}>
            Tidak ada konten deadline minggu ini.
          </div>
        )}
        {upcoming.map((ev) => (
          <div
            key={ev.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 0",
              borderBottom: "0.5px solid #eee",
            }}
          >
            <CatPill cat={ev.cat} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{ev.title}</div>
              <div style={{ fontSize: 11, color: "#888" }}>
                Deadline: {ev.end} · PIC: {ev.pic}
              </div>
            </div>
            <Badge type={statusBadgeType[ev.status]}>{ev.status}</Badge>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ============================================================
// MY WORK PAGE
// ============================================================
function MyWorkPage({ user, events, onNav }) {
  function userEvents() {
    if (user.role === "manager") return events;
    if (user.role === "pic") return events.filter((e) => e.pic === user.name);
    return events.filter((e) => e.assignees.some((a) => a.name === user.name));
  }
  const evs = [...userEvents()].sort((a, b) => a.end.localeCompare(b.end));
  const statusBadgeType = {
    aktif: "blue",
    review: "amber",
    revisi: "red",
    selesai: "green",
  };

  return (
    <div style={{ flex: 1, overflow: "auto", padding: 20 }}>
      <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 4 }}>
        {user.role === "manager"
          ? "Semua Konten"
          : user.role === "pic"
            ? "Konten Saya"
            : "Tugas Saya"}
      </div>
      <div style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>
        {user.role === "pic"
          ? `Kategori: ${(user.cats || []).join(", ")}`
          : "Semua penugasan"}
      </div>
      {evs.length === 0 && (
        <div style={{ fontSize: 13, color: "#888" }}>Tidak ada konten.</div>
      )}
      {evs.map((ev) => {
        const myRole = ev.assignees.find((a) => a.name === user.name);
        return (
          <div
            key={ev.id}
            style={{
              border: `0.5px solid ${ev.status === "revisi" ? "#E24B4A" : "#e5e5e5"}`,
              borderLeft:
                ev.status === "revisi"
                  ? "3px solid #E24B4A"
                  : "0.5px solid #e5e5e5",
              borderRadius: 8,
              padding: 12,
              marginBottom: 8,
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 4,
                  }}
                >
                  <CatPill cat={ev.cat} />
                  <span style={{ fontSize: 13, fontWeight: 500 }}>
                    {ev.title}
                  </span>
                </div>
                {myRole && (
                  <div style={{ fontSize: 11, color: "#888" }}>
                    Peranmu:{" "}
                    <strong style={{ fontWeight: 500 }}>{myRole.role}</strong>
                  </div>
                )}
                <div style={{ fontSize: 11, color: "#888" }}>
                  PIC: {ev.pic} · Deadline: {ev.end}
                </div>
                {user.role !== "member" && (
                  <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>
                    {ev.assignees
                      .map((a) => `${a.name} (${a.role})`)
                      .join(", ")}
                  </div>
                )}
                {ev.status === "revisi" &&
                  ev.assignees.find((a) => a.status === "revisi") && (
                    <div
                      style={{
                        background: "#FCEBEB",
                        borderRadius: 8,
                        padding: "6px 10px",
                        fontSize: 12,
                        color: "#A32D2D",
                        marginTop: 8,
                      }}
                    >
                      <strong style={{ fontWeight: 500 }}>Catatan PIC:</strong>{" "}
                      Silakan perbaiki dan submit ulang.
                    </div>
                  )}
              </div>
              <Badge type={statusBadgeType[ev.status]}>{ev.status}</Badge>
            </div>
            {user.role === "member" && ev.status === "aktif" && (
              <button
                onClick={() => onNav("submit")}
                style={{
                  marginTop: 8,
                  padding: "4px 10px",
                  background: "#1a1a1a",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                Submit Hasil
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// SUBMIT PAGE
// ============================================================
function SubmitPage({ user, events, onNav, onToast }) {
  const [task, setTask] = useState("");
  const [link, setLink] = useState("");
  const [note, setNote] = useState("");
  const [statusVal, setStatusVal] = useState("done");

  const myTasks = events.filter(
    (e) =>
      e.assignees.some((a) => a.name === user.name) &&
      (e.status === "aktif" || e.status === "revisi"),
  );
  const selectedTask = myTasks.find((e) => String(e.id) === task);

  function doSubmit() {
    if (!task) {
      onToast("Pilih tugas terlebih dahulu!");
      return;
    }
    if (!link) {
      onToast("Masukkan link hasil kerja!");
      return;
    }
    onToast("Submit berhasil! PIC akan mereview segera.");
    setTask("");
    setLink("");
    setNote("");
    setTimeout(() => onNav("mywork"), 1200);
  }

  return (
    <div style={{ flex: 1, overflow: "auto", padding: 20 }}>
      <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 4 }}>
        Submit Konten
      </div>
      <div style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>
        Kirim hasil kerja ke PIC untuk direview
      </div>
      <Card>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>
            Pilih Tugas Aktif
          </div>
          <select
            value={task}
            onChange={(e) => setTask(e.target.value)}
            style={{
              width: "100%",
              padding: "7px 10px",
              border: "0.5px solid #ccc",
              borderRadius: 8,
              fontSize: 13,
            }}
          >
            <option value="">Pilih tugas...</option>
            {myTasks.map((e) => {
              const myRole = e.assignees.find((a) => a.name === user.name);
              return (
                <option key={e.id} value={e.id}>
                  {e.title} ({myRole?.role})
                  {e.status === "revisi" ? " · REVISI" : ""}
                </option>
              );
            })}
          </select>
        </div>
        {selectedTask && (
          <div
            style={{
              background: "#f5f5f3",
              borderRadius: 8,
              padding: "10px 12px",
              marginBottom: 12,
              fontSize: 12,
              color: "#666",
            }}
          >
            PIC: {selectedTask.pic} · Deadline: {selectedTask.end} · Kategori:{" "}
            {selectedTask.cat}
          </div>
        )}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>
            Link Hasil Kerja
          </div>
          <input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            style={{
              width: "100%",
              padding: "7px 10px",
              border: "0.5px solid #ccc",
              borderRadius: 8,
              fontSize: 13,
              boxSizing: "border-box",
            }}
            placeholder="Google Drive, Figma, Notion, YouTube..."
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>
            Catatan untuk PIC
          </div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            style={{
              width: "100%",
              padding: "7px 10px",
              border: "0.5px solid #ccc",
              borderRadius: 8,
              fontSize: 13,
              resize: "vertical",
              boxSizing: "border-box",
            }}
            placeholder="Jelaskan apa yang dikerjakan, kendala, atau hal yang perlu diperhatikan..."
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>
            Status Pengerjaan
          </div>
          <select
            value={statusVal}
            onChange={(e) => setStatusVal(e.target.value)}
            style={{
              width: "100%",
              padding: "7px 10px",
              border: "0.5px solid #ccc",
              borderRadius: 8,
              fontSize: 13,
            }}
          >
            <option value="done">Selesai — siap direview</option>
            <option value="draft">Draft — minta feedback awal</option>
            <option value="partial">
              Sebagian — ada yang masih dikerjakan
            </option>
          </select>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button
            onClick={() => onNav("mywork")}
            style={{
              padding: "6px 14px",
              border: "0.5px solid #ccc",
              borderRadius: 8,
              background: "transparent",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Batal
          </button>
          <button
            onClick={doSubmit}
            style={{
              padding: "6px 14px",
              background: "#1a1a1a",
              color: "white",
              border: "none",
              borderRadius: 8,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Kirim ke PIC
          </button>
        </div>
      </Card>
    </div>
  );
}

// ============================================================
// DELEGATE PAGE
// ============================================================
function DelegatePage({ user, events, setEvents, onNav, onToast }) {
  const [title, setTitle] = useState("");
  const [cat, setCat] = useState("Instagram");
  const [type, setType] = useState("utama");
  const [startDate, setStartDate] = useState("2025-04-22");
  const [endDate, setEndDate] = useState("2025-04-28");
  const [brief, setBrief] = useState("");
  const [assignRows, setAssignRows] = useState([{ person: "", role: "" }]);

  const clsMap = {
    Rina: "av-pink",
    Budi: "av-blue",
    Inul: "av-teal",
    Redul: "av-amber",
    Andi: "av-blue",
    Sinta: "av-green",
    Reza: "av-purple",
  };

  function addRow() {
    setAssignRows((r) => [...r, { person: "", role: "" }]);
  }
  function removeRow(i) {
    setAssignRows((r) => r.filter((_, idx) => idx !== i));
  }
  function updateRow(i, field, val) {
    setAssignRows((r) =>
      r.map((row, idx) => (idx === i ? { ...row, [field]: val } : row)),
    );
  }

  function doSubmit() {
    if (!title) {
      onToast("Isi judul konten!");
      return;
    }
    const validRows = assignRows.filter((r) => r.person && r.role);
    if (validRows.length === 0) {
      onToast("Tambahkan minimal satu penugasan!");
      return;
    }
    const newEvent = {
      id: events.length + Date.now(),
      title,
      cat,
      start: startDate,
      end: endDate,
      status: "aktif",
      pic: user.name,
      assignees: validRows.map((r) => ({
        name: r.person,
        role: r.role,
        cls: clsMap[r.person] || "av-gray",
        status: "aktif",
      })),
    };
    setEvents((ev) => [...ev, newEvent]);
    onToast("Konten dibuat & tampil di kalender!");
    setTitle("");
    setBrief("");
    setAssignRows([{ person: "", role: "" }]);
    setTimeout(() => onNav("calendar"), 1200);
  }

  return (
    <div style={{ flex: 1, overflow: "auto", padding: 20 }}>
      <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 4 }}>
        Buat Konten & Delegasi
      </div>
      <div style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>
        Buat konten baru, tentukan deadline, dan delegasikan ke tim
      </div>
      <Card>
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 12 }}>
          Detail Konten
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: 12,
          }}
        >
          <div>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>
              Judul Konten
            </div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: "100%",
                padding: "7px 10px",
                border: "0.5px solid #ccc",
                borderRadius: 8,
                fontSize: 13,
                boxSizing: "border-box",
              }}
              placeholder="Judul konten..."
            />
          </div>
          <div>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>
              Kategori
            </div>
            <select
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              style={{
                width: "100%",
                padding: "7px 10px",
                border: "0.5px solid #ccc",
                borderRadius: 8,
                fontSize: 13,
              }}
            >
              {[
                "Instagram",
                "TikTok",
                "YouTube",
                "Artikel",
                "Podcast",
                "Event",
              ].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: 12,
          }}
        >
          <div>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>
              Tanggal Mulai
            </div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{
                width: "100%",
                padding: "7px 10px",
                border: "0.5px solid #ccc",
                borderRadius: 8,
                fontSize: 13,
                boxSizing: "border-box",
              }}
            />
          </div>
          <div>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>
              Deadline
            </div>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{
                width: "100%",
                padding: "7px 10px",
                border: "0.5px solid #ccc",
                borderRadius: 8,
                fontSize: 13,
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>
            Brief
          </div>
          <textarea
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            rows={2}
            style={{
              width: "100%",
              padding: "7px 10px",
              border: "0.5px solid #ccc",
              borderRadius: 8,
              fontSize: 13,
              resize: "vertical",
              boxSizing: "border-box",
            }}
            placeholder="Konsep dan referensi..."
          />
        </div>
      </Card>
      <Card>
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>
          Penugasan Tim
        </div>
        <div style={{ fontSize: 12, color: "#888", marginBottom: 12 }}>
          Satu konten bisa dikerjakan beberapa orang dengan peran berbeda
        </div>
        {assignRows.map((row, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              marginBottom: 6,
              padding: 8,
              background: "#f5f5f3",
              borderRadius: 8,
            }}
          >
            <select
              value={row.person}
              onChange={(e) => updateRow(i, "person", e.target.value)}
              style={{
                flex: 1,
                padding: "7px 10px",
                border: "0.5px solid #ccc",
                borderRadius: 8,
                fontSize: 13,
              }}
            >
              <option value="">Pilih orang...</option>
              {TEAM.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <select
              value={row.role}
              onChange={(e) => updateRow(i, "role", e.target.value)}
              style={{
                flex: 1,
                padding: "7px 10px",
                border: "0.5px solid #ccc",
                borderRadius: 8,
                fontSize: 13,
              }}
            >
              <option value="">Pilih peran...</option>
              {ROLES_LIST.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
            {assignRows.length > 1 && (
              <button
                onClick={() => removeRow(i)}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  border: "0.5px solid #ccc",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: 16,
                  color: "#888",
                }}
              >
                ×
              </button>
            )}
          </div>
        ))}
        <button
          onClick={addRow}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "7px 12px",
            border: "1px dashed #ccc",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 12,
            color: "#888",
            background: "transparent",
            marginBottom: 12,
          }}
        >
          + Tambah penugasan
        </button>
        <div
          style={{
            borderTop: "0.5px solid #eee",
            paddingTop: 12,
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
          }}
        >
          <button
            onClick={() => onNav("calendar")}
            style={{
              padding: "6px 14px",
              border: "0.5px solid #ccc",
              borderRadius: 8,
              background: "transparent",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Batal
          </button>
          <button
            onClick={doSubmit}
            style={{
              padding: "6px 14px",
              background: "#1a1a1a",
              color: "white",
              border: "none",
              borderRadius: 8,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Buat & Tampilkan di Kalender
          </button>
        </div>
      </Card>
    </div>
  );
}

// ============================================================
// REVIEW PAGE
// ============================================================
function ReviewPage({ user, events, setEvents, onToast }) {
  const toReview = events.filter(
    (e) =>
      (user.role === "pic" ? e.pic === user.name : true) &&
      e.status === "review",
  );
  const [notes, setNotes] = useState({});
  const [processed, setProcessed] = useState({});

  function doApprove(id) {
    setEvents((evs) =>
      evs.map((e) => (e.id === id ? { ...e, status: "selesai" } : e)),
    );
    setProcessed((p) => ({ ...p, [id]: "approved" }));
    onToast("Konten diapprove! Notifikasi terkirim.");
  }

  function doRevision(id) {
    if (!notes[id]) {
      onToast("Tulis catatan revisi dulu!");
      return;
    }
    setEvents((evs) =>
      evs.map((e) => (e.id === id ? { ...e, status: "revisi" } : e)),
    );
    setProcessed((p) => ({ ...p, [id]: "revision" }));
    onToast("Revisi terkirim ke anggota!");
  }

  return (
    <div style={{ flex: 1, overflow: "auto", padding: 20 }}>
      <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 4 }}>
        Review Submit
      </div>
      <div style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>
        Konten yang disubmit tim — approve atau beri catatan revisi
      </div>
      {toReview.length === 0 && (
        <Card>
          <div style={{ fontSize: 13, color: "#888" }}>
            Tidak ada konten yang perlu direview saat ini.
          </div>
        </Card>
      )}
      {toReview.map((ev) => (
        <Card key={ev.id}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              marginBottom: 12,
            }}
          >
            <Avatar
              cls={ev.assignees[0]?.cls || "av-gray"}
              init={(ev.assignees[0]?.name || "?").slice(0, 2).toUpperCase()}
              size={32}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{ev.title}</div>
              <div style={{ fontSize: 12, color: "#888" }}>
                {ev.assignees.map((a) => `${a.name} (${a.role})`).join(", ")} ·{" "}
                {ev.cat} · Deadline: {ev.end}
              </div>
              <Badge type="green">Disubmit</Badge>
            </div>
          </div>
          {!processed[ev.id] ? (
            <>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>
                  Catatan Revisi (kosongkan jika tidak ada)
                </div>
                <textarea
                  value={notes[ev.id] || ""}
                  onChange={(e) =>
                    setNotes((n) => ({ ...n, [ev.id]: e.target.value }))
                  }
                  rows={2}
                  style={{
                    width: "100%",
                    padding: "7px 10px",
                    border: "0.5px solid #ccc",
                    borderRadius: 8,
                    fontSize: 13,
                    resize: "none",
                    boxSizing: "border-box",
                  }}
                  placeholder="Tulis catatan spesifik..."
                />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => doApprove(ev.id)}
                  style={{
                    padding: "6px 14px",
                    background: "#1a1a1a",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  Approve
                </button>
                <button
                  onClick={() => doRevision(ev.id)}
                  style={{
                    padding: "6px 14px",
                    border: "0.5px solid #E24B4A",
                    color: "#A32D2D",
                    background: "transparent",
                    borderRadius: 8,
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  Kirim Revisi
                </button>
              </div>
            </>
          ) : (
            <div
              style={{
                fontSize: 12,
                color: processed[ev.id] === "approved" ? "#3B6D11" : "#A32D2D",
                padding: "6px 0",
              }}
            >
              {processed[ev.id] === "approved"
                ? "✓ Approved — notifikasi terkirim."
                : "✓ Catatan revisi dikirim ke tim."}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

// ============================================================
// USERS PAGE
// ============================================================
function UsersPage() {
  const userList = [
    {
      name: "Manager",
      email: "manager@prodflow.com",
      cls: "av-gray",
      init: "MG",
      role: "Manager",
      cats: "Semua",
      status: "Aktif",
    },
    {
      name: "Rina",
      email: "rina@prodflow.com",
      cls: "av-pink",
      init: "RI",
      role: "PIC",
      cats: "Instagram, Artikel",
      status: "Aktif",
    },
    {
      name: "Budi",
      email: "budi@prodflow.com",
      cls: "av-blue",
      init: "BU",
      role: "PIC",
      cats: "TikTok, Podcast",
      status: "Aktif",
    },
    {
      name: "Inul",
      email: "inul@prodflow.com",
      cls: "av-teal",
      init: "IN",
      role: "Tim",
      cats: "—",
      status: "Aktif",
    },
    {
      name: "Redul",
      email: "redul@prodflow.com",
      cls: "av-amber",
      init: "RE",
      role: "Tim",
      cats: "—",
      status: "Aktif",
    },
  ];
  const roleType = { Manager: "purple", PIC: "blue", Tim: "gray" };
  return (
    <div style={{ flex: 1, overflow: "auto", padding: 20 }}>
      <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 4 }}>
        Manajemen User
      </div>
      <div style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>
        Atur akun dan PIC kategori
      </div>
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}
        >
          <thead>
            <tr style={{ borderBottom: "0.5px solid #eee" }}>
              {["Nama", "Email", "Akses", "PIC Kategori", "Status"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "10px 12px",
                    fontSize: 11,
                    color: "#888",
                    fontWeight: 500,
                    textAlign: "left",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {userList.map((u) => (
              <tr key={u.email} style={{ borderBottom: "0.5px solid #eee" }}>
                <td style={{ padding: "8px 12px" }}>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <Avatar cls={u.cls} init={u.init} size={22} />
                    {u.name}
                  </div>
                </td>
                <td style={{ padding: "6px 8px", color: "#888" }}>{u.email}</td>
                <td style={{ padding: "6px 8px" }}>
                  <Badge type={roleType[u.role] || "gray"}>{u.role}</Badge>
                </td>
                <td style={{ padding: "6px 8px", color: "#888" }}>{u.cats}</td>
                <td style={{ padding: "6px 8px" }}>
                  <Badge type="green">{u.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activePage, setActivePage] = useState("calendar");
  const [events, setEvents] = useState(INIT_EVENTS);
  const [toast, setToast] = useState("");

  function handleLogin(email, user) {
    setCurrentUser({ email, ...user });
    setActivePage("calendar");
  }

  function handleLogout() {
    setCurrentUser(null);
    setActivePage("calendar");
  }

  if (!currentUser) return <LoginPage onLogin={handleLogin} />;

  const pageProps = {
    user: currentUser,
    events,
    setEvents,
    onNav: setActivePage,
    onToast: setToast,
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <Sidebar
        user={currentUser}
        activePage={activePage}
        onNav={setActivePage}
        onLogout={handleLogout}
      />
      {activePage === "calendar" && <CalendarPage {...pageProps} />}
      {activePage === "dashboard" && <DashboardPage {...pageProps} />}
      {activePage === "mywork" && <MyWorkPage {...pageProps} />}
      {activePage === "submit" && <SubmitPage {...pageProps} />}
      {activePage === "delegate" && <DelegatePage {...pageProps} />}
      {activePage === "review" && <ReviewPage {...pageProps} />}
      {activePage === "users" && <UsersPage />}
      <Toast msg={toast} onClose={() => setToast("")} />
    </div>
  );
}
