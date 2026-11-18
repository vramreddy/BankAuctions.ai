import React from "react";
import { describe, it, expect, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import LoginPage from "./LoginPage";
const session = vi.hoisted(() => ({
  user: null,
  loading: false,
  login: vi.fn(),
  logout: vi.fn(),
}));
vi.mock("../../../contexts/AuthContext", () => ({ useAuth: () => session }));
function render(portal) {
  return renderToStaticMarkup(
    <StaticRouter location="/login">
      <LoginPage portal={portal} />
    </StaticRouter>,
  );
}
describe("role-specific login screens", () => {
  it("shows registration only for the buyer login", () => {
    session.user = null;
    expect(render("BUYER")).toContain("Buyer login");
    expect(render("BUYER")).toContain("Create an account");
    expect(render("CHECKER")).toContain("Checker login");
    expect(render("CHECKER")).not.toContain("Create an account");
  });
  it("asks an existing buyer to switch accounts before entering the checker portal", () => {
    session.user = { role: "BUYER" };
    const html = render("CHECKER");
    expect(html).toContain("Sign out and switch account");
    expect(html).toContain("/buyer/dashboard");
    session.user = null;
  });
});
