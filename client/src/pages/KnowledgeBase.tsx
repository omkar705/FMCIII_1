import { Shell } from "@/components/layout/Shell";
import { useKnowledgeBase, useCreateArticle } from "@/hooks/use-knowledge-base";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Library, Loader2, BookOpen, Calendar, User, Send, Lock } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { ROLE_IDS } from "@/lib/roles";

const STAGGER = ["stagger-1","stagger-2","stagger-3","stagger-4","stagger-5","stagger-6"];

const ICON_ACCENTS = [
  { bg: "rgba(1,81,133,0.08)",   color: "#015185" },
  { bg: "rgba(90,63,168,0.08)",  color: "#5a3fa8" },
  { bg: "rgba(0,144,122,0.08)",  color: "#00907a" },
  { bg: "rgba(200,120,0,0.08)",  color: "#c87800" },
];

export default function KnowledgeBase() {
  const { data: articles, isLoading: kLoading } = useKnowledgeBase();
  const { mutateAsync: createArticle, isPending } = useCreateArticle();
  const { user } = useAuth();
  const { toast } = useToast();
  const isAdmin = user?.roleId === ROLE_IDS.ADMIN;

  const [form, setForm] = useState({ title: "", content: "" });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    try {
      await createArticle({
        title: form.title,
        content: form.content,
        createdBy: user.id,
      });
      setForm({ title: "", content: "" });
      toast({ title: "Article published" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

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
              style={{ color: "#015185" }}
            >
              We Have Resources,<br />
              <span style={{ color: "#0270b8" }}>You Have Questions.</span>
            </h1>
            <p className="text-muted-foreground text-base max-w-lg leading-relaxed">
              Explore our curated library of startup guides, frameworks, and resources—crafted to help every team at every stage of growth.
            </p>
            {/* Decorative rule */}
            <div
              className="mt-6 h-1 w-20 rounded-full"
              style={{ background: "linear-gradient(90deg, #015185, #0270b8)" }}
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
                return (
                  <div
                    key={article.id}
                    className={`glass-card p-5 group cursor-pointer ${STAGGER[idx % STAGGER.length]}`}
                    style={{ transition: "transform 0.2s, box-shadow 0.2s" }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 32px rgba(1,81,133,0.12)";
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
                            <User className="h-3 w-3" />User #{article.createdBy}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3 w-3" />
                            {new Date(article.createdAt!).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div
                      className="h-[2px] mt-4 rounded-full opacity-0 group-hover:opacity-40 transition-opacity"
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

        {/* ── RIGHT COLUMN — admin: publish form | others: info card ── */}
        <div className="lg:w-[360px] xl:w-[400px] shrink-0">
          <div className="lg:sticky lg:top-[5.5rem]">

            {isAdmin ? (
              /* ── ADMIN: full publish form ── */
              <>
                <div
                  className="rounded-2xl border border-border/60 overflow-hidden"
                  style={{
                    background: "rgba(255,255,255,0.97)",
                    backdropFilter: "blur(16px)",
                    boxShadow: "0 20px 50px rgba(1,81,133,0.12)",
                  }}
                >
                  <div className="h-1.5" style={{ background: "linear-gradient(90deg, #015185, #0270b8)" }} />
                  <div className="p-6">
                    <h2 className="text-xl font-display font-bold mb-1" style={{ color: "#015185" }}>
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
                          {["General", "Funding", "Growth", "Legal", "Operations"].map(cat => (
                            <button
                              key={cat}
                              type="button"
                              className="px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150"
                              style={{ borderColor: "rgba(1,81,133,0.25)", color: "#015185", background: "rgba(1,81,133,0.06)" }}
                              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(1,81,133,0.15)"; }}
                              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(1,81,133,0.06)"; }}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full h-10 rounded-lg font-semibold text-white relative overflow-hidden group mt-2"
                        style={{ background: "linear-gradient(135deg, #015185, #0270b8)", boxShadow: "0 2px 10px rgba(1,81,133,0.25)" }}
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

                {/* Stats strip — admin only */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="rounded-xl p-4 border border-border/50" style={{ background: "rgba(1,81,133,0.04)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "#015185" }}>Total Articles</p>
                    <p className="text-2xl font-bold" style={{ color: "#015185" }}>{kLoading ? "—" : articles?.length ?? 0}</p>
                  </div>
                  <div className="rounded-xl p-4 border border-border/50" style={{ background: "rgba(1,81,133,0.04)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "#015185" }}>Contributors</p>
                    <p className="text-2xl font-bold" style={{ color: "#015185" }}>
                      {kLoading ? "—" : (new Set(articles?.map(a => a.createdBy))).size}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              /* ── NON-ADMIN: read-only info card ── */
              <div
                className="rounded-2xl border border-border/60 overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.97)",
                  backdropFilter: "blur(16px)",
                  boxShadow: "0 20px 50px rgba(1,81,133,0.08)",
                }}
              >
                <div className="h-1.5" style={{ background: "linear-gradient(90deg, #015185, #0270b8)" }} />
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: "rgba(1,81,133,0.08)" }}
                    >
                      <Lock className="h-5 w-5" style={{ color: "#015185" }} />
                    </div>
                    <div>
                      <h2 className="text-base font-display font-bold" style={{ color: "#015185" }}>Knowledge Base</h2>
                      <p className="text-xs text-muted-foreground">Read-only access</p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                    Browse the articles and guides below. Only administrators can publish new resources.
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl p-4 border border-border/50" style={{ background: "rgba(1,81,133,0.04)" }}>
                      <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "#015185" }}>Total Articles</p>
                      <p className="text-2xl font-bold" style={{ color: "#015185" }}>{kLoading ? "—" : articles?.length ?? 0}</p>
                    </div>
                    <div className="rounded-xl p-4 border border-border/50" style={{ background: "rgba(1,81,133,0.04)" }}>
                      <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "#015185" }}>Contributors</p>
                      <p className="text-2xl font-bold" style={{ color: "#015185" }}>
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
