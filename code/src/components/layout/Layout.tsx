
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Mail, FileText } from "lucide-react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: FileText },
    { name: "Email Classification", href: "/email-classification", icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-64 bg-card shadow-md z-10 border-r border-border">
        <div className="h-16 flex items-center justify-center border-b border-border">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <Mail className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">EmailSorted</span>
          </Link>
        </div>
        <nav className="mt-6 px-3 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <item.icon className={`mr-3 h-5 w-5 ${isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-border bg-card shadow-sm flex items-center justify-between px-6">
          <h1 className="text-lg font-medium">Email Classification System</h1>
          <div className="flex items-center space-x-4">
            <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              <span className="text-sm font-medium">ES</span>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 bg-background">
          <div className="animate-fadeIn">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
