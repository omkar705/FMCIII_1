import { useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Building2,
  Users,
  PieChart,
  FileText,
  Download,
  Mail,
  Phone,
  Globe,
  MapPin,
  ExternalLink,
} from "lucide-react";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("company");

  const company = {
    name: "Acme Corp",
    domain: "FinTech / SaaS",
    description:
      "Acme Corp is revolutionizing digital payments with advanced AI-driven fraud detection and seamless cross-border transactions for businesses.",
    founded: "2023",
    stage: "Seed",
    location: "Mumbai, India",
    website: "https://acmecorp.example.com",
    email: "contact@acmecorp.example.com",
    phone: "+91 98765 43210",
  };

  const teamMembers = [
    { id: 1, name: "Alice Johnson", role: "CEO & Founder", equity: "45%" },
    { id: 2, name: "Bob Smith", role: "CTO", equity: "30%" },
    { id: 3, name: "Charlie Davis", role: "Head of Product", equity: "5%" },
    { id: 4, name: "Diana Prince", role: "Lead Engineer", equity: "2%" },
  ];

  const capTable = [
    { id: 1, stakeholder: "Founders", shares: "7,500,000", percentage: "75%" },
    { id: 2, stakeholder: "Seed Investors", shares: "1,500,000", percentage: "15%" },
    { id: 3, stakeholder: "Employee Option Pool", shares: "1,000,000", percentage: "10%" },
  ];

  const documents = [
    {
      id: 1,
      name: "Certificate of Incorporation",
      type: "PDF",
      date: "Jan 15, 2023",
      size: "2.4 MB",
    },
    {
      id: 2,
      name: "Founders Agreement",
      type: "PDF",
      date: "Jan 20, 2023",
      size: "4.1 MB",
    },
    {
      id: 3,
      name: "Term Sheet (Seed Round)",
      type: "PDF",
      date: "Nov 05, 2023",
      size: "1.8 MB",
    },
    {
      id: 4,
      name: "Non-Disclosure Agreement Template",
      type: "Word",
      date: "Feb 10, 2023",
      size: "850 KB",
    },
  ];

  return (
    <Shell>
      <div className="flex flex-col gap-8">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row justify-between gap-6">

          <div className="flex items-center gap-5">
            <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center shadow-xl">
              <Building2 className="h-10 w-10 text-[#015185]" />
            </div>

            <div>
              <h1 className="text-4xl font-bold text-[#015185]">{company.name}</h1>

              <p className="text-muted-foreground mt-1">
                {company.domain} • Founded {company.founded}
              </p>

              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-3 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-400/20">
                  {company.stage} Stage
                </span>

                <span className="px-3 py-1 text-xs rounded-full bg-blue-500/10 text-blue-400 border border-blue-400/20">
                  {teamMembers.length} Team Members
                </span>

                <span className="px-3 py-1 text-xs rounded-full bg-white/5 border border-white/10">
                  {company.location}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <Button variant="outline">Edit Profile</Button>
            <Button>Share</Button>
          </div>
        </div>

        {/* TABS */}

        <Tabs value={activeTab} onValueChange={setActiveTab}>

          <TabsList className="bg-white/5 border border-white/10 rounded-xl p-1 flex gap-1 w-fit">

            <TabsTrigger value="company">
              <Building2 className="h-4 w-4 mr-2" />
              Company
            </TabsTrigger>

            <TabsTrigger value="team">
              <Users className="h-4 w-4 mr-2" />
              Team
            </TabsTrigger>

            <TabsTrigger value="captable">
              <PieChart className="h-4 w-4 mr-2" />
              Cap Table
            </TabsTrigger>

            <TabsTrigger value="documents">
              <FileText className="h-4 w-4 mr-2" />
              Documents
            </TabsTrigger>

          </TabsList>

          {/* COMPANY TAB */}

          <TabsContent value="company">

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

              <Card className="p-6 bg-white/[0.03] border border-white/10 lg:col-span-2">

                <h2 className="text-xl font-bold text-[#015185] mb-4">
                  About the Company
                </h2>

                <p className="text-muted-foreground leading-relaxed">
                  {company.description}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-white/10 mt-6">

                  <div>
                    <p className="text-xs text-muted-foreground">Domain</p>
                    <p className="text-[#015185] font-medium">{company.domain}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Stage</p>
                    <p className="text-[#015185] font-medium">{company.stage}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Founded</p>
                    <p className="text-[#015185] font-medium">{company.founded}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Team Size</p>
                    <p className="text-[#015185] font-medium">
                      {teamMembers.length}
                    </p>
                  </div>

                </div>
              </Card>

              {/* CONTACT */}

              <Card className="p-6 bg-white/[0.03] border border-white/10">

                <h2 className="text-xl font-bold text-[#015185] mb-6">
                  Contact Information
                </h2>

                <div className="space-y-5">

                  <div className="flex gap-3 items-center">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                    <a
                      href={company.website}
                      className="text-primary flex items-center gap-1 hover:underline"
                    >
                      {company.website.replace("https://", "")}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>

                  <div className="flex gap-3 items-center">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <span className="text-[#015185]">{company.email}</span>
                  </div>

                  <div className="flex gap-3 items-center">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <span className="text-[#015185]">{company.phone}</span>
                  </div>

                  <div className="flex gap-3 items-center">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <span className="text-[#015185]">{company.location}</span>
                  </div>

                </div>
              </Card>
            </div>
          </TabsContent>

          {/* TEAM */}

          <TabsContent value="team">
            <Card className="bg-white/[0.03] border border-white/10 mt-6">

              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-xl font-bold text-[#015185]">
                  Team Members
                </h2>
                <Button size="sm">Add Member</Button>
              </div>

              <table className="w-full text-left">

                <thead className="text-muted-foreground text-sm border-b border-white/10">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Equity</th>
                  </tr>
                </thead>

                <tbody>
                  {teamMembers.map((member) => (
                    <tr
                      key={member.id}
                      className="border-b border-white/5 hover:bg-[#015185]/5 transition"
                    >
                      <td className="p-4 flex items-center gap-3">

                        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center text-xs font-bold">
                          {member.name.charAt(0)}
                        </div>

                        <span className="text-[#015185] font-medium">
                          {member.name}
                        </span>

                      </td>

                      <td className="p-4 text-muted-foreground">
                        {member.role}
                      </td>

                      <td className="p-4">

                        <div className="flex items-center gap-2">
                          <span className="text-primary font-medium">
                            {member.equity}
                          </span>

                          <div className="h-1.5 w-20 bg-white/10 rounded-full">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: member.equity }}
                            />
                          </div>

                        </div>

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </TabsContent>

          {/* CAP TABLE */}

          <TabsContent value="captable">

            <Card className="bg-white/[0.03] border border-white/10 mt-6">

              <div className="p-6 border-b border-white/10 flex justify-between">

                <h2 className="text-xl font-bold text-[#015185]">
                  Ownership Structure
                </h2>

                <Button variant="outline" size="sm">
                  Export CSV
                </Button>

              </div>

              <table className="w-full">

                <thead className="text-muted-foreground border-b border-white/10">
                  <tr>
                    <th className="p-4">Stakeholder</th>
                    <th className="p-4">Shares</th>
                    <th className="p-4">Ownership</th>
                  </tr>
                </thead>

                <tbody>
                  {capTable.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-white/5 hover:bg-white/5"
                    >

                      <td className="p-4 text-[#015185] font-medium">
                        {row.stakeholder}
                      </td>

                      <td className="p-4 text-muted-foreground">
                        {row.shares}
                      </td>

                      <td className="p-4 flex items-center gap-3">

                        <span className="text-primary font-medium">
                          {row.percentage}
                        </span>

                        <div className="h-2 w-32 bg-white/10 rounded-full">

                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: row.percentage }}
                          />

                        </div>

                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>

            </Card>

          </TabsContent>

          {/* DOCUMENTS */}

          <TabsContent value="documents">

            <Card className="p-6 bg-white/[0.03] border border-white/10 mt-6">

              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#015185]">
                  Legal Documents
                </h2>
                <Button size="sm">Upload Document</Button>
              </div>

              <div className="space-y-3">

                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 border border-white/10 rounded-xl hover:border-primary/40 transition"
                  >

                    <div className="flex items-center gap-4">

                      <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>

                      <div>
                        <p className="text-[#015185] font-medium">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {doc.type} • {doc.size} • {doc.date}
                        </p>
                      </div>

                    </div>

                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>

                  </div>
                ))}

              </div>

            </Card>

          </TabsContent>

        </Tabs>

      </div>
    </Shell>
  );
}