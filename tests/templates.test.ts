import { describe, expect, it } from "bun:test";
import { renderCouponCard, renderCouponModal } from "../src/templates";
import type { CouponItem } from "../src/types";

describe("Coupon & Deals Handlebars Rendering", () => {
  const mockCoupon: CouponItem = {
    id: "c-101",
    storeName: "Nike",
    discount: "20% OFF",
    title: "20% Off All Footwear and Apparel",
    code: "NIKE20",
    isVerified: true,
    expiresText: "Expires in 3 days",
    affiliateUrl: "https://example.com/aff/nike"
  };

  it("renders coupon card with verified badge and code button", () => {
    const html = renderCouponCard(mockCoupon);
    expect(html).toContain("20% OFF");
    expect(html).toContain("✓ Verified");
    expect(html).toContain("NIKE20");
    expect(html).toContain("data-coupon-id=\"c-101\"");
  });

  it("renders deal button when coupon has no code", () => {
    const dealCoupon: CouponItem = { ...mockCoupon, code: undefined };
    const html = renderCouponCard(dealCoupon);
    expect(html).toContain("Get Deal →");
    expect(html).not.toContain("Get Code");
  });

  it("renders coupon modal with accessible dialog markup and copy input", () => {
    const html = renderCouponModal(mockCoupon);
    expect(html).toContain("role=\"dialog\"");
    expect(html).toContain("aria-modal=\"true\"");
    expect(html).toContain("NIKE20");
    expect(html).toContain("Nike");
  });
});
