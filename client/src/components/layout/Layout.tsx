import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:ml-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1">
          {children}
        </main>
        
        <footer className="px-6 py-4 border-t border-border bg-background">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>2014-2025 © DreamsPOS. All Rights Reserved</p>
            <p>Designed & Developed by <span className="text-primary font-medium">Dreams Technologies</span></p>
          </div>
        </footer>
      </div>
    </div>
  );
}
