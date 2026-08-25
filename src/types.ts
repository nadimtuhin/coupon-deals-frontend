export interface CouponItem {
  id: string;
  storeName: string;
  discount: string;
  title: string;
  code?: string;
  isVerified: boolean;
  expiresText: string;
  affiliateUrl: string;
}

export interface BannerSlide {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaUrl: string;
  badge: string;
}
