import Handlebars from "handlebars";
import type { BannerSlide, CouponItem } from "./types";

export const couponCardTemplate = `
<div class="coupon-card" data-coupon-id="{{id}}">
  <div class="coupon-card__badge-row">
    <span class="coupon-card__discount">{{discount}}</span>
    {{#if isVerified}}
      <span class="coupon-card__verified">✓ Verified</span>
    {{/if}}
  </div>
  <h3 class="coupon-card__title">{{title}}</h3>
  <div class="coupon-card__footer">
    <span class="coupon-card__expiry">{{expiresText}}</span>
    {{#if code}}
      <button type="button" class="btn btn--copy" data-code="{{code}}" data-affiliate="{{affiliateUrl}}">
        <span class="btn__text">Get Code</span>
        <span class="btn__code-preview">{{code}}</span>
      </button>
    {{else}}
      <a href="{{affiliateUrl}}" target="_blank" rel="nofollow sponsored" class="btn btn--deal">
        Get Deal →
      </a>
    {{/if}}
  </div>
</div>
`;

export const couponModalTemplate = `
<div class="coupon-modal" id="coupon-dialog" role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <div class="coupon-modal__backdrop" data-close-modal></div>
  <div class="coupon-modal__content">
    <button type="button" class="coupon-modal__close" data-close-modal aria-label="Close modal">✕</button>
    <div class="coupon-modal__store">{{storeName}}</div>
    <h2 id="modal-title" class="coupon-modal__title">{{title}}</h2>
    
    <div class="coupon-modal__code-box">
      <input type="text" readonly value="{{code}}" aria-label="Coupon code" class="coupon-modal__input" id="coupon-code-val" />
      <button type="button" class="btn btn--primary" id="btn-copy-code">Copy Code</button>
    </div>

    <p class="coupon-modal__instruction">Paste this code at checkout at {{storeName}}.</p>
    <a href="{{affiliateUrl}}" target="_blank" rel="nofollow sponsored" class="btn btn--continue">
      Continue to Store →
    </a>
  </div>
</div>
`;

const SAFE_URL_SCHEMES = new Set(["http:", "https:"]);

/**
 * Handlebars HTML-escapes values but does not stop `javascript:`/`data:` URLs
 * from running when placed in an href. Allow only http(s) and relative URLs.
 */
export function sanitizeUrl(url: string | undefined): string {
  if (!url) return "#";
  // Browsers ignore ASCII whitespace/control chars when parsing a scheme.
  const compact = url.replace(/[\u0000-\u0020\u007f]/g, "");
  const scheme = compact.match(/^([a-z][a-z0-9+.-]*):/i);
  if (scheme && !SAFE_URL_SCHEMES.has(scheme[1].toLowerCase() + ":")) return "#";
  return url.trim();
}

function withSafeUrls(coupon: CouponItem): CouponItem {
  return { ...coupon, affiliateUrl: sanitizeUrl(coupon.affiliateUrl) };
}

export function renderCouponCard(coupon: CouponItem): string {
  const template = Handlebars.compile(couponCardTemplate);
  return template(withSafeUrls(coupon));
}

export function renderCouponModal(coupon: CouponItem): string {
  const template = Handlebars.compile(couponModalTemplate);
  return template(withSafeUrls(coupon));
}
