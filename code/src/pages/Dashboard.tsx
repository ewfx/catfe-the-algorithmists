
import React from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard: React.FC = () => {
  // Mock data for dashboard charts
  const requestTypeData = [
    { name: "Adjustment", value: 12 },
    { name: "AU Transfer", value: 8 },
    { name: "Closing Notice", value: 15 },
    { name: "Commitment Change", value: 20 },
    { name: "Fee Payment", value: 18 },
    { name: "Money Movement-Inbound", value: 25 },
    { name: "Money Movement - Outbound", value: 10 },
  ];

  const confidenceData = [
    { name: "90-100%", value: 45 },
    { name: "80-89%", value: 30 },
    { name: "70-79%", value: 15 },
    { name: "<70%", value: 10 },
  ];

  const duplicateData = [
    { name: "New Requests", value: 85 },
    { name: "Duplicates", value: 15 },
  ];

  const COLORS = [
    "#3498db", "#2ecc71", "#f39c12", "#e74c3c", 
    "#9b59b6", "#1abc9c", "#34495e"
  ];

  const DUPLICATE_COLORS = ["#4299e1", "#f56565"];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <Link 
            to="/email-classification" 
            className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80"
          >
            Classify New Email
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Total Emails Processed</CardTitle>
              <CardDescription>Last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">108</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Duplicate Detection Rate</CardTitle>
              <CardDescription>Last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">15.3%</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Average Confidence Score</CardTitle>
              <CardDescription>Last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">87.4%</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Request Type Distribution</CardTitle>
              <CardDescription>Email classification by request type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={requestTypeData}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 40, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      width={150}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3498db" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="col-span-1 grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Confidence Score Distribution</CardTitle>
                <CardDescription>Classification confidence levels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={confidenceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {confidenceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Duplicate vs New Emails</CardTitle>
                <CardDescription>Email uniqueness metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={duplicateData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {duplicateData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={DUPLICATE_COLORS[index % DUPLICATE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
