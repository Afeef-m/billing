import Logo from "./Logo";
import Navigation from "./Navigation";

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-background">
      {/* Logo */}
      <div className="border-b p-6">
        <Logo />
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        <Navigation />
      </div>

      {/* Footer (placeholder) */}
      <div className="border-t p-4 text-sm text-muted-foreground">
        BillEase v1.0.0
      </div>
    </aside>
  );
}