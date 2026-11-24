import { describe, expect, it } from "bun:test";
import * as sass from "sass";
import { renderCouponCard, renderCouponModal } from "../src/templates";
import type { CouponItem } from "../src/types";

const base: CouponItem = {
  id: "c-1",
  storeName: "Nike",
  discount: "20% OFF",
  title: "20% Off",
  code: "NIKE20",
  isVerified: true,
  expiresText: "Expires in 3 days",
  affiliateUrl: "https://example.com/aff/nike",
};

describe("affiliate URL sanitizing", () => {
  const bad = ["javascript:alert(1)", " JavaScript:alert(1)", "java\tscript:alert(1)", "data:text/html,<script>alert(1)</script>", "vbscript:msgbox(1)"];
  for (const url of bad) {
    it(`does not emit ${JSON.stringify(url)} into href or data-affiliate`, () => {
      const deal = renderCouponCard({ ...base, code: undefined, affiliateUrl: url });
      const card = renderCouponCard({ ...base, affiliateUrl: url });
      const modal = renderCouponModal({ ...base, affiliateUrl: url });
      for (const html of [deal, card, modal]) {
        expect(html).not.toMatch(/(href|data-affiliate)="\s*(java|vb)?\s*script/i);
        expect(html).not.toMatch(/(href|data-affiliate)="\s*data:/i);
      }
      expect(deal).toContain('href="#"');
    });
  }

  it("keeps http(s) and relative URLs intact", () => {
    expect(renderCouponCard({ ...base, code: undefined })).toContain('href="https://example.com/aff/nike"');
    expect(renderCouponModal({ ...base, affiliateUrl: "/go/nike?x=1" })).toContain('href="/go/nike?x&#x3D;1"');
  });
});

describe("modal code input", () => {
  it("has an accessible name", () => {
    const html = renderCouponModal(base);
    expect(html).toMatch(/<input[^>]*aria-label="Coupon code"[^>]*id="coupon-code-val"/);
  });
});

describe("buttons", () => {
  it("are type=button so they never submit an enclosing form", () => {
    for (const html of [renderCouponCard(base), renderCouponModal(base)]) {
      const buttons = html.match(/<button\b[^>]*>/g) ?? [];
      expect(buttons.length).toBeGreaterThan(0);
      for (const b of buttons) expect(b).toContain('type="button"');
    }
  });
});

// WCAG 2.x contrast helpers
function lum(hex: string): number {
  const n = hex.replace("#", "");
  const full = n.length === 3 ? n.split("").map((c) => c + c).join("") : n;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255).map((c) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function ratio(a: string, b: string): number {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}
function blend(hex: string, alpha: number, bg = "#ffffff"): string {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [f, g] = [p(hex), p(bg)];
  return "#" + f.map((c, i) => Math.round(c * alpha + g[i] * (1 - alpha)).toString(16).padStart(2, "0")).join("");
}

describe("color contrast (WCAG AA, 4.5:1 for small text)", () => {
  const css = sass.compile("src/styles/main.scss", { style: "expanded" }).css;
  const rule = (sel: string) => {
    const m = css.match(new RegExp(sel.replace(/[.$]/g, "\\$&") + "\\s*\\{([^}]*)\\}"));
    if (!m) throw new Error(`no rule for ${sel}`);
    return m[1];
  };
  const prop = (sel: string, p: string) => rule(sel).match(new RegExp(`(?:^|;|\\s)${p}:\\s*([^;]+);`))![1].trim();
  const hex = (v: string) => {
    const m = v.match(/#[0-9a-f]{3,6}\b/i);
    if (m) return m[0].length === 4 ? "#" + m[0].slice(1).split("").map((c) => c + c).join("") : m[0];
    if (v === "#fff" || v === "white") return "#ffffff";
    throw new Error(`unparsed color ${v}`);
  };

  it("verified label text on white", () => {
    expect(ratio(hex(prop(".coupon-card__verified", "color")), "#ffffff")).toBeGreaterThanOrEqual(4.5);
  });
  it("discount pill text on its tinted background", () => {
    const fg = hex(prop(".coupon-card__discount", "color"));
    const bgDecl = prop(".coupon-card__discount", "background");
    const m = bgDecl.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/)!;
    const bgHex = "#" + [m[1], m[2], m[3]].map((c) => Number(c).toString(16).padStart(2, "0")).join("");
    expect(ratio(fg, blend(bgHex, Number(m[4])))).toBeGreaterThanOrEqual(4.5);
  });
  it("white text on copy button, including hover", () => {
    expect(ratio("#ffffff", hex(prop(".btn--copy", "background")))).toBeGreaterThanOrEqual(4.5);
    expect(ratio("#ffffff", hex(prop(".btn--copy:hover", "background")))).toBeGreaterThanOrEqual(4.5);
  });
});
