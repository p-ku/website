import { LitElement, html, css, property } from 'lit-element';

export const bigCircle = html`
  <style>
    /* .navcircle {
      --b: 20vmin;
      --bcsq: calc(var(--b) / 4);
      --k: calc(10000vmin + var(--bcsq) - var(--b));
      --r: calc(var(--k) + var(--b));
      --d: calc(2 * var(--r));
      height: var(--d);
      width: var(--d);
      background-size: contain;
      animation: app-logo-spin infinite 20s linear;
      position: absolute;
      top: calc(0vmin - var(--r) - var(--k));
} */

    /* circle {
  --b: 1vmin;
      --bcsq: calc(var(--b) / 1);
      --k: calc(10000vmin + var(--bcsq) - var(--b));
      --r: calc(var(--k) + var(--b));
      --d: calc(2 * var(--r));
     --x: 50%;
     --rt: 1490vmin;
} */

    /* .navcircle {
      --b: 20vmin;
      --bcsq: calc(var(--b) / 4);
      --k: calc(10000vmin + var(--bcsq) - var(--b));
      --r: calc(var(--k) + var(--b));
      --d: calc(2 * var(--r));

      height: var(--d);
      width: var(--d);
      background: linear-gradient(to right, red, yellow);
      border-radius: 50%;
      box-shadow: 0px 0px 5px 1px var(--black);
      animation: app-logo-spin infinite 20s linear;
      position: absolute;
      top: calc(0vmin - var(--r) - var(--k));
      box-sizing: border-box;
    } */

    /* 
    .logo > svg {
      margin-top: 36px;
      animation: app-logo-spin infinite 20s linear;
    }
 */

    svg {
      --b: 10vmin;
      --bcsq: calc(var(--b) / 1);
      --k: calc(10000vmin + var(--bcsq) - var(--b));
      --r: calc(var(--k) + var(--b));
      --d: calc(2 * var(--r));
      --f: calc(var(--d) / 1vmin);

      /*   --f: 1490px; */
    }
  </style>
  <svg width="var(--d)" height="var(--d)" viewBox="0 0 100 100">
    <!--  
      stroke="url(#linearGradient-1)
    style="fill:url(#linearGradient-1)"" 
            stroke-width="0"
            -->
    <defs>
      <linearGradient x1="0%" y1="0%" x2="100%" y2="100%" id="linearGradient-1">
        <stop stop-color="#9B00FF" offset="0%"></stop>
        <stop stop-color="#0077FF" offset="100%"></stop>
      </linearGradient>
    </defs>
    <circle cx="50%" cy="50%" r="50%" style="fill:url(#linearGradient-1)" />
  </svg>
`;
