import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';

export class HomePage extends LitElement {
  @property({ type: Boolean }) english!: boolean;

  @property({ type: Boolean }) loaded = false;

  initImage() {
    this.loaded = false;
    this.loaded = true;
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: row;
      width: 100%;
      height: 100%;
      margin: 0 auto;
      color: #321e00;
      align-content: center;
      align-items: center;
    }

    h1,
    h2,
    p {
      display: flex;
      margin: 0;
      padding: 0;
      line-height: 150%;
      margin-top: 0.3em;
      text-align: left;
    }
    h1 {
      font-weight: 900;
    }

    h2 {
      font-size: calc(18px + 1vmin);
      margin-bottom: 0.3em;
    }
    p {
      justify-content: flex-start;
      font-size: calc(16px + 0.5vmin);
      font-weight: 500;
    }

    #topcontainer,
    #bottomcontainer,
    #imgcontainer,
    #bottomtext,
    #toptext {
      display: flex;
      flex-direction: column;
      width: 100%;
    }

    #topcontainer {
      max-width: 960px;
      align-items: flex-start;
      justify-content: flex-start;
      align-content: flex-start;
      flex: 0.5 1 auto;
    }
    #toptext {
      justify-content: flex-start;
      align-items: flex-start;
    }

    #bottomcontainer {
      flex-direction: column;
      justify-content: space-between;
      justify-self: flex-end;
      align-self: flex-end;
      align-items: center;
      max-width: calc(100% - ((100% - 960px) / 2));
      flex: 1;
    }
    .bottomtext {
      max-width: 960px;
      flex: 1;
    }
    #bottomtext p {
      text-align: left;
    }

    #imgcontainer {
      position: relative;
      justify-self: center;
      height: 96vw;
      width: 96vw;
      max-height: 960px;
      max-width: 960px;
    }

    img {
      height: 100%;
      width: 100%;
      opacity: 1;
    }

    @supports not (-moz-appearance: none) {
      @keyframes fade-in {
        0% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }

      .fadein {
        animation: fade-in 0.5s;
      }
    }
    @supports (-moz-appearance: none) {
      img {
        height: 100%;
        width: 100%;
        transition: opacity 0.5s;
      }

      .fadein {
        opacity: 0;
      }
    }

    @media screen and (max-width: 1080px) {
      h1,
      h2,
      p {
        margin-left: 1rem;
        margin-right: 1rem;
      }
    }
  `;

  render() {
    return html`
    <slot>
      <div id="topcontainer">
        <div id="toptext">
        <h1>${this.english ? 'Eric Peek' : 'エリック・ピーク'}</h1>
        <h2>${
          this.english
            ? 'Pursuing a career in creation.'
            : '創造のキャリアを追求する。'
        }</h2></div>        <div class="bottomtext">
        <p>${
          this.english
            ? 'I am driven to solve problems. With this in mind, changing the course of my career is in the best interest of both myself and my employer. Software is both ubiquitous and hungry for ingenuity. Working in software will allow me to reach my full potential.'
            : '私は問題を解決するために駆り立てられています。これを念頭に置いて、私のキャリアの進路を変えることは、私自身と私の雇用主の両方にとって最善の利益になります。ソフトウェアはユビキタスであり、創意工夫に飢えています。ソフトウェアで働くことで、自分の可能性を最大限に引き出すことができます。'
        }
        </p>
</div>
  </div>
      <div id="bottomcontainer">
        <div class="bottomtext">

  </div>
          <div id="imgcontainer">
            <img
            class=${this.loaded ? '' : 'fadein'}
              src="images/4k-headshot.jpg"
              srcset="
                images/HD-headshot.jpg   720w,
                images/FHD-headshot.jpg 1080w,
                images/QHD-headshot.jpg 1440w,
                images/4k-headshot.jpg  2160w"
              sizes="96vw"
              alt="A well-executed headshot."
              @loadend=${() => {
                this.initImage();
              }}
            />
          </div>
        </div>
      </div>
      </slot>
    `;
  }
}

customElements.define('home-page', HomePage);
