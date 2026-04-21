import { Shell } from "@/components/layout/Shell";
import { useKnowledgeBase, useCreateArticle } from "@/hooks/use-knowledge-base";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Library, Loader2, BookOpen, Calendar, User, Send, Lock, ArrowLeft, Clock, Share2, Bookmark, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { ROLE_IDS } from "@/lib/roles";
import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

const STAGGER = ["stagger-1","stagger-2","stagger-3","stagger-4","stagger-5","stagger-6"];

const ICON_ACCENTS = [
  { bg: "rgba(46,163,224,0.08)",   color: "#2EA3E0" },
  { bg: "rgba(90,63,168,0.08)",  color: "#5a3fa8" },
  { bg: "rgba(0,144,122,0.08)",  color: "#00907a" },
  { bg: "rgba(200,120,0,0.08)",  color: "#c87800" },
];

const CATEGORIES = ["General", "Funding", "Growth", "Legal", "Operations"] as const;

// ─── Fetch all users for name lookup ───
function useUsers() {
  return useQuery({
    queryKey: [api.users.list.path],
    queryFn: async () => {
      const res = await fetch(api.users.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json() as Promise<Array<{ id: number; name: string; email: string; roleId: number | null }>>;
    },
  });
}

// ─── Build user name lookup ───
function buildUserMap(users: Array<{ id: number; name: string }> | undefined): Map<number, string> {
  const map = new Map<number, string>();
  if (users) {
    for (const u of users) {
      map.set(u.id, u.name);
    }
  }
  return map;
}

// ─── Estimate read time ───
function estimateReadTime(text: string): string {
  const words = text.trim().split(/\s+/).length;
  const mins = Math.max(1, Math.ceil(words / 200));
  return `${mins} min read`;
}

// ─── Format content paragraphs with proper typography ───
function formatContent(content: string) {
  const paragraphs = content.split(/\n\n+/).filter(p => p.trim());
  if (paragraphs.length <= 1) {
    const lines = content.split(/\n/).filter(l => l.trim());
    if (lines.length <= 1) {
      return [content];
    }
    return lines;
  }
  return paragraphs;
}

// ─── Get user initials from name ───
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

// ─── Full Article Reader View ───
function ArticleReader({
  article,
  authorName,
  onBack,
}: {
  article: { id: number; title: string; content: string; createdBy: number; createdAt: string | null };
  authorName: string;
  onBack: () => void;
}) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      const el = contentRef.current;
      const scrollTop = el.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      setScrollProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
    };

    const el = contentRef.current;
    if (el) {
      el.addEventListener("scroll", handleScroll, { passive: true });
      return () => el.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const handleBack = () => {
    setIsVisible(false);
    setTimeout(onBack, 300);
  };

  const paragraphs = formatContent(article.content);
  const readTime = estimateReadTime(article.content);
  const initials = getInitials(authorName);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{
        background: "#fafbfd",
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {/* ── Reading Progress Bar ── */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[3px]" style={{ background: "rgba(46,163,224,0.08)" }}>
        <div
          className="h-full transition-all duration-150"
          style={{
            width: `${scrollProgress}%`,
            background: "linear-gradient(90deg, #2EA3E0, #2EA3E0, #039be5)",
            boxShadow: "0 0 12px rgba(46,163,224,0.4)",
          }}
        />
      </div>

      {/* ── Top Navigation Bar ── */}
      <div
        className="shrink-0 border-b"
        style={{
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(20px) saturate(180%)",
          borderColor: "rgba(46,163,224,0.08)",
        }}
      >
        <div className="max-w-[900px] mx-auto px-6 md:px-8 flex items-center justify-between h-14">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm font-medium transition-all duration-200 group"
            style={{ color: "#2EA3E0" }}
          >
            <ArrowLeft
              className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1"
            />
            <span className="hidden sm:inline">Back to Knowledge Base</span>
            <span className="sm:hidden">Back</span>
          </button>

          <div className="flex items-center gap-1">
            <button
              className="h-8 w-8 rounded-lg flex items-center justify-center transition-colors duration-200"
              style={{ color: "#64748b" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(46,163,224,0.06)"; e.currentTarget.style.color = "#2EA3E0"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; }}
              title="Bookmark"
            >
              <Bookmark className="h-4 w-4" />
            </button>
            <button
              className="h-8 w-8 rounded-lg flex items-center justify-center transition-colors duration-200"
              style={{ color: "#64748b" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(46,163,224,0.06)"; e.currentTarget.style.color = "#2EA3E0"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; }}
              title="Share"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Scrollable Content ── */}
      <div
        ref={contentRef}
        className="flex-1 overflow-y-auto"
        style={{ scrollBehavior: "smooth" }}
      >
        <article className="max-w-[720px] mx-auto px-6 md:px-8 py-10 md:py-14">

          {/* ── Breadcrumb ── */}
          <div
            className="flex items-center gap-2 text-xs font-medium mb-8"
            style={{
              color: "#94a3b8",
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(8px)",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.1s",
            }}
          >
            <span style={{ color: "#2EA3E0" }}>Knowledge Base</span>
            <ChevronRight className="h-3 w-3" />
            <span className="truncate max-w-[200px]">{article.title}</span>
          </div>

          {/* ── Title ── */}
          <h1
            className="font-display font-extrabold leading-[1.15] mb-6"
            style={{
              color: "#0f172a",
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              letterSpacing: "-0.025em",
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(12px)",
              transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.15s",
            }}
          >
            {article.title}
          </h1>

          {/* ── Meta row ── */}
          <div
            className="flex flex-wrap items-center gap-4 mb-8 pb-8"
            style={{
              borderBottom: "1px solid rgba(46,163,224,0.08)",
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(8px)",
              transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.2s",
            }}
          >
            {/* Author avatar */}
            <div className="flex items-center gap-2.5">
              <div
                className="h-9 w-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ background: "linear-gradient(135deg, #2EA3E0, #2EA3E0)" }}
              >
                {initials}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground leading-tight">{authorName}</p>
                <p className="text-xs text-muted-foreground">Contributor</p>
              </div>
            </div>

            <div className="h-5 w-px bg-border/60" />

            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              {article.createdAt
                ? new Date(article.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "—"}
            </span>

            <div className="h-5 w-px bg-border/60" />

            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              {readTime}
            </span>
          </div>

          {/* ── Article Body ── */}
          <div
            className="prose-article"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(16px)",
              transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.3s",
            }}
          >
            {paragraphs.map((para, idx) => (
              <p
                key={idx}
                style={{
                  fontSize: "1.0625rem",
                  lineHeight: "1.85",
                  color: "#334155",
                  marginBottom: "1.5rem",
                  fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
                  letterSpacing: "0.01em",
                }}
              >
                {para}
              </p>
            ))}
          </div>

          {/* ── Bottom Divider + Back Link ── */}
          <div
            className="mt-12 pt-8"
            style={{
              borderTop: "1px solid rgba(46,163,224,0.08)",
              opacity: isVisible ? 1 : 0,
              transition: "opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.4s",
            }}
          >
            <div className="flex items-center justify-between">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-sm font-medium transition-all duration-200 group"
                style={{ color: "#2EA3E0" }}
              >
                <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
                Back to all articles
              </button>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>Article #{article.id}</span>
                <span>•</span>
                <span>{article.content.trim().split(/\s+/).length} words</span>
              </div>
            </div>
          </div>

          {/* Bottom breathing room */}
          <div className="h-16" />
        </article>
      </div>
    </div>
  );
}


// ─── Main Knowledge Base Page ───
export default function KnowledgeBase() {
  const { data: articles, isLoading: kLoading } = useKnowledgeBase();
  const { mutateAsync: createArticle, isPending } = useCreateArticle();
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: allUsers } = useUsers();
  const userMap = buildUserMap(allUsers);

  const isAdmin = user?.roleId === ROLE_IDS.ADMIN;
  const isMentor = user?.roleId === ROLE_IDS.MENTOR;
  const canPublish = isAdmin || isMentor;

  const [form, setForm] = useState({ title: "", content: "", category: "" });
  const [selectedArticle, setSelectedArticle] = useState<null | {
    id: number;
    title: string;
    content: string;
    createdBy: number;
    createdAt: string | null;
  }>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    if (!form.category) {
      toast({ title: "Please select a category", variant: "destructive" });
      return;
    }
    try {
      await createArticle({
        title: form.title,
        content: form.content,
        createdBy: user.id,
      });
      setForm({ title: "", content: "", category: "" });
      toast({ title: "Article published" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  // Helper to resolve author name
  const getAuthorName = (userId: number) => userMap.get(userId) || "Unknown Author";

  // If an article is selected, show the reader
  if (selectedArticle) {
    return (
      <ArticleReader
        article={selectedArticle}
        authorName={getAuthorName(selectedArticle.createdBy)}
        onBack={() => setSelectedArticle(null)}
      />
    );
  }

  return (
    <Shell>
      {/* ── Two-column hero layout ── */}
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 min-h-[calc(100vh-7rem)]">

        {/* ── LEFT COLUMN ── */}
        <div className="flex-1 min-w-0">

          {/* Hero heading */}
          <div className="mb-10 stagger-1">
            <h1
              className="text-4xl md:text-5xl font-display font-bold leading-tight mb-4"
              style={{ color: "#2EA3E0" }}
            >
              We Have Resources,<br />
              <span style={{ color: "#2EA3E0" }}>You Have Questions.</span>
            </h1>
            <p className="text-muted-foreground text-base max-w-lg leading-relaxed">
              Explore our curated library of startup guides, frameworks, and resources—crafted to help every team at every stage of growth.
            </p>
            {/* Decorative rule */}
            <div
              className="mt-6 h-1 w-20 rounded-full"
              style={{ background: "linear-gradient(90deg, #2EA3E0, #2EA3E0)" }}
            />
          </div>

          {/* Article grid */}
          {kLoading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="animate-spin text-primary h-7 w-7" />
            </div>
          ) : articles && articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {articles.map((article, idx) => {
                const acc = ICON_ACCENTS[idx % ICON_ACCENTS.length];
                const readTime = estimateReadTime(article.content);
                const authorName = getAuthorName(article.createdBy);
                return (
                  <div
                    key={article.id}
                    className={`glass-card p-5 group cursor-pointer ${STAGGER[idx % STAGGER.length]}`}
                    style={{ transition: "transform 0.2s, box-shadow 0.2s" }}
                    onClick={() =>
                      setSelectedArticle({
                        id: article.id,
                        title: article.title,
                        content: article.content,
                        createdBy: article.createdBy,
                        createdAt: article.createdAt as string | null,
                      })
                    }
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 32px rgba(46,163,224,0.12)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "";
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0 border transition-transform duration-200 group-hover:scale-105"
                        style={{ background: acc.bg, borderColor: `${acc.color}20` }}
                      >
                        <BookOpen className="h-5 w-5" style={{ color: acc.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-display font-bold mb-1.5 text-foreground group-hover:text-primary transition-colors leading-snug">
                          {article.title}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed mb-4">
                          {article.content}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/40 pt-3">
                          <span className="flex items-center gap-1.5">
                            <User className="h-3 w-3" />{authorName}
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1.5">
                              <Clock className="h-3 w-3" />
                              {readTime}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Calendar className="h-3 w-3" />
                              {new Date(article.createdAt!).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Read more indicator */}
                    <div className="flex items-center justify-end mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <span className="text-xs font-semibold flex items-center gap-1" style={{ color: acc.color }}>
                        Read full article
                        <ChevronRight className="h-3 w-3" />
                      </span>
                    </div>
                    <div
                      className="h-[2px] mt-2 rounded-full opacity-0 group-hover:opacity-40 transition-opacity"
                      style={{ background: `linear-gradient(90deg, transparent, ${acc.color}, transparent)` }}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-14 text-center stagger-1">
              <div className="inline-flex flex-col items-center gap-3 p-8 rounded-2xl border-2 border-dashed border-border">
                <Library className="h-10 w-10 text-muted-foreground/30 animate-float" />
                <div>
                  <h3 className="text-base font-medium text-foreground/60">No articles yet</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">Publish the first resource using the form →</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT COLUMN — admin/mentor: publish form | others: info card ── */}
        <div className="lg:w-[360px] xl:w-[400px] shrink-0">
          <div className="lg:sticky lg:top-[5.5rem]">

            {canPublish ? (
              /* ── ADMIN / MENTOR: full publish form ── */
              <>
                <div
                  className="rounded-2xl border border-border/60 overflow-hidden"
                  style={{
                    background: "rgba(255,255,255,0.97)",
                    backdropFilter: "blur(16px)",
                    boxShadow: "0 20px 50px rgba(46,163,224,0.12)",
                  }}
                >
                  <div className="h-1.5" style={{ background: "linear-gradient(90deg, #2EA3E0, #2EA3E0)" }} />
                  <div className="p-6">
                    <h2 className="text-xl font-display font-bold mb-1" style={{ color: "#2EA3E0" }}>
                      Publish a Resource
                    </h2>
                    <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                      Share knowledge with the community. Fill in the details and submit.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold tracking-wide uppercase text-foreground/60">
                          Article Title
                        </Label>
                        <Input
                          name="title"
                          required
                          value={form.title}
                          onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                          className="h-10 rounded-lg border-border/70 bg-white/90 focus:border-primary focus:ring-2 focus:ring-primary/10"
                          placeholder="e.g. How to prepare for Series A"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold tracking-wide uppercase text-foreground/60">
                          Content
                        </Label>
                        <Textarea
                          name="content"
                          required
                          value={form.content}
                          onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                          className="rounded-lg border-border/70 bg-white/90 min-h-[160px] focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none"
                          placeholder="Write article content here..."
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold tracking-wide uppercase text-foreground/60">
                          Category
                        </Label>
                        <div className="flex flex-wrap gap-2">
                          {CATEGORIES.map(cat => {
                            const isSelected = form.category === cat;
                            return (
                              <button
                                key={cat}
                                type="button"
                                onClick={() => setForm(f => ({ ...f, category: f.category === cat ? "" : cat }))}
                                className="px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150"
                                style={{
                                  borderColor: isSelected ? "#2EA3E0" : "rgba(46,163,224,0.25)",
                                  color: isSelected ? "#ffffff" : "#2EA3E0",
                                  background: isSelected
                                    ? "linear-gradient(135deg, #2EA3E0, #2EA3E0)"
                                    : "rgba(46,163,224,0.06)",
                                  boxShadow: isSelected ? "0 2px 8px rgba(46,163,224,0.25)" : "none",
                                  transform: isSelected ? "scale(1.05)" : "scale(1)",
                                }}
                                onMouseEnter={e => {
                                  if (!isSelected) {
                                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(46,163,224,0.15)";
                                  }
                                }}
                                onMouseLeave={e => {
                                  if (!isSelected) {
                                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(46,163,224,0.06)";
                                  }
                                }}
                              >
                                {cat}
                              </button>
                            );
                          })}
                        </div>
                        {!form.category && (
                          <p className="text-[10px] text-muted-foreground mt-1">Select a category before publishing</p>
                        )}
                      </div>

                      <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full h-10 rounded-lg font-semibold text-white relative overflow-hidden group mt-2"
                        style={{ background: "linear-gradient(135deg, #2EA3E0, #2EA3E0)", boxShadow: "0 2px 10px rgba(46,163,224,0.25)" }}
                      >
                        <span className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-500" />
                        {isPending ? (
                          <Loader2 className="animate-spin relative z-10" />
                        ) : (
                          <span className="flex items-center justify-center gap-2 relative z-10">
                            <Send className="h-4 w-4" />
                            Publish Article
                          </span>
                        )}
                      </Button>
                    </form>
                  </div>
                </div>

                {/* Stats strip */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="rounded-xl p-4 border border-border/50" style={{ background: "rgba(46,163,224,0.04)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "#2EA3E0" }}>Total Articles</p>
                    <p className="text-2xl font-bold" style={{ color: "#2EA3E0" }}>{kLoading ? "—" : articles?.length ?? 0}</p>
                  </div>
                  <div className="rounded-xl p-4 border border-border/50" style={{ background: "rgba(46,163,224,0.04)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "#2EA3E0" }}>Contributors</p>
                    <p className="text-2xl font-bold" style={{ color: "#2EA3E0" }}>
                      {kLoading ? "—" : (new Set(articles?.map(a => a.createdBy))).size}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              /* ── NON-ADMIN/MENTOR: read-only info card ── */
              <div
                className="rounded-2xl border border-border/60 overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.97)",
                  backdropFilter: "blur(16px)",
                  boxShadow: "0 20px 50px rgba(46,163,224,0.08)",
                }}
              >
                <div className="h-1.5" style={{ background: "linear-gradient(90deg, #2EA3E0, #2EA3E0)" }} />
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: "rgba(46,163,224,0.08)" }}
                    >
                      <Lock className="h-5 w-5" style={{ color: "#2EA3E0" }} />
                    </div>
                    <div>
                      <h2 className="text-base font-display font-bold" style={{ color: "#2EA3E0" }}>Knowledge Base</h2>
                      <p className="text-xs text-muted-foreground">Read-only access</p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                    Browse the articles and guides below. Only administrators and mentors can publish new resources.
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl p-4 border border-border/50" style={{ background: "rgba(46,163,224,0.04)" }}>
                      <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "#2EA3E0" }}>Total Articles</p>
                      <p className="text-2xl font-bold" style={{ color: "#2EA3E0" }}>{kLoading ? "—" : articles?.length ?? 0}</p>
                    </div>
                    <div className="rounded-xl p-4 border border-border/50" style={{ background: "rgba(46,163,224,0.04)" }}>
                      <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "#2EA3E0" }}>Contributors</p>
                      <p className="text-2xl font-bold" style={{ color: "#2EA3E0" }}>
                        {kLoading ? "—" : (new Set(articles?.map(a => a.createdBy))).size}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </Shell>
  );
}
