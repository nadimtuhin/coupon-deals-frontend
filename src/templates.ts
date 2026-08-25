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
      <button class="btn btn--copy" data-code="{{code}}" data-affiliate="{{affiliateUrl}}">
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
    <button class="coupon-modal__close" data-close-modal aria-label="Close modal">✕</button>
    <div class="coupon-modal__store">{{storeName}}</div>
    <h2 id="modal-title" class="coupon-modal__title">{{title}}</h2>
    
    <div class="coupon-modal__code-box">
      <input type="text" readonly value="{{code}}" class="coupon-modal__input" id="coupon-code-val" />
      <button class="btn btn--primary" id="btn-copy-code">Copy Code</button>
    </div>

    <p class="coupon-modal__instruction">Paste this code at checkout at {{storeName}}.</p>
    <a href="{{affiliateUrl}}" target="_blank" rel="nofollow sponsored" class="btn btn--continue">
      Continue to Store →
    </a>
  </div>
</div>
`;

export function renderCouponCard(coupon: CouponItem): string {
  const template = Handlebars.compile(couponCardTemplate);
  return template(coupon);
}

export function renderCouponModal(coupon: CouponItem): string {
  const template = Handlebars.compile(couponModalTemplate);
  return template(coupon);
}
