import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Shell } from "@/components/layout/Shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Building2,
  Globe,
  Mail,
  Phone,
  Users,
  MapPin,
  Edit,
  CalendarDays,
  Plus,
  Trash2,
  Save,
} from "lucide-react";

function ProfileSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <Skeleton className="h-10 w-48 rounded-xl bg-white/10" />
      <div className="flex items-center gap-6">
        <Skeleton className="h-20 w-20 rounded-2xl bg-white/10" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 rounded-lg bg-white/10" />
          <Skeleton className="h-5 w-32 rounded-lg bg-white/10" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-2xl bg-white/10" />
        ))}
      </div>
    </div>
  );
}

interface FeeItem {
  id: number;
  description?: string;
  amount: number;
}

interface MonthlyCollection {
  id: number;
  previousBalance?: number;
  taxableAmount?: number;
  cgst?: number;
  sgst?: number;
  igst?: number;
  totalAmountReceivable?: number;
  amountReceived?: number;
  tdsReceivable?: number;
  amountReceiptDate?: string;
  gstPaymentStatus?: string;
  actualGstPaidInMonth?: number;
}

function RevenueAndCollections({ startupId }: { startupId: number }) {
  const [activeTab, setActiveTab] = useState("details");
  const [revenueDetails, setRevenueDetails] = useState<any>(null);
  const [trainingFees, setTrainingFees] = useState<FeeItem[]>([]);
  const [consultancyFees, setConsultancyFees] = useState<FeeItem[]>([]);
  const [registrationFees, setRegistrationFees] = useState<FeeItem[]>([]);
  const [monthlyCollections, setMonthlyCollections] = useState<MonthlyCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState("April");

  const months = ["April", "May", "June", "July", "August", "September", "October", "November", "December", "January", "February", "March"];
  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString());

  // Fetch all data on mount
  useEffect(() => {
    fetchAllData();
  }, [startupId]);

  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      const [details, training, consultancy, registration, collections] = await Promise.all([
        fetch(`/api/startups/${startupId}/revenue-details`).then(r => r.json()),
        fetch(`/api/startups/${startupId}/training-fees`).then(r => r.json()),
        fetch(`/api/startups/${startupId}/consultancy-fees`).then(r => r.json()),
        fetch(`/api/startups/${startupId}/registration-fees`).then(r => r.json()),
        fetch(`/api/startups/${startupId}/monthly-collections`).then(r => r.json()),
      ]);

      setRevenueDetails(details || {});
      setTrainingFees(training || []);
      setConsultancyFees(consultancy || []);
      setRegistrationFees(registration || []);
      setMonthlyCollections(collections || []);
    } catch (error) {
      console.error("Failed to fetch revenue data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveRevenueDetails = async () => {
    try {
      setIsSaving(true);
      const res = await fetch(`/api/startups/${startupId}/revenue-details`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(revenueDetails),
      });

      if (res.ok) {
        const updated = await res.json();
        setRevenueDetails(updated);
        alert("Revenue details saved successfully!");
      }
    } catch (error) {
      console.error("Failed to save revenue details:", error);
      alert("Failed to save revenue details");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddFee = async (type: "training" | "consultancy" | "registration") => {
    const description = prompt("Enter description:");
    const amountStr = prompt("Enter amount:");

    if (!description || !amountStr) return;

    const amount = parseInt(amountStr, 10);
    if (isNaN(amount)) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      const endpoint = type === "training" ? "training-fees" : type === "consultancy" ? "consultancy-fees" : "registration-fees";
      const res = await fetch(`/api/startups/${startupId}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, amount }),
      });

      if (res.ok) {
        const newFee = await res.json();
        if (type === "training") setTrainingFees([...trainingFees, newFee]);
        else if (type === "consultancy") setConsultancyFees([...consultancyFees, newFee]);
        else setRegistrationFees([...registrationFees, newFee]);
      }
    } catch (error) {
      console.error("Failed to add fee:", error);
    }
  };

  const handleDeleteFee = async (id: number, type: "training" | "consultancy" | "registration") => {
    if (!confirm("Are you sure you want to delete this fee?")) return;

    try {
      const endpoint = type === "training" ? "training-fees" : type === "consultancy" ? "consultancy-fees" : "registration-fees";
      const res = await fetch(`/api/${endpoint}/${id}`, { method: "DELETE" });

      if (res.ok) {
        if (type === "training") setTrainingFees(trainingFees.filter(f => f.id !== id));
        else if (type === "consultancy") setConsultancyFees(consultancyFees.filter(f => f.id !== id));
        else setRegistrationFees(registrationFees.filter(f => f.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete fee:", error);
    }
  };

  const handleSaveMonthlyCollection = async () => {
    const currentCollection = monthlyCollections.find(c => c.previousBalance !== undefined);
    try {
      setIsSaving(true);
      const res = await fetch(`/api/startups/${startupId}/monthly-collections/${selectedYear}/${selectedMonth}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentCollection || {}),
      });

      if (res.ok) {
        alert("Monthly collection saved successfully!");
        fetchAllData();
      }
    } catch (error) {
      console.error("Failed to save monthly collection:", error);
      alert("Failed to save monthly collection");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteMonthlyCollection = async (id: number) => {
    if (!confirm("Are you sure you want to delete this collection record?")) return;

    try {
      const res = await fetch(`/api/monthly-collections/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMonthlyCollections(monthlyCollections.filter(c => c.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete collection:", error);
    }
  };

  if (isLoading) {
    return <Skeleton className="h-96 bg-white/10 rounded-xl" />;
  }

  const currentCollection = monthlyCollections.find(c => c.previousBalance !== undefined) || {};

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-white/5 border border-white/10 rounded-xl p-1">
          <TabsTrigger value="details">Part A</TabsTrigger>
          <TabsTrigger value="training">Part B</TabsTrigger>
          <TabsTrigger value="consultancy">Part C</TabsTrigger>
          <TabsTrigger value="registration">Part D</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>

        {/* Part A - Incubation Charges */}
        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Part A - Incubation Charges</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>GSTIN</Label>
                  <Input value={revenueDetails.gstin || ""} onChange={(e) => setRevenueDetails({ ...revenueDetails, gstin: e.target.value })} />
                </div>
                <div>
                  <Label>Current Agreement Period</Label>
                  <Input value={revenueDetails.currentAgreementPeriod || ""} onChange={(e) => setRevenueDetails({ ...revenueDetails, currentAgreementPeriod: e.target.value })} />
                </div>
                <div>
                  <Label>Date for Increment Proposed</Label>
                  <Input type="date" value={revenueDetails.incrementProposedDate || ""} onChange={(e) => setRevenueDetails({ ...revenueDetails, incrementProposedDate: e.target.value })} />
                </div>
                <div>
                  <Label>Without GST</Label>
                  <Input type="number" value={revenueDetails.withoutGst || ""} onChange={(e) => setRevenueDetails({ ...revenueDetails, withoutGst: parseInt(e.target.value) || 0 })} />
                </div>
                <div>
                  <Label>5% Raise in Rent From April 26</Label>
                  <Input type="number" value={revenueDetails.rentIncreaseFivePercent || ""} onChange={(e) => setRevenueDetails({ ...revenueDetails, rentIncreaseFivePercent: parseInt(e.target.value) || 0 })} />
                </div>
                <div>
                  <Label>Monthly IC (Current)</Label>
                  <Input type="number" value={revenueDetails.monthlyIcCurrent || ""} onChange={(e) => setRevenueDetails({ ...revenueDetails, monthlyIcCurrent: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
              <Button onClick={handleSaveRevenueDetails} disabled={isSaving} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save Revenue Details"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Part B - Training Fees */}
        <TabsContent value="training" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Part B - Training Fee</CardTitle>
              <Button size="sm" onClick={() => handleAddFee("training")}>
                <Plus className="mr-2 h-4 w-4" />
                Add Fee
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {trainingFees.length === 0 ? (
                  <p className="text-muted-foreground">No training fees added yet</p>
                ) : (
                  trainingFees.map(fee => (
                    <div key={fee.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
                      <div>
                        <p className="font-medium">{fee.description}</p>
                        <p className="text-sm text-muted-foreground">Amount: ₹{fee.amount}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteFee(fee.id, "training")}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Part C - Consultancy Fees */}
        <TabsContent value="consultancy" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Part C - Industrial Project Consultancy</CardTitle>
              <Button size="sm" onClick={() => handleAddFee("consultancy")}>
                <Plus className="mr-2 h-4 w-4" />
                Add Fee
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {consultancyFees.length === 0 ? (
                  <p className="text-muted-foreground">No consultancy fees added yet</p>
                ) : (
                  consultancyFees.map(fee => (
                    <div key={fee.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
                      <div>
                        <p className="font-medium">{fee.description}</p>
                        <p className="text-sm text-muted-foreground">Amount: ₹{fee.amount}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteFee(fee.id, "consultancy")}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Part D - Registration Fees */}
        <TabsContent value="registration" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Part D - One Time Registration Charges</CardTitle>
              <Button size="sm" onClick={() => handleAddFee("registration")}>
                <Plus className="mr-2 h-4 w-4" />
                Add Fee
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {registrationFees.length === 0 ? (
                  <p className="text-muted-foreground">No registration fees added yet</p>
                ) : (
                  registrationFees.map(fee => (
                    <div key={fee.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
                      <div>
                        <p className="font-medium">{fee.description}</p>
                        <p className="text-sm text-muted-foreground">Amount: ₹{fee.amount}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteFee(fee.id, "registration")}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monthly Collections */}
        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Collections</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Financial Year</Label>
                  <select 
                    value={selectedYear} 
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  >
                    {years.map(year => <option key={year} value={year}>{year}-{parseInt(year) + 1}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Month</Label>
                  <select 
                    value={selectedMonth} 
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  >
                    {months.map(month => <option key={month} value={month}>{month}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Previous Balance</Label>
                  <Input type="number" value={currentCollection.previousBalance || ""} onChange={(e) => setMonthlyCollections([{ ...currentCollection, previousBalance: parseInt(e.target.value) || 0 }])} />
                </div>
                <div>
                  <Label>Taxable Amount</Label>
                  <Input type="number" value={currentCollection.taxableAmount || ""} onChange={(e) => setMonthlyCollections([{ ...currentCollection, taxableAmount: parseInt(e.target.value) || 0 }])} />
                </div>
                <div>
                  <Label>CGST</Label>
                  <Input type="number" value={currentCollection.cgst || ""} onChange={(e) => setMonthlyCollections([{ ...currentCollection, cgst: parseInt(e.target.value) || 0 }])} />
                </div>
                <div>
                  <Label>SGST</Label>
                  <Input type="number" value={currentCollection.sgst || ""} onChange={(e) => setMonthlyCollections([{ ...currentCollection, sgst: parseInt(e.target.value) || 0 }])} />
                </div>
                <div>
                  <Label>IGST</Label>
                  <Input type="number" value={currentCollection.igst || ""} onChange={(e) => setMonthlyCollections([{ ...currentCollection, igst: parseInt(e.target.value) || 0 }])} />
                </div>
                <div>
                  <Label>Total Amount Receivable</Label>
                  <Input type="number" value={currentCollection.totalAmountReceivable || ""} onChange={(e) => setMonthlyCollections([{ ...currentCollection, totalAmountReceivable: parseInt(e.target.value) || 0 }])} />
                </div>
                <div>
                  <Label>Amount Received</Label>
                  <Input type="number" value={currentCollection.amountReceived || ""} onChange={(e) => setMonthlyCollections([{ ...currentCollection, amountReceived: parseInt(e.target.value) || 0 }])} />
                </div>
                <div>
                  <Label>TDS Receivable</Label>
                  <Input type="number" value={currentCollection.tdsReceivable || ""} onChange={(e) => setMonthlyCollections([{ ...currentCollection, tdsReceivable: parseInt(e.target.value) || 0 }])} />
                </div>
                <div>
                  <Label>Amount Receipt Date</Label>
                  <Input type="date" value={currentCollection.amountReceiptDate || ""} onChange={(e) => setMonthlyCollections([{ ...currentCollection, amountReceiptDate: e.target.value }])} />
                </div>
                <div>
                  <Label>GST Payment Status</Label>
                  <Input value={currentCollection.gstPaymentStatus || ""} onChange={(e) => setMonthlyCollections([{ ...currentCollection, gstPaymentStatus: e.target.value }])} />
                </div>
                <div>
                  <Label>Actual GST Paid In The Month</Label>
                  <Input type="number" value={currentCollection.actualGstPaidInMonth || ""} onChange={(e) => setMonthlyCollections([{ ...currentCollection, actualGstPaidInMonth: parseInt(e.target.value) || 0 }])} />
                </div>
              </div>

              <Button onClick={handleSaveMonthlyCollection} disabled={isSaving} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save Monthly Collection"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function StartupProfile() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();

  const [startup, setStartup] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStartup = async () => {
      try {
        const res = await fetch(`/api/startups/${params.id}`);
        const data = await res.json();
        setStartup(data);
      } catch (error) {
        console.error("Failed to fetch startup", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStartup();
  }, [params.id]);

  if (isLoading) {
    return (
      <Shell adminOnly>
        <ProfileSkeleton />
      </Shell>
    );
  }

  if (!startup) {
    return (
      <Shell adminOnly>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Building2 className="h-16 w-16 text-muted-foreground mb-6 opacity-40" />
          <h2 className="text-3xl font-display font-bold text-white mb-2">
            Startup Not Found
          </h2>
          <p className="text-muted-foreground mb-8">
            The startup you're looking for doesn't exist.
          </p>
          <Button
            onClick={() => navigate("/startups")}
            variant="outline"
            className="rounded-xl border-white/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Startups
          </Button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell adminOnly>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/startups")}
        className="mb-6 text-muted-foreground hover:text-[#2EA3E0]"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Startups
      </Button>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/30 to-blue-500/30 border border-white/10 flex items-center justify-center">
          <span className="font-bold text-4xl text-primary">
            {startup.name?.charAt(0)}
          </span>
        </div>

        <div className="flex-1">
          <h1 className="text-4xl font-bold text-white">{startup.name}</h1>
          <p className="text-muted-foreground text-sm">{startup.tagline}</p>

          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-2">
            <span className="flex items-center gap-1">
              <Globe className="h-4 w-4" /> {startup.domain}
            </span>

            <Badge className="bg-primary/20 text-primary border border-primary/30">
              {startup.stage}
            </Badge>

            <Badge className="bg-white/10 text-[#2EA3E0] border border-white/20">
              <Users className="h-3 w-3 mr-1" />
              {startup.teammembers} members
            </Badge>
          </div>
        </div>
      </div>

      <Tabs defaultValue="company">
        <TabsList className="mb-6 bg-white/5 border border-white/10 rounded-xl p-1">
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="captable">Cap Table</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="revenue">Revenue & Collections</TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>About the Company</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{startup.description}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue">
          <RevenueAndCollections startupId={startup.id} />
        </TabsContent>
      </Tabs>
    </Shell>
  );
}
