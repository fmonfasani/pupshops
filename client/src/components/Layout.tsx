import { ReactNode } from "react";
import Navigation from "./Navigation";
import CartModal from "./CartModal";
import BookingModal from "./BookingModal";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>{children}</main>
      <CartModal />
      <BookingModal />
    </div>
  );
}
