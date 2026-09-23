import { useState, useEffect, useRef } from "react";
import { icons as brandIcons } from "@iconify-json/logos";
import portrait1 from "./imports/image-1.png";
import portrait2 from "./imports/image-2.png";
import Chatbot from "./Chatbot";

// ─── Palette: matcha green ────────────────────────────────────────────────────
// bg: #F7FAF0  matcha: #7FAE60  deep: #3D5C2E  light: #B8D4A0  text: #2A3824

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useFadeIn(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function useCounter(target: number, active: boolean, duration = 1300) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let frame = 0;
    const total = Math.round(duration / 16);
    const t = setInterval(() => {
      frame++;
      setCount(Math.floor((1 - Math.pow(1 - frame / total, 3)) * target));
      if (frame >= total) {
        setCount(target);
        clearInterval(t);
      }
    }, 16);
    return () => clearInterval(t);
  }, [target, active, duration]);
  return count;
}

function Reveal({
  children,
  delay = 0,
  from = "bottom",
  className = "",
  threshold = 0.1,
}: {
  children: React.ReactNode;
  delay?: number;
  from?: "bottom" | "left" | "right";
  className?: string;
  threshold?: number;
}) {
  const { ref, visible } = useFadeIn(threshold);
  const tr =
    from === "left"
      ? "translateX(-28px)"
      : from === "right"
        ? "translateX(28px)"
        : "translateY(24px)";
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : tr,
        transition: `opacity .72s cubic-bezier(.25,.8,.25,1) ${delay}ms,transform .72s cubic-bezier(.25,.8,.25,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function StatCell({
  raw,
  label,
  active,
  dark = true,
}: {
  raw: string;
  label: string;
  active: boolean;
  dark?: boolean;
}) {
  const num = parseInt(raw, 10);
  const suffix = raw.replace(/\d+/, "");
  const count = useCounter(num, active);
  return (
    <div className="text-center px-3 py-2">
      <p
        className="text-xl font-semibold"
        style={{
          fontFamily: "Playfair Display,serif",
          color: dark ? "#fff" : "#2A3824",
        }}
      >
        {active ? `${count}${suffix}` : raw}
      </p>
      <p
        className="text-[10px] leading-tight mt-0.5"
        style={{ color: dark ? "#B8D4A0" : "#52634A" }}
      >
        {label}
      </p>
    </div>
  );
}

function Orb({
  size = 260,
  color,
  className = "",
}: {
  size?: number;
  color: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`absolute rounded-full pointer-events-none select-none ${className}`}
      style={{
        width: size,
        height: size,
        background: color,
        filter: `blur(${Math.round(size * 0.28)}px)`,
        opacity: 0.38,
      }}
    />
  );
}
function Arc({
  className = "",
  opacity = 0.22,
}: {
  className?: string;
  opacity?: number;
}) {
  return (
    <svg
      viewBox="0 0 180 180"
      fill="none"
      aria-hidden
      className={`pointer-events-none select-none ${className}`}
    >
      <path
        d="M 10 170 Q 10 10 170 10"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity={opacity}
      />
    </svg>
  );
}
function Dots({ className = "" }: { className?: string }) {
  const pts = [
    [8, 8],
    [28, 20],
    [52, 10],
    [76, 28],
    [96, 8],
    [18, 48],
    [56, 44],
    [82, 54],
    [12, 78],
    [44, 82],
    [78, 68],
    [96, 88],
  ];
  return (
    <svg
      viewBox="0 0 108 96"
      fill="currentColor"
      aria-hidden
      className={`pointer-events-none select-none ${className}`}
    >
      {pts.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="1.6" opacity="0.35" />
      ))}
    </svg>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Resume", href: "#resume" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

const SERVICES = [
  {
    id: 1,
    featured: true,
    title: "Customer Service",
    short:
      "Providing friendly, professional, and reliable support so your clients feel valued and heard.",
    features: [
      "Customer inquiries",
      "Chat & email support",
      "Follow-ups",
      "Complaint handling",
      "Client communication",
      "Satisfaction support",
    ],
  },
  {
    id: 2,
    featured: true,
    title: "Email Management",
    short:
      "Keeping your inbox organized, communication clear, and important messages handled efficiently.",
    features: [
      "Inbox organization",
      "Sorting & filtering",
      "Professional replies",
      "Follow-ups",
      "Appointment coordination",
      "Calendar scheduling",
    ],
  },
  {
    id: 3,
    title: "Administrative Support",
    short: "Handling day-to-day admin so you can focus on what matters most.",
    features: [
      "Document management",
      "Report preparation",
      "File organization",
      "Meeting coordination",
    ],
  },
  {
    id: 4,
    title: "Data Entry & Research",
    short:
      "Accurate, timely data entry so your records stay clean and current.",
    features: [
      "Data entry",
      "Web research",
      "Database management",
      "Spreadsheet work",
    ],
  },
  {
    id: 5,
    title: "Calendar Management",
    short:
      "Never miss a meeting — I keep your schedule organized and protected.",
    features: [
      "Appointment scheduling",
      "Meeting reminders",
      "Conflict resolution",
      "Time blocking",
    ],
  },
  {
    id: 6,
    title: "Social Media Assistance",
    short: "Keeping your social presence active, consistent, and engaging.",
    features: [
      "Content scheduling",
      "Community management",
      "Caption writing",
      "Analytics tracking",
    ],
  },
];

const PROJECTS = [
  {
    id: 1,
    title: "Customer Service Support",
    category: "Customer Service",
    description:
      "Managed end-to-end customer inquiries, follow-ups, and professional client communication for a growing e-commerce brand.",
    tools: ["Gmail", "Zendesk", "Slack", "Notion"],
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop&auto=format",
  },
  {
    id: 2,
    title: "Email Management System",
    category: "Email Management",
    description:
      "Designed organized inbox workflows, templated responses, and communication processes for a coaching business.",
    tools: ["Outlook", "Notion", "Google Calendar", "Trello"],
    image:
      "https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?w=600&h=400&fit=crop&auto=format",
  },
  {
    id: 3,
    title: "Administrative Support",
    category: "Administrative",
    description:
      "Streamlined scheduling, document management, and administrative tasks for a busy solopreneur.",
    tools: ["Google Workspace", "Notion", "Zoom", "Teams"],
    image:
      "https://images.unsplash.com/photo-1558478551-1a378f63328e?w=600&h=400&fit=crop&auto=format",
  },
  {
    id: 4,
    title: "Social Media Coordination",
    category: "Social Media",
    description:
      "Scheduled and managed social content across platforms, tracked engagement, and supported community management.",
    tools: ["Buffer", "Canva", "Instagram", "Facebook"],
    image:
      "https://images.unsplash.com/photo-1570993492881-25240ce854f4?w=600&h=400&fit=crop&auto=format",
  },
];

const TESTIMONIALS = [
  {
    id: 1,
    name: "Jessica Morales",
    role: "CEO, Bloom Digital Agency",
    text: "Working with Kate completely transformed how we handle client communications. Her attention to detail and quick response times are unmatched. Our inbox went from chaotic to perfectly organized in just one week.",
    service: "Email Management",
    rating: 5,
    initials: "JM",
    bg: "#E6F0D8",
  },
  {
    id: 2,
    name: "David Okafor",
    role: "Founder, Okafor Consulting",
    text: "I was drowning in customer inquiries before Kate stepped in. She's professional, proactive, and genuinely cares about making every client feel heard. Couldn't run my business without her.",
    service: "Customer Service",
    rating: 5,
    initials: "DO",
    bg: "#B8D4A0",
  },
  {
    id: 3,
    name: "Sarah Chen",
    role: "Online Business Manager",
    text: "Kate handles my entire calendar and a chunk of my admin work. She anticipates needs before I even ask. If you're looking for a VA who truly gets it — she's the one.",
    service: "Administrative Support",
    rating: 5,
    initials: "SC",
    bg: "#D6E9C4",
  },
];

const TOOLS: Record<string, string[]> = {
  Productivity: [
    "Google Workspace",
    "Microsoft Office",
    "Google Calendar",
    "Notion",
    "Trello",
  ],
  Communication: ["Gmail", "Outlook", "Zoom", "Slack", "Microsoft Teams"],
  "Customer Service": [
    "Zendesk",
    "Freshdesk",
    "Intercom",
    "HubSpot",
    "LiveChat",
  ],
  Skills: [
    "Customer Service",
    "Email Management",
    "Admin Support",
    "Data Entry",
    "Time Management",
    "Organization",
  ],
};

const PROJECT_FILTERS = [
  "All",
  "Customer Service",
  "Email Management",
  "Administrative",
  "Social Media",
];

const SERVICE_ICONS = [
  <svg
    key="cs"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    className="w-7 h-7"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
    />
  </svg>,
  <svg
    key="em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    className="w-7 h-7"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
    />
  </svg>,
  <svg
    key="ad"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"
    />
  </svg>,
  <svg
    key="de"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
    />
  </svg>,
  <svg
    key="ca"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
    />
  </svg>,
  <svg
    key="sm"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
    />
  </svg>,
];

// ─── Nav ──────────────────────────────────────────────────────────────────────

function Nav({
  darkMode,
  onToggleTheme,
}: {
  darkMode: boolean;
  onToggleTheme: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("#home");
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  useEffect(() => {
    const sections = NAV_LINKS.map((link) =>
      document.querySelector(link.href),
    ).filter((section): section is Element => Boolean(section));
    const updateActiveSection = () => {
      const currentSection = [...sections]
        .reverse()
        .find((section) => section.getBoundingClientRect().top <= 140);
      setActiveSection(currentSection ? `#${currentSection.id}` : "#home");
    };
    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    return () => window.removeEventListener("scroll", updateActiveSection);
  }, []);
  const navigateTo = (href: string) => {
    setActiveSection(href);
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? "rgba(247,250,240,0.88)"
          : "rgba(247,250,240,0.68)",
        backdropFilter: "blur(18px) saturate(140%)",
        borderBottom: "1px solid rgba(214,233,196,0.72)",
        boxShadow: scrolled ? "0 8px 24px rgba(42,56,36,0.08)" : "none",
      }}
    >
      <nav className="nav-shell w-full px-6 sm:px-8 lg:px-12 h-20 lg:h-24 flex items-center justify-between gap-8">
        <a href="#home" className="nav-brand flex items-center gap-3 shrink-0">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold text-white"
            style={{
              background: "linear-gradient(135deg,#7FAE60,#3D5C2E)",
              fontFamily: "Playfair Display,serif",
            }}
          >
            KY
          </div>
          <span
            className="font-semibold text-sm tracking-tight"
            style={{ color: "#2A3824" }}
          >
            Kate Yu Villaraza
          </span>
        </a>
        <ul className="hidden md:flex items-center gap-9 lg:gap-10">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className={`text-sm px-3 py-1.5 rounded-full transition-all duration-300 hover:text-[#D96C82] ${activeSection === l.href ? "font-semibold theme-nav-active" : ""}`}
                style={{
                  color: activeSection === l.href ? "#D96C82" : "#2A3824",
                  background:
                    activeSection === l.href ? "#E6F0D8" : "transparent",
                  boxShadow:
                    activeSection === l.href
                      ? "0 4px 12px rgba(61,92,46,0.12)"
                      : "none",
                  transform:
                    activeSection === l.href ? "translateY(-1px)" : "none",
                }}
                onClick={(event) => {
                  event.preventDefault();
                  navigateTo(l.href);
                }}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="nav-actions hidden md:flex items-center gap-3">
          <button
            type="button"
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
            aria-pressed={darkMode}
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            onClick={onToggleTheme}
            className="theme-toggle w-14 h-8 items-center rounded-full border-2 p-1 transition-all hover:-translate-y-0.5"
            style={{
              borderColor: darkMode ? "#52634A" : "#D6E9C4",
              background: darkMode ? "#3D5C2E" : "#E6F0D8",
            }}
          >
            <span
              className={`theme-toggle-knob flex w-6 h-6 items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-300 ${darkMode ? "translate-x-6" : "translate-x-0"}`}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke={darkMode ? "#D96C82" : "#3D5C2E"}
                strokeWidth={1.8}
                className="w-3.5 h-3.5"
                aria-hidden="true"
              >
                {darkMode ? (
                  <path
                    strokeLinecap="round"
                    d="M20 15.5A8.5 8.5 0 018.5 4 8.5 8.5 0 1020 15.5z"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    d="M12 3v1.5M12 19.5V21M3 12h1.5M19.5 12H21m-3.36-6.36l-1.06 1.06M7.42 17.58l-1.06 1.06m0-13l1.06 1.06m9.16 9.16l1.06 1.06M15.5 12a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0z"
                  />
                )}
              </svg>
            </span>
          </button>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-white transition-all hover:opacity-90 hover:-translate-y-px"
            style={{ background: "linear-gradient(135deg,#FD9FAE,#D96C82)" }}
          >
            Work With Me
          </a>
        </div>
        <button
          className="mobile-menu-toggle md:hidden"
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          style={{ color: "#3D5C2E" }}
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-6 h-6"
            >
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-6 h-6"
            >
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>
      {open && (
        <div
          className="mobile-nav-panel md:hidden px-6 pb-6 pt-2 flex flex-col gap-4 border-t"
          style={{
            background: "rgba(247,250,240,0.98)",
            borderColor: "#D6E9C4",
          }}
        >
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`text-base py-2 px-3 rounded-lg transition-colors ${activeSection === l.href ? "font-semibold theme-nav-active" : ""}`}
              style={{
                color: activeSection === l.href ? "#D96C82" : "#2A3824",
                background:
                  activeSection === l.href ? "#E6F0D8" : "transparent",
                boxShadow:
                  activeSection === l.href
                    ? "0 4px 12px rgba(61,92,46,0.1)"
                    : "none",
              }}
              onClick={(event) => {
                event.preventDefault();
                navigateTo(l.href);
              }}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            className="mobile-nav-cta mt-2 py-3 rounded-full text-sm font-medium text-white text-center"
            style={{ background: "linear-gradient(135deg,#FD9FAE,#D96C82)" }}
            onClick={() => setOpen(false)}
          >
            Work With Me
          </a>
          <button
            type="button"
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
            aria-pressed={darkMode}
            onClick={onToggleTheme}
            className="theme-toggle-mobile mt-1 flex items-center justify-between gap-3 px-4 py-3 rounded-2xl text-sm font-medium border transition-colors"
            style={{
              color: darkMode ? "#FDE1E6" : "#3D5C2E",
              borderColor: darkMode ? "#52634A" : "#D6E9C4",
              background: darkMode ? "#263829" : "#F7FAF0",
            }}
          >
            <span className="flex items-center gap-2">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                className="w-4 h-4"
                aria-hidden="true"
              >
                {darkMode ? (
                  <path
                    strokeLinecap="round"
                    d="M20 15.5A8.5 8.5 0 018.5 4 8.5 8.5 0 1020 15.5z"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    d="M12 3v1.5M12 19.5V21M3 12h1.5M19.5 12H21m-3.36-6.36l-1.06 1.06M7.42 17.58l-1.06 1.06m0-13l1.06 1.06m9.16 9.16l1.06 1.06M15.5 12a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0z"
                  />
                )}
              </svg>
              {darkMode ? "Light Mode" : "Dark Mode"}
            </span>
            <span
              className="theme-toggle-track flex w-12 h-7 items-center rounded-full p-1"
              style={{ background: darkMode ? "#3D5C2E" : "#D6E9C4" }}
            >
              <span
                className={`theme-toggle-knob block w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${darkMode ? "translate-x-5" : "translate-x-0"}`}
              />
            </span>
          </button>
        </div>
      )}
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  const { ref, visible } = useFadeIn(0.05);
  const resumeUrl = `${import.meta.env.BASE_URL}resume-villaraza.pdf`;

  return (
    <section
      id="home"
      className="min-h-screen flex items-center pt-20 overflow-hidden relative"
      style={{
        background:
          "linear-gradient(135deg,#F7FAF0 0%,#FFF4F6 58%,#FDE1E6 100%)",
      }}
    >
      <Orb
        size={360}
        color="linear-gradient(135deg,#FD9FAE,#D96C82)"
        className="top-0 right-[-80px]"
      />
      <Orb
        size={240}
        color="linear-gradient(135deg,#FD9FAE,#D96C82)"
        className="bottom-16 left-[-60px]"
      />
      <Arc
        className="absolute top-24 left-8 w-36 text-[#FD9FAE] hidden lg:block"
        opacity={0.18}
      />
      <Dots className="absolute bottom-32 right-12 w-24 text-[#FD9FAE] hidden lg:block" />
      <div className="max-w-6xl mx-auto px-6 w-full py-16 grid md:grid-cols-2 gap-12 items-center">
        <div ref={ref} className="flex flex-col gap-6 order-2 md:order-1">
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateY(20px)",
              transition: "opacity .6s ease 0ms,transform .6s ease 0ms",
            }}
          >
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium"
              style={{ background: "#FD9FAE", color: "#FFFFFF" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Available for New Clients
            </span>
          </div>
          <h1
            className="text-4xl md:text-5xl lg:text-[3.4rem] leading-[1.1]"
            style={{
              fontFamily: "Playfair Display,serif",
              fontWeight: 500,
              color: "#2A3824",
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateY(28px)",
              transition: "opacity .7s ease 100ms,transform .7s ease 100ms",
            }}
          >
            Your Reliable
            <br />
            <em className="italic" style={{ color: "#FD9FAE" }}>
              Partner
            </em>{" "}
            in
            <br />
            Productivity.
          </h1>
          <p
            className="text-[15px] leading-relaxed max-w-md"
            style={{
              color: "#52634A",
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateY(20px)",
              transition: "opacity .7s ease 200ms,transform .7s ease 200ms",
            }}
          >
            Helping businesses stay organized, connected, and focused through
            reliable customer service, email management, and administrative
            support.
          </p>
          <div
            className="flex flex-wrap gap-3 mt-1"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateY(16px)",
              transition: "opacity .7s ease 320ms,transform .7s ease 320ms",
            }}
          >
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium text-white transition-all hover:opacity-90 hover:-translate-y-px"
              style={{ background: "linear-gradient(135deg,#FD9FAE,#D96C82)" }}
            >
              Work With Me{" "}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </a>
            <a
              href={resumeUrl}
              download="resume-villaraza.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium border transition-all hover:bg-[#FDE3E7]"
              style={{ borderColor: "#FD9FAE", color: "#8F4051" }}
            >
              Download Resume
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"
                />
              </svg>
            </a>
          </div>
          <div
            className="hero-specialization inline-flex flex-col gap-3 self-start px-4 py-3.5 rounded-2xl border shadow-sm"
            style={{
              background: "#FFF4F6",
              borderColor: "#FD9FAE",
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateY(12px)",
              transition: "opacity .7s ease 440ms,transform .7s ease 440ms",
            }}
          >
            <div className="flex items-center gap-3">
              <span
                className="specialization-icon w-9 h-9 rounded-xl flex items-center justify-center text-base"
                style={{ background: "#FDE3E7", color: "#D96C82" }}
              >
                ✦
              </span>
              <div>
                <p
                  className="text-[10px] font-semibold uppercase tracking-widest"
                  style={{ color: "#8F4051" }}
                >
                  Primary Specialization
                </p>
                <p className="text-xs" style={{ color: "#52634A" }}>
                  Reliable support, every day
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span
                className="specialization-customer px-2.5 py-1 rounded-full text-[11px] font-medium"
                style={{ background: "#E6F0D8", color: "#3D5C2E" }}
              >
                Customer Service
              </span>
              <span
                className="specialization-email px-2.5 py-1 rounded-full text-[11px] font-medium"
                style={{ background: "#FDE3E7", color: "#8F4051" }}
              >
                Email Management
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-center order-1 md:order-2 relative">
          <Orb
            size={280}
            color="#C8DFAF"
            className="top-[-20px] right-0 opacity-50"
          />
          <div
            className="relative z-10 shadow-xl"
            style={{
              width: 300,
              height: 360,
              borderRadius: "50% 50% 40% 40% / 55% 55% 45% 45%",
              overflow: "hidden",
              background: "#D6E9C4",
              border: "4px solid #E6F0D8",
            }}
          >
            <img
              src={portrait1}
              alt="Kate Yu Villaraza"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div
            className="absolute bottom-2 left-0 z-20 px-4 py-3 rounded-2xl shadow-lg flex items-center gap-3"
            style={{ background: "#3D5C2E" }}
          >
            {[
              { raw: "50+", label: "Clients Served" },
              { raw: "13+", label: "Insurance Exp." },
            ].map((s, i, a) => (
              <div key={s.label} className="flex items-center gap-3">
                <StatCell raw={s.raw} label={s.label} active={visible} />
                {i < a.length - 1 && (
                  <div className="w-px h-8 opacity-30 bg-[#B8D4A0]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div
        className="absolute bottom-0 left-0 right-0 py-3.5 border-t hidden md:block"
        style={{ borderColor: "#D6E9C4", background: "rgba(247,250,240,0.85)" }}
      >
        <div
          className="max-w-6xl mx-auto px-6 flex items-center justify-center gap-10 text-[11px] uppercase tracking-widest font-medium"
          style={{ color: "#7A8F72" }}
        >
          {[
            "Graphic & Web Design",
            "General Virtual Assistant",
            "Data Entry Specialist",
            "Social Media Manager",
          ].map((r, i, a) => (
            <span key={r} className="flex items-center gap-10">
              {r}
              {i < a.length - 1 && (
                <span
                  className="w-1 h-1 rounded-full inline-block"
                  style={{ background: "#B8D4A0" }}
                />
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────

function About() {
  const { ref: statsRef, visible: statsVisible } = useFadeIn();
  const stats = [
    { raw: "13+", label: "Insurance Experience" },
    { raw: "50+", label: "Clients Supported" },
    { raw: "120+", label: "Projects Completed" },
    { raw: "98%", label: "Client Satisfaction" },
  ];
  const strengths = [
    "Customer-focused",
    "Organized & reliable",
    "Detail-oriented",
    "Strong communicator",
    "Problem solver",
    "Quick learner",
  ];
  return (
    <section
      id="about"
      className="py-24 relative overflow-hidden"
      style={{ background: "#FFF4F6" }}
    >
      <Orb size={320} color="#E6F0D8" className="top-[-60px] right-[-80px]" />
      <Arc
        className="absolute bottom-16 left-8 w-28 text-[#7FAE60]"
        opacity={0.2}
      />
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">
        <Reveal from="left">
          <div className="relative">
            <div
              className="absolute -top-5 -left-5 w-full h-full rounded-3xl pointer-events-none"
              style={{ background: "#E6F0D8" }}
            />
            <div
              className="relative z-10 rounded-3xl overflow-hidden shadow-md"
              style={{ background: "#D6E9C4" }}
            >
              <img
                src={portrait2}
                alt="Kate Yu Villaraza"
                className="w-full aspect-[3/4] object-cover object-center"
              />
            </div>
            <div
              ref={statsRef}
              className="absolute -bottom-6 -right-4 z-20 grid grid-cols-2 gap-1.5 p-4 rounded-2xl shadow-xl"
              style={{ background: "#3D5C2E" }}
            >
              {stats.map((s) => (
                <StatCell
                  key={s.label}
                  raw={s.raw}
                  label={s.label}
                  active={statsVisible}
                />
              ))}
            </div>
          </div>
        </Reveal>
        <div className="flex flex-col gap-6">
          <Reveal delay={60}>
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "#7FAE60" }}
            >
              About Me
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h2
              className="text-3xl md:text-4xl leading-tight"
              style={{ fontFamily: "Playfair Display,serif", color: "#2A3824" }}
            >
              Meet Your Virtual Assistant
            </h2>
          </Reveal>
          <Reveal delay={180}>
            <p
              className="text-[15px] leading-relaxed"
              style={{ color: "#52634A" }}
            >
              Hello! I'm Kate — a dedicated and detail-oriented Virtual
              Assistant passionate about helping businesses stay organized,
              communicate effectively, and deliver excellent customer
              experiences.
            </p>
          </Reveal>
          <Reveal delay={210}>
            <div
              className="inline-flex self-start items-center gap-3 px-4 py-3 rounded-2xl"
              style={{
                background: "#FDE3E7",
                border: "1px solid #FD9FAE",
                color: "#8F4051",
              }}
            >
              <span className="text-xl" aria-hidden="true">
                ✦
              </span>
              <p className="text-sm font-semibold">
                13 years of experience in Insurance
              </p>
            </div>
          </Reveal>
          <Reveal delay={240}>
            <p
              className="text-[15px] leading-relaxed"
              style={{ color: "#52634A" }}
            >
              I bring structure, warmth, and reliability to every engagement.
              Whether it's taming a chaotic inbox or supporting your customers —
              I've got you covered.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div className="flex flex-wrap gap-2 mt-1">
              {strengths.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{
                    background: "#E6F0D8",
                    color: "#2A3824",
                    border: "1px solid #C8DFAF",
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.2}
                    className="w-3.5 h-3.5 shrink-0"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                  {s}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={360}>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 self-start mt-2 px-6 py-3 rounded-full text-sm font-medium text-white hover:opacity-90 transition-all"
              style={{ background: "linear-gradient(135deg,#FD9FAE,#D96C82)" }}
            >
              Let's Connect{" "}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const RESUME_EXPERIENCE = [
  {
    company: "QBE Insurance · GSSC",
    role: "Insurance Specialist",
    dates: "2013 — Present",
    focus: "Motor, small business, and domestic insurance portfolios",
    points: [
      "Mercedes-Benz Motor: manage a premium motor portfolio and support dealerships and clients with end-to-end policy management.",
      "DIGI Small Business: manage policy setup, billing, renewals, client support, and insurance documentation for Australian businesses.",
      "Remediation: verify financial discrepancies, resolve escalations, issue refunds, and maintain audit-ready documentation.",
      "Domestic Portfolio: liaise with intermediaries, financial institutions, and brokers on policy changes, pricing, and agreements.",
      "Previously supported Home, Motor, Consumer Credit, Pleasure Craft, Caravan, Trailer, and Horse Float insurance lines.",
    ],
  },
  {
    company: "Aegis People Services",
    role: "CTP Insurance Specialist",
    dates: "2012 — 2013",
    focus:
      "Greenslip insurance for New South Wales, South Australia, and Queensland",
    points: [
      "Supported customers with policy enquiries, documentation, and policy servicing across multiple states.",
    ],
  },
  {
    company: "ePerformax Contact Centre",
    role: "Billing Analyst & Customer Service Representative",
    dates: "2010 — 2012",
    focus: "Origin Energy Australia, T-Mobile, and Verizon",
    points: [
      "Managed billing support and customer service enquiries while maintaining accurate, timely account resolutions.",
    ],
  },
];

const RESUME_SKILLS = [
  "Policy administration",
  "Underwriting support",
  "Risk analysis",
  "Broker relations",
  "Customer retention",
  "Compliance frameworks",
  "Team mentoring",
  "Process improvement",
];

function Resume() {
  const resumeUrl = `${import.meta.env.BASE_URL}resume-villaraza.pdf`;

  return (
    <section
      id="resume"
      className="py-24 md:py-28"
      style={{ background: "#FFF4F6" }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14">
          <div className="max-w-xl">
            <Reveal>
              <p
                className="text-xs font-semibold uppercase tracking-[0.2em] mb-4"
                style={{ color: "#8F4051" }}
              >
                Resume
              </p>
              <h2
                className="text-4xl md:text-5xl leading-tight"
                style={{
                  fontFamily: "Playfair Display,serif",
                  color: "#2A3824",
                }}
              >
                Experience that
                <br />
                keeps things moving.
              </h2>
            </Reveal>
          </div>
          <Reveal from="right">
            <a
              href={resumeUrl}
              download="resume-villaraza.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="resume-download inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium transition-all hover:-translate-y-px hover:shadow-sm"
              style={{ background: "#2A3824", color: "#F7FAF0" }}
            >
              Download full resume
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                className="w-4 h-4"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"
                />
              </svg>
            </a>
          </Reveal>
        </div>

        <Reveal>
          <div className="max-w-2xl mx-auto text-center mb-12">
            <p className="text-sm leading-7" style={{ color: "#6F5B62" }}>
              Insurance specialist with 13 years of experience supporting
              customers, brokers, and high-volume policy portfolios.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {RESUME_SKILLS.map((skill) => (
                <span
                  key={skill}
                  className="resume-skill px-3 py-1.5 rounded-full text-xs"
                  style={{
                    color: "#52634A",
                    background: "#FDE3E7",
                    border: "1px solid #F2C7D0",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="relative max-w-5xl mx-auto">
          <div
            className="resume-line absolute left-4 md:left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
            style={{ background: "#E7C8CF" }}
            aria-hidden="true"
          />
          <div className="flex flex-col gap-12 md:gap-16">
            {RESUME_EXPERIENCE.map((entry, index) => {
              const isLeft = index % 2 === 0;
              return (
                <Reveal
                  key={entry.company}
                  delay={index * 90}
                  from={isLeft ? "left" : "right"}
                  threshold={0.38}
                >
                  <div className="relative grid md:grid-cols-2 md:gap-16">
                    <span
                      className="resume-dot absolute left-4 md:left-1/2 top-5 w-4 h-4 rounded-full border-4 -translate-x-1/2 z-10"
                      style={{ background: "#D96C82", borderColor: "#FFF4F6" }}
                      aria-hidden="true"
                    />
                    <article
                      className={`resume-card ${isLeft ? "md:col-start-1 md:text-right" : "md:col-start-2"} ml-10 md:ml-0 p-6 rounded-2xl`}
                      style={{
                        background: "#FBFCF7",
                        border: "1px solid #E7C8CF",
                      }}
                    >
                      <div
                        className={`flex flex-col gap-1 mb-4 ${isLeft ? "md:items-end" : "items-start"}`}
                      >
                        <span
                          className="resume-date text-xs font-medium"
                          style={{ color: "#8F4051" }}
                        >
                          {entry.dates}
                        </span>
                        <h3
                          className="text-xl"
                          style={{
                            fontFamily: "Playfair Display,serif",
                            color: "#2A3824",
                          }}
                        >
                          {entry.company}
                        </h3>
                        <p
                          className="resume-role text-sm font-semibold"
                          style={{ color: "#52634A" }}
                        >
                          {entry.role}
                        </p>
                        <p
                          className="resume-focus text-xs"
                          style={{ color: "#8A737A" }}
                        >
                          {entry.focus}
                        </p>
                      </div>
                      <ul
                        className={`flex flex-col gap-2 ${isLeft ? "md:items-end" : "items-start"}`}
                      >
                        {entry.points.map((point) => (
                          <li
                            key={point}
                            className={`resume-point flex gap-3 text-sm leading-6 ${isLeft ? "md:flex-row-reverse" : ""}`}
                            style={{ color: "#6F5B62" }}
                          >
                            <span
                              className="mt-[9px] w-1.5 h-1.5 rounded-full shrink-0"
                              style={{ background: "#B8D4A0" }}
                              aria-hidden="true"
                            />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </article>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        <Reveal delay={180}>
          <div
            className="resume-education text-center mt-14 pt-8 border-t"
            style={{ borderColor: "#E7C8CF" }}
          >
            <p
              className="resume-date text-[10px] font-semibold uppercase tracking-[0.18em] mb-3"
              style={{ color: "#8F4051" }}
            >
              Education
            </p>
            <p
              className="resume-school text-sm font-medium"
              style={{ color: "#2A3824" }}
            >
              University of Santo Tomas
            </p>
            <p
              className="resume-focus text-xs mt-1"
              style={{ color: "#7A6A70" }}
            >
              BS Psychology · 2010
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Services ─────────────────────────────────────────────────────────────────

function Services() {
  const featured = SERVICES.filter((s) => s.featured),
    rest = SERVICES.filter((s) => !s.featured);
  return (
    <section id="services" className="py-24" style={{ background: "#F7FAF0" }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-xl mb-14">
          <Reveal>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: "#7FAE60" }}
            >
              Services
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h2
              className="text-3xl md:text-4xl leading-tight"
              style={{ fontFamily: "Playfair Display,serif", color: "#2A3824" }}
            >
              How I Can Help
              <br />
              Your Business
            </h2>
          </Reveal>
        </div>
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {featured.map((s, i) => (
            <Reveal
              key={s.id}
              delay={i * 120}
              from={i === 0 ? "left" : "right"}
            >
              <div
                className="rounded-3xl p-8 flex flex-col gap-5 hover:-translate-y-1 hover:shadow-md transition-all cursor-pointer h-full"
                style={{
                  background: i === 0 ? "#E6F0D8" : "#3D5C2E",
                  border: `1px solid ${i === 0 ? "#C8DFAF" : "transparent"}`,
                }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{
                    background: i === 0 ? "#3D5C2E" : "#E6F0D8",
                    color: i === 0 ? "#F7FAF0" : "#2A3824",
                  }}
                >
                  {SERVICE_ICONS[i]}
                </div>
                <div>
                  <h3
                    className="text-xl mb-2"
                    style={{
                      fontFamily: "Playfair Display,serif",
                      color: i === 0 ? "#2A3824" : "#F7FAF0",
                    }}
                  >
                    {s.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: i === 0 ? "#52634A" : "#B8D4A0" }}
                  >
                    {s.short}
                  </p>
                </div>
                <ul className="grid grid-cols-2 gap-y-2 gap-x-3">
                  {s.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-1.5 text-xs"
                      style={{ color: i === 0 ? "#3D5C2E" : "#D6E9C4" }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.2}
                        className="w-3.5 h-3.5 shrink-0"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {rest.map((s, i) => (
            <Reveal key={s.id} delay={i * 70}>
              <div
                className="rounded-2xl p-6 flex flex-col gap-4 hover:-translate-y-1 hover:shadow-sm transition-all cursor-pointer h-full"
                style={{ background: "#FFF4F6", border: "1px solid #D6E9C4" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "#E6F0D8", color: "#3D5C2E" }}
                >
                  {SERVICE_ICONS[i + 2]}
                </div>
                <div>
                  <h3
                    className="text-sm font-semibold mb-1.5"
                    style={{
                      fontFamily: "Playfair Display,serif",
                      color: "#2A3824",
                    }}
                  >
                    {s.title}
                  </h3>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: "#7A8F72" }}
                  >
                    {s.short}
                  </p>
                </div>
                <span
                  className="inline-flex items-center gap-1 text-xs font-medium mt-auto"
                  style={{ color: "#5C8A3A" }}
                >
                  Details{" "}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Projects ─────────────────────────────────────────────────────────────────

function Projects() {
  const [filter, setFilter] = useState("All");
  const filtered =
    filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);
  return (
    <section id="projects" className="py-24" style={{ background: "#FFF4F6" }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <Reveal>
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: "#7FAE60" }}
              >
                Portfolio
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2
                className="text-3xl md:text-4xl"
                style={{
                  fontFamily: "Playfair Display,serif",
                  color: "#2A3824",
                }}
              >
                My Experience
                <br />
                &amp; Projects
              </h2>
            </Reveal>
          </div>
          <Reveal from="right">
            <div className="flex flex-wrap gap-2">
              {PROJECT_FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="px-4 py-1.5 rounded-full text-xs font-medium transition-all"
                  style={{
                    background: filter === f ? "#3D5C2E" : "#E6F0D8",
                    color: filter === f ? "#F7FAF0" : "#2A3824",
                    border: "1px solid",
                    borderColor: filter === f ? "#3D5C2E" : "#C8DFAF",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </Reveal>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((p, i) => (
            <Reveal key={p.id} delay={i * 80}>
              <div
                className="rounded-2xl overflow-hidden flex flex-col group hover:-translate-y-1 transition-all hover:shadow-md h-full"
                style={{ border: "1px solid #D6E9C4" }}
              >
                <div
                  className="aspect-[4/3] overflow-hidden"
                  style={{ background: "#D6E9C4" }}
                >
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 flex flex-col gap-3 flex-1">
                  <span
                    className="text-xs font-medium px-2.5 py-1 rounded-full self-start"
                    style={{ background: "#E6F0D8", color: "#2A3824" }}
                  >
                    {p.category}
                  </span>
                  <h3
                    className="text-sm font-semibold"
                    style={{
                      fontFamily: "Playfair Display,serif",
                      color: "#2A3824",
                    }}
                  >
                    {p.title}
                  </h3>
                  <p
                    className="text-xs leading-relaxed flex-1"
                    style={{ color: "#7A8F72" }}
                  >
                    {p.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {p.tools.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{
                          background: "#FFF4F6",
                          color: "#52634A",
                          border: "1px solid #D6E9C4",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

function Testimonials() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = setInterval(
      () => setIdx((i) => (i + 1) % TESTIMONIALS.length),
      4500,
    );
    return () => clearInterval(t);
  }, [paused]);
  const t = TESTIMONIALS[idx];
  return (
    <section
      id="testimonials"
      className="py-24 relative overflow-hidden"
      style={{ background: "#3D5C2E" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Arc
        className="absolute top-12 right-16 w-40 text-[#7FAE60] rotate-90"
        opacity={0.15}
      />
      <Arc
        className="absolute bottom-12 left-16 w-32 text-[#B8D4A0] -rotate-90"
        opacity={0.12}
      />
      <Dots className="absolute top-1/2 right-8 w-20 text-[#B8D4A0] -translate-y-1/2" />
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <Reveal>
          <div className="text-center mb-14">
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: "#B8D4A0" }}
            >
              Testimonials
            </p>
            <h2
              className="text-3xl md:text-4xl text-white"
              style={{ fontFamily: "Playfair Display,serif" }}
            >
              What My Clients Say
            </h2>
          </div>
        </Reveal>
        <div
          className="rounded-3xl p-8 md:p-12 flex flex-col gap-8"
          style={{
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(184,212,160,0.18)",
          }}
        >
          <div
            key={idx}
            style={{
              animation: "testimonialIn .55s cubic-bezier(.25,.8,.25,1) both",
            }}
          >
            <div className="flex gap-1 mb-6">
              {Array.from({ length: t.rating }).map((_, i) => (
                <svg
                  key={i}
                  viewBox="0 0 20 20"
                  className="w-5 h-5"
                  fill="#C8DFAF"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <blockquote
              className="text-xl md:text-2xl leading-relaxed text-white italic mb-8"
              style={{ fontFamily: "Playfair Display,serif" }}
            >
              "{t.text}"
            </blockquote>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold"
                  style={{ background: t.bg, color: "#2A3824" }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{t.name}</p>
                  <p className="text-xs" style={{ color: "#B8D4A0" }}>
                    {t.role}
                  </p>
                </div>
              </div>
              <span
                className="text-xs px-3 py-1.5 rounded-full"
                style={{ background: "rgba(127,174,96,0.2)", color: "#B8D4A0" }}
              >
                {t.service}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() =>
              setIdx((idx - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
            }
            className="testimonial-control w-10 h-10 rounded-full flex items-center justify-center transition-all hover:opacity-80 text-[#F7FAF0]"
            style={{ background: "rgba(255,255,255,0.1)" }}
          >
            ←
          </button>
          <div className="flex gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`testimonial-dot rounded-full transition-all duration-300 ${i === idx ? "testimonial-dot-active" : ""}`}
                style={{
                  width: i === idx ? 28 : 8,
                  height: 8,
                  background: i === idx ? "#C8DFAF" : "rgba(255,255,255,0.2)",
                }}
              />
            ))}
          </div>
          <button
            onClick={() => setIdx((idx + 1) % TESTIMONIALS.length)}
            className="testimonial-control w-10 h-10 rounded-full flex items-center justify-center transition-all hover:opacity-80 text-[#F7FAF0]"
            style={{ background: "rgba(255,255,255,0.1)" }}
          >
            →
          </button>
        </div>
        <div className="flex justify-center mt-4">
          <div
            className="testimonial-progress w-32 h-0.5 rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.12)" }}
          >
            <div
              key={`${idx}-${paused}`}
              className="h-full rounded-full"
              style={{
                background: "#B8D4A0",
                animation: paused ? "none" : "progressBar 4.5s linear forwards",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Tools ────────────────────────────────────────────────────────────────────

const TOOL_LOGOS: Record<string, string> = {
  "Google Workspace": "google-icon",
  "Google Calendar": "google-calendar-2020",
  Gmail: "google-gmail",
  Outlook: "microsoft-icon",
  "Microsoft Office": "microsoft-icon",
  "Microsoft Teams": "microsoft-teams",
  Teams: "microsoft-teams",
  Notion: "notion-icon",
  Trello: "trello",
  Slack: "slack-icon",
  Zoom: "zoom-icon",
  Zendesk: "zendesk",
  Freshdesk: "fresh",
  Intercom: "intercom",
  HubSpot: "hubspot",
  LiveChat: "livechat",
};

const SKILL_ICONS: Record<string, React.ReactNode> = {
  "Customer Service": (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className="w-4 h-4 text-[#3D5C2E]"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
      />
    </svg>
  ),
  "Email Management": (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className="w-4 h-4 text-[#3D5C2E]"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
      />
    </svg>
  ),
  "Admin Support": (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className="w-4 h-4 text-[#3D5C2E]"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"
      />
    </svg>
  ),
  "Data Entry": (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className="w-4 h-4 text-[#3D5C2E]"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m-16.5-9.75h16.5m-16.5 0a1.125 1.125 0 01-1.125-1.125v-1.5c0-.621.504-1.125 1.125-1.125m16.5 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-16.5 0h16.5"
      />
    </svg>
  ),
  "Time Management": (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className="w-4 h-4 text-[#3D5C2E]"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  Organization: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className="w-4 h-4 text-[#3D5C2E]"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
      />
    </svg>
  ),
};

function ToolLogo({ name }: { name: string }) {
  const logoKey = TOOL_LOGOS[name];
  const icon = logoKey ? brandIcons.icons[logoKey] : undefined;

  if (icon) {
    return (
      <svg
        viewBox={`0 0 ${icon.width ?? 256} ${icon.height ?? 256}`}
        aria-hidden="true"
        className="w-5 h-5 object-contain"
        preserveAspectRatio="xMidYMid meet"
        dangerouslySetInnerHTML={{ __html: icon.body }}
      />
    );
  }

  if (SKILL_ICONS[name]) {
    return <span aria-hidden="true">{SKILL_ICONS[name]}</span>;
  }

  if (name === "LiveChat") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#3D5C2E"
        strokeWidth="1.8"
        className="w-4 h-4"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.5 18.75L3.75 21l1.125-4.5A8.25 8.25 0 1112 20.25a8.2 8.2 0 004.5-1.336"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 12h.008v.008H8.25V12zm3.75 0h.008v.008H12V12zm3.75 0h.008v.008H15.75V12z"
        />
      </svg>
    );
  }

  return (
    <span
      className="w-4 h-4 rounded-full flex items-center justify-center"
      style={{ background: "#B8D4A0" }}
      aria-hidden="true"
    />
  );
}

function Tools() {
  return (
    <section
      id="tools"
      className="py-24 md:py-28"
      style={{ background: "#F7FAF0" }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="tools-header grid lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-20 items-end mb-12">
          <Reveal>
            <p
              className="text-xs font-semibold uppercase tracking-[0.2em] mb-4"
              style={{ color: "#5C8A3A" }}
            >
              Skills & Tools
            </p>
            <h2
              className="tools-title text-4xl md:text-5xl leading-[1.04]"
              style={{ fontFamily: "Playfair Display,serif", color: "#2A3824" }}
            >
              The systems
              <br />
              behind the work.
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <div
              className="tools-description max-w-lg border-b pb-5"
              style={{ borderColor: "#CFE2BB" }}
            >
              <p className="text-sm leading-7" style={{ color: "#6F8068" }}>
                Organized, responsive, and ready to support the details that
                keep a business moving.
              </p>
            </div>
          </Reveal>
        </div>
        <div
          className="tools-grid grid sm:grid-cols-2 lg:grid-cols-4 gap-px"
          style={{ background: "#CFE2BB", border: "1px solid #CFE2BB" }}
        >
          {Object.entries(TOOLS).map(([cat, items], ci) => (
            <Reveal key={cat} delay={ci * 80}>
              <div
                className="tools-card p-5 md:p-6 flex flex-col gap-6 h-full transition-colors duration-200 hover:bg-[#FFF4F6]"
                style={{ background: "#FBFCF7" }}
              >
                <div className="flex items-center justify-between gap-3">
                  <h3
                    className="text-lg"
                    style={{
                      fontFamily: "Playfair Display,serif",
                      color: "#2A3824",
                    }}
                  >
                    {cat}
                  </h3>
                  <span
                    className="text-[10px] font-semibold tracking-[0.14em]"
                    style={{ color: "#98AA8D" }}
                  >
                    0{ci + 1}
                  </span>
                </div>
                <div className="flex flex-col">
                  {items.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 py-3 border-t transition-transform duration-200 hover:translate-x-1"
                      style={{ borderColor: "#E3ECD9", color: "#40513A" }}
                    >
                      <span
                        className="w-7 h-7 rounded-md shrink-0 flex items-center justify-center"
                        style={{ background: "#F0F5E9" }}
                        aria-hidden="true"
                      >
                        <ToolLogo name={item} />
                      </span>
                      <span className="text-[13px]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────

function Contact() {
  const receiverEmail = "Katieyu2020@gmail.com";
  const [form, setForm] = useState({
    name: "",
    email: "",
    service: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const input: React.CSSProperties = {
    background: "#FFF4F6",
    border: "1px solid #D6E9C4",
    borderRadius: 12,
    color: "#2A3824",
    fontFamily: "DM Sans,sans-serif",
    fontSize: 14,
    padding: "12px 16px",
    outline: "none",
    width: "100%",
  };
  const contactItems = [
    { icon: "✉", label: "Email", value: "Katieyu2020@gmail.com" },
    { icon: "📞", label: "Phone", value: "09989714156" },
    { icon: "📍", label: "Location", value: "Pasig, Philippines" },
    {
      icon: "💼",
      label: "LinkedIn",
      value: "https://www.linkedin.com/in/kaycee-villaraza-093bbb418",
      href: "https://www.linkedin.com/in/kaycee-villaraza-093bbb418",
    },
  ];
  return (
    <section
      id="contact"
      className="py-24 relative overflow-hidden"
      style={{ background: "#B8D4A0" }}
    >
      <Dots className="absolute top-16 right-16 w-20 text-[#3D5C2E]" />
      <Arc
        className="absolute top-8 left-8 w-32 text-[#3D5C2E]"
        opacity={0.14}
      />
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-start relative z-10">
        <Reveal from="left">
          <div className="flex flex-col gap-8">
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: "#3D5C2E" }}
              >
                Get in Touch
              </p>
              <h2
                className="text-3xl md:text-4xl leading-tight"
                style={{
                  fontFamily: "Playfair Display,serif",
                  color: "#2A3824",
                }}
              >
                Let's Work
                <br />
                Together!
              </h2>
            </div>
            <p
              className="text-[15px] leading-relaxed"
              style={{ color: "#2A3824", opacity: 0.75 }}
            >
              Ready to make your business more organized and productive? Let's
              connect and discuss how I can help you reclaim your time.
            </p>
            <div className="contact-details flex flex-col gap-4">
              {contactItems.map((c) => (
                <div
                  key={c.label}
                  className="contact-item flex items-center gap-4"
                >
                  <div
                    className="contact-icon w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                    style={{ background: "#E6F0D8" }}
                  >
                    {c.icon}
                  </div>
                  <div>
                    <p
                      className="text-xs font-medium opacity-60"
                      style={{ color: "#2A3824" }}
                    >
                      {c.label}
                    </p>
                    {c.href ? (
                      <a
                        href={c.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium underline underline-offset-2"
                        style={{ color: "#2A3824" }}
                      >
                        {c.value}
                      </a>
                    ) : (
                      <p
                        className="text-sm font-medium"
                        style={{ color: "#2A3824" }}
                      >
                        {c.value}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal from="right" delay={100}>
          <div
            className="contact-form-card rounded-3xl p-8"
            style={{ background: "#F7FAF0" }}
          >
            {sent ? (
              <div className="flex flex-col items-center text-center gap-4 py-8">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
                  style={{ background: "#E6F0D8" }}
                >
                  ✓
                </div>
                <h3
                  className="text-xl"
                  style={{
                    fontFamily: "Playfair Display,serif",
                    color: "#2A3824",
                  }}
                >
                  Email Draft Ready!
                </h3>
                <p className="text-sm" style={{ color: "#7A8F72" }}>
                  Your email app should now have a prepared message addressed to
                  me. Please send it to complete your inquiry.
                </p>
                <button
                  onClick={() => {
                    setSent(false);
                    setForm({ name: "", email: "", service: "", message: "" });
                  }}
                  className="text-sm font-medium underline"
                  style={{ color: "#3D5C2E" }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const subject = `Portfolio inquiry from ${form.name}`;
                  const body = [
                    `Name: ${form.name}`,
                    `Email: ${form.email}`,
                    `Service: ${form.service}`,
                    "",
                    form.message,
                  ].join("\n");
                  window.location.href = `mailto:${receiverEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                  setSent(true);
                }}
                className="flex flex-col gap-4"
              >
                <h3
                  className="text-lg mb-2"
                  style={{
                    fontFamily: "Playfair Display,serif",
                    color: "#2A3824",
                  }}
                >
                  Send a Message
                </h3>
                <input
                  style={input}
                  placeholder="Full Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
                <input
                  style={input}
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
                <select
                  style={{
                    ...input,
                    color: form.service ? "#2A3824" : "#9ca3af",
                  }}
                  value={form.service}
                  onChange={(e) =>
                    setForm({ ...form, service: e.target.value })
                  }
                  required
                >
                  <option value="" disabled>
                    Service Interested In
                  </option>
                  {SERVICES.map((s) => (
                    <option key={s.id} value={s.title}>
                      {s.title}
                    </option>
                  ))}
                </select>
                <textarea
                  style={{ ...input, resize: "none", minHeight: 110 }}
                  placeholder="Your Message"
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  required
                />
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full text-sm font-medium text-white hover:opacity-90 transition-all mt-1"
                  style={{
                    background: "linear-gradient(135deg,#FD9FAE,#D96C82)",
                  }}
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="py-12" style={{ background: "#2A3824" }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold"
                style={{
                  background: "#E6F0D8",
                  color: "#2A3824",
                  fontFamily: "Playfair Display,serif",
                }}
              >
                KY
              </div>
              <span className="font-semibold text-sm text-white">
                Kate Yu Villaraza
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "#7FAE60" }}>
              Dedicated Virtual Assistant helping businesses stay organized,
              connected, and focused. Available for new clients worldwide.
            </p>
            <div className="flex gap-3">
              {["LinkedIn", "Instagram", "Twitter"].map((s) => (
                <a
                  key={s}
                  href={
                    s === "LinkedIn"
                      ? "https://www.linkedin.com/in/kaycee-villaraza-093bbb418"
                      : "#"
                  }
                  target={s === "LinkedIn" ? "_blank" : undefined}
                  rel={s === "LinkedIn" ? "noopener noreferrer" : undefined}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium hover:opacity-80"
                  style={{
                    background: "rgba(127,174,96,0.15)",
                    color: "#B8D4A0",
                  }}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h4
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "#7FAE60" }}
            >
              Quick Links
            </h4>
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm hover:text-white transition-colors"
                style={{ color: "rgba(247,250,240,0.55)" }}
              >
                {l.label}
              </a>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <h4
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "#7FAE60" }}
            >
              Services
            </h4>
            {SERVICES.slice(0, 5).map((s) => (
              <a
                key={s.id}
                href="#services"
                className="text-sm hover:text-white transition-colors"
                style={{ color: "rgba(247,250,240,0.55)" }}
              >
                {s.title}
              </a>
            ))}
          </div>
        </div>
        <div
          className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
        >
          <p className="text-xs" style={{ color: "rgba(247,250,240,0.35)" }}>
            © 2026 Kate Yu Villaraza. All Rights Reserved.
          </p>
          <p className="text-xs" style={{ color: "rgba(247,250,240,0.35)" }}>
            Virtual Assistant · Customer Service · Email Management
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Portfolio ────────────────────────────────────────────────────────────────

export default function Portfolio() {
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem("portfolio-theme") === "dark";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("portfolio-theme", darkMode ? "dark" : "light");
    } catch {
      return;
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen ${darkMode ? "theme-dark" : ""}`}>
      <Nav
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode((value) => !value)}
      />
      <Hero />
      <About />
      <Resume />
      <Services />
      <Projects />
      <Testimonials />
      <Tools />
      <Contact />
      <Footer />
      <Chatbot darkMode={darkMode} />
    </div>
  );
}
