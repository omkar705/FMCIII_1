import { Shell } from "@/components/layout/Shell";
import { useKnowledgeBase, useCreateArticle } from "@/hooks/use-knowledge-base";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Library, Plus, Loader2, BookOpen, Calendar, User } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

const STAGGER = ["stagger-1","stagger-2","stagger-3","stagger-4","stagger-5","stagger-6"];

// Rotating icon accent colors — professional muted tones
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
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    const formData = new FormData(e.currentTarget);
    try {
      await createArticle({
        title: formData.get("title") as string,
        content: formData.get("content") as string,
        createdBy: user.id,
      });
      setIsOpen(false);
      toast({ title: "Article published" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <Shell>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-7 stagger-1">
        <div>
          <h1 className="text-3xl font-display font-bold mb-1" style={{ color: "#015185" }}>Knowledge Base</h1>
          <p className="text-muted-foreground">Resources and guidelines for startups.</p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              className="h-10 px-5 rounded-lg font-semibold text-white relative overflow-hidden group"
              style={{ background: "linear-gradient(135deg, #015185, #0270b8)", boxShadow: "0 2px 10px rgba(1,81,133,0.25)" }}
            >
              <span className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-500" />
              <Plus className="mr-1.5 h-4 w-4 relative z-10" />
              <span className="relative z-10">New Article</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="border-border/60 max-w-2xl"
            style={{ background: "rgba(255,255,255,0.97)", backdropFilter: "blur(16px)", boxShadow: "0 20px 50px rgba(1,81,133,0.12)" }}>
            <div className="h-1 rounded-t-md mb-3" style={{ background: "linear-gradient(90deg, #015185, #0270b8)" }} />
            <DialogHeader>
              <DialogTitle className="font-display text-xl" style={{ color: "#015185" }}>Create Resource</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold tracking-wide uppercase text-foreground/60">Title</Label>
                <Input name="title" required
                  className="h-10 rounded-lg border-border/70 bg-white/90 focus:border-primary focus:ring-2 focus:ring-primary/10"
                  placeholder="e.g. How to prepare for Series A" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold tracking-wide uppercase text-foreground/60">Content</Label>
                <Textarea name="content" required
                  className="rounded-lg border-border/70 bg-white/90 min-h-[180px] focus:border-primary focus:ring-2 focus:ring-primary/10"
                  placeholder="Write article content here..." />
              </div>
              <Button type="submit" disabled={isPending} className="w-full h-10 rounded-lg font-semibold text-white"
                style={{ background: "linear-gradient(135deg, #015185, #0270b8)" }}>
                {isPending ? <Loader2 className="animate-spin" /> : "Publish Article"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {kLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary h-7 w-7" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {articles?.map((article, idx) => {
            const acc = ICON_ACCENTS[idx % ICON_ACCENTS.length];
            return (
              <div key={article.id} className={`glass-card p-5 group ${STAGGER[idx % STAGGER.length]}`}>
                <div className="flex items-start gap-4">
                  {/* Icon orb */}
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

                {/* Subtle bottom accent on hover */}
                <div className="h-[2px] mt-4 rounded-full opacity-0 group-hover:opacity-40 transition-opacity"
                  style={{ background: `linear-gradient(90deg, transparent, ${acc.color}, transparent)` }} />
              </div>
            );
          })}

          {articles?.length === 0 && (
            <div className="col-span-full py-14 text-center stagger-1">
              <div className="inline-flex flex-col items-center gap-3 p-8 rounded-2xl border-2 border-dashed border-border">
                <Library className="h-10 w-10 text-muted-foreground/30 animate-float" />
                <div>
                  <h3 className="text-base font-medium text-foreground/60">No articles found</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">Start building the knowledge base.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Shell>
  );
}
