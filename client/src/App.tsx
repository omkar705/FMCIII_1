import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Startups from "./pages/Startups";
import StartupProfile from "./pages/StartupProfile";
import Applications from "./pages/Applications";
import ApplicationForm from "./pages/ApplicationForm";
import Scorecards from "./pages/Scorecards";
import ScorecardDetail from "./pages/ScorecardDetail";
import Mentorship from "./pages/Mentorship";
import Funding from "./pages/Funding";
import KnowledgeBase from "./pages/KnowledgeBase";
import Profile from "./pages/Profile";
import AssetBooking from "./pages/AssetBooking";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/" component={Dashboard} />
      <Route path="/startups" component={Startups} />
      <Route path="/startups/:id" component={StartupProfile} />
      <Route path="/applications" component={Applications} />
      <Route path="/applications/new" component={ApplicationForm} />
      <Route path="/scorecards/:scorecardId" component={ScorecardDetail} />
      <Route path="/scorecards" component={Scorecards} />
      <Route path="/mentorship" component={Mentorship} />
      <Route path="/funding" component={Funding} />
      <Route path="/knowledge-base" component={KnowledgeBase} />
      <Route path="/profile" component={Profile} />
      <Route path="/bookings" component={AssetBooking} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
