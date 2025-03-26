
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mail, FileText, Filter, Clock } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav Bar */}
      <header className="border-b border-border shadow-sm bg-card/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <Mail className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">EmailSorted</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/dashboard" className="text-foreground/80 hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <Link to="/email-classification" className="text-foreground/80 hover:text-foreground transition-colors">
                Classify Emails
              </Link>
              <Link to="/analytics" className="text-foreground/80 hover:text-foreground transition-colors">
                Analytics
              </Link>
              <Button asChild>
                <Link to="/email-classification">
                  Get Started
                </Link>
              </Button>
            </nav>
            <div className="md:hidden">
              <Button variant="ghost" size="icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                  <line x1="4" x2="20" y1="12" y2="12"></line>
                  <line x1="4" x2="20" y1="6" y2="6"></line>
                  <line x1="4" x2="20" y1="18" y2="18"></line>
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32 bg-background">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/20 opacity-80"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-10">
            <div className="space-y-4 animate-fadeIn">
              <div className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                AI-Powered Email Classification System
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance max-w-4xl mx-auto">
                Intelligent Email Classification for Loan Servicing Teams
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
                Automatically classify emails, extract data, detect duplicates, and route requests to the appropriate teams with high accuracy.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-slideUp">
              <Button asChild size="lg" className="text-base">
                <Link to="/email-classification">
                  Classify Email
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base">
                <Link to="/dashboard">
                  View Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Key Features</h2>
            <p className="text-muted-foreground mt-4 max-w-3xl mx-auto">
              Our AI-powered system streamlines the email processing workflow for loan servicing teams.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background border border-border rounded-lg p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Filter className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Intelligent Classification</h3>
              <p className="text-muted-foreground">
                Accurately classify emails into predefined request types and sub-request types with high confidence scores.
              </p>
            </div>

            <div className="bg-background border border-border rounded-lg p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Data Extraction</h3>
              <p className="text-muted-foreground">
                Extract key data fields from email content and attachments to populate service requests automatically.
              </p>
            </div>

            <div className="bg-background border border-border rounded-lg p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Duplicate Detection</h3>
              <p className="text-muted-foreground">
                Identify duplicate emails to prevent redundant service requests and reduce operational risk.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to streamline your email processing?</h2>
          <p className="text-muted-foreground mb-8 max-w-3xl mx-auto">
            Start classifying emails and reducing manual triage work with our AI-powered solution.
          </p>
          <Button asChild size="lg" className="text-base">
            <Link to="/email-classification">
              Get Started Now
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Mail className="h-5 w-5 text-primary" />
              <span className="font-semibold">EmailSorted</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2025 EmailSorted. AI-Powered Email Classification System.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
