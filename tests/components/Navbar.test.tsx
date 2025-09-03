import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import DynamicNavigation from "@/app/components/DynamicNavigation";
import { getAllPagesForNav } from "@/lib/pages";

// Mock the getAllPagesForNav function
vi.mock("@/lib/pages", () => ({
  getAllPagesForNav: vi.fn()
}));

// Mock the NavLink component
vi.mock("@/app/components/NavLink", () => ({
  default: ({ item }: { item: { href: string; label: string } }) => (
    <a href={item.href} data-testid={`nav-link-${item.href.replace("/", "")}`}>
      {item.label}
    </a>
  )
}));

describe("DynamicNavigation", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renders navigation links from pages.json", async () => {
    // Mock the pages data
    const mockPages = [
      { slug: "/", title: "Home", order: 0, nav: true },
      { slug: "/services", title: "Services", order: 1, nav: true },
      { slug: "/about", title: "About", order: 2, nav: true }
    ];
    
    // Set up the mock implementation
    (getAllPagesForNav as any).mockResolvedValue(mockPages);
    
    // Render the component
    const Navigation = await DynamicNavigation();
    render(Navigation);
    
    // Check if the links are rendered with correct labels
    expect(screen.getByTestId("nav-link-")).toHaveTextContent("Home");
    expect(screen.getByTestId("nav-link-services")).toHaveTextContent("Services");
    expect(screen.getByTestId("nav-link-about")).toHaveTextContent("About");
  });

  it("only renders pages with nav=true", async () => {
    // Mock the pages data with some nav=false
    const mockPages = [
      { slug: "/", title: "Home", order: 0, nav: true },
      { slug: "/services", title: "Services", order: 1, nav: true },
      { slug: "/admin", title: "Admin", order: 2, nav: false }
    ];
    
    // Set up the mock implementation
    (getAllPagesForNav as any).mockResolvedValue(mockPages);
    
    // Render the component
    const Navigation = await DynamicNavigation();
    render(Navigation);
    
    // Check if only nav=true links are rendered
    expect(screen.getByTestId("nav-link-")).toHaveTextContent("Home");
    expect(screen.getByTestId("nav-link-services")).toHaveTextContent("Services");
    expect(screen.queryByTestId("nav-link-admin")).not.toBeInTheDocument();
  });
});
