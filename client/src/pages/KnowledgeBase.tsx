import { Shell } from "@/components/layout/Shell";
import { useKnowledgeBase, useCreateArticle } from "@/hooks/use-knowledge-base";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Library, Plus, Loader2, BookOpen } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-display font-bold text-white mb-2">Knowledge Base</h1>
          <p className="text-muted-foreground text-lg">Resources and guidelines for startups.</p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl h-11 px-6 bg-[#015185] text-white shadow-lg">
              <Plus className="mr-2 h-4 w-4" /> New Article
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-white/10 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">Create Resource</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label className="text-[#015185]">Title</Label>
                <Input name="title" required className="bg-white/50 border-black/30 font-medium text-black" placeholder="e.g. How to prepare for Series A" />
              </div>
              <div className="space-y-2">
                <Label className="text-[#015185]">Content</Label>
                <Textarea name="content" required className="bg-white/50 border-black/30 min-h-[200px] font-sans text-black" placeholder="Write article content here..." />
              </div>
              <Button type="submit" disabled={isPending} className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700">
                {isPending ? <Loader2 className="animate-spin" /> : "Publish Article"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {kLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary h-8 w-8" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles?.map(article => (
            <Card key={article.id} className="p-6 border-white/5 bg-card/60 backdrop-blur-xl hover-elevate">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                  <BookOpen className="h-6 w-6 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-display font-bold text-white mb-2">{article.title}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-4 leading-relaxed">
                    {article.content}
                  </p>
                  <div className="flex justify-between items-center text-xs text-muted-foreground/70 pt-4 border-t border-white/5">
                    <span>By User #{article.createdBy}</span>
                    <span>{new Date(article.createdAt!).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          {articles?.length === 0 && (
            <div className="col-span-full py-16 text-center border-2 border-dashed border-white/10 rounded-2xl">
              <Library className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-white">No articles found</h3>
              <p className="text-muted-foreground mt-1">Start building the knowledge base.</p>
            </div>
          )}
        </div>
      )}
    </Shell>
  );
}
