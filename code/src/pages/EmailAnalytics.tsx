
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { RequestType } from "@/types/email";

const EmailAnalytics: React.FC = () => {
  const [timeframe, setTimeframe] = useState<"week" | "month" | "quarter">("month");
  
  // Mock data for analytics
  const weeklyData = [
    { day: "Mon", count: 12, duplicates: 2 },
    { day: "Tue", count: 18, duplicates: 3 },
    { day: "Wed", count: 15, duplicates: 1 },
    { day: "Thu", count: 22, duplicates: 4 },
    { day: "Fri", count: 20, duplicates: 3 },
    { day: "Sat", count: 5, duplicates: 0 },
    { day: "Sun", count: 3, duplicates: 0 },
  ];
  
  const monthlyData = [
    { date: "Week 1", count: 65, duplicates: 10 },
    { date: "Week 2", count: 72, duplicates: 12 },
    { date: "Week 3", count: 83, duplicates: 15 },
    { date: "Week 4", count: 78, duplicates: 14 },
  ];
  
  const quarterlyData = [
    { date: "Jan", count: 250, duplicates: 45 },
    { date: "Feb", count: 280, duplicates: 53 },
    { date: "Mar", count: 310, duplicates: 60 },
  ];
  
  const getTimeframeData = () => {
    switch (timeframe) {
      case "week": return weeklyData;
      case "month": return monthlyData;
      case "quarter": return quarterlyData;
      default: return monthlyData;
    }
  };
  
  // Request type performance data
  const requestTypePerformance = [
    {
      name: "Adjustment",
      avgConfidence: 92,
      processingTime: 3.2,
    },
    {
      name: "AU Transfer",
      avgConfidence: 88,
      processingTime: 3.8,
    },
    {
      name: "Closing Notice",
      avgConfidence: 95,
      processingTime: 2.5,
    },
    {
      name: "Commitment Change",
      avgConfidence: 87,
      processingTime: 4.1,
    },
    {
      name: "Fee Payment",
      avgConfidence: 91,
      processingTime: 3.0,
    },
    {
      name: "Money Movement-Inbound",
      avgConfidence: 94,
      processingTime: 2.8,
    },
    {
      name: "Money Movement - Outbound",
      avgConfidence: 89,
      processingTime: 3.5,
    },
  ];
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Email Analytics</h2>
        </div>
        
        <Tabs defaultValue="volume" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="volume">Volume Analysis</TabsTrigger>
            <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
            <TabsTrigger value="comparison">Request Type Comparison</TabsTrigger>
          </TabsList>
          
          <TabsContent value="volume" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Email Volume Trends</CardTitle>
                    <CardDescription>Tracking email classification volume over time</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      className={`px-3 py-1 text-xs rounded-md ${timeframe === "week" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                      onClick={() => setTimeframe("week")}
                    >
                      Week
                    </button>
                    <button
                      className={`px-3 py-1 text-xs rounded-md ${timeframe === "month" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                      onClick={() => setTimeframe("month")}
                    >
                      Month
                    </button>
                    <button
                      className={`px-3 py-1 text-xs rounded-md ${timeframe === "quarter" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                      onClick={() => setTimeframe("quarter")}
                    >
                      Quarter
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={getTimeframeData()}
                      margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey={timeframe === "week" ? "day" : "date"} 
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        label={{ 
                          value: 'Email Count', 
                          angle: -90, 
                          position: 'insideLeft',
                          style: {
                            textAnchor: 'middle',
                            fontSize: 12,
                            fill: '#888',
                          }
                        }}
                      />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="count" 
                        name="Total Emails" 
                        stroke="#3498db" 
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="duplicates" 
                        name="Duplicate Emails" 
                        stroke="#e74c3c" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Classification Performance</CardTitle>
                <CardDescription>Confidence scores by request type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={requestTypePerformance}
                      margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        tick={{ 
                          fontSize: 12, 
                          textAnchor: 'end',
                          transform: 'rotate(-45)'
                        }}
                        height={70}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        label={{ 
                          value: 'Confidence (%)', 
                          angle: -90, 
                          position: 'insideLeft',
                          style: {
                            textAnchor: 'middle',
                            fontSize: 12,
                            fill: '#888',
                          }
                        }}
                      />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        dataKey="avgConfidence" 
                        name="Avg. Confidence (%)" 
                        fill="#3498db" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="comparison" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Processing Time by Request Type</CardTitle>
                <CardDescription>Average time to process each request type (seconds)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={requestTypePerformance}
                      margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        tick={{ 
                          fontSize: 12, 
                          textAnchor: 'end',
                          transform: 'rotate(-45)'
                        }}
                        height={70}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        label={{ 
                          value: 'Time (seconds)', 
                          angle: -90, 
                          position: 'insideLeft',
                          style: {
                            textAnchor: 'middle',
                            fontSize: 12,
                            fill: '#888',
                          }
                        }}
                      />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        dataKey="processingTime" 
                        name="Avg. Processing Time (s)" 
                        fill="#2ecc71" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default EmailAnalytics;
