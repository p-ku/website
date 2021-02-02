import { LitElement, html, css, property } from 'lit-element';

class MainPage extends LitElement {
  @property({ type: String }) lang = '';
  @property({ type: Boolean }) english = true;
  @property({ attribute: false }) enintro = html` <p>
      Six years into my first attempt at a career, I've realized three
      things:<br /><br />1. I'm not making things.<br />2. I want to make
      things.<br />3. Software engineers make things.
    </p>
    <p>hello</p>`;
  @property({ attribute: false }) jpintro = html` <p>
    Six years into my first attempt at a career, I've realized two things:<br />
    1. I'm not making things. 2.<br />
    I want to make things "
  </p>`;

  firstUpdated() {
    if (location.pathname.includes('jp')) {
      this.english = false;
      this.lang = '/jp';
    } else {
      this.english = true;
      this.lang = '';
    }
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
      /*       max-height: calc(100vh - max(64px, 2.5rem));
 */ /*       animation: fade-in-animation 0.5s ease-out;
 */
      /*       background: url(headshot.jpg) no-repeat center bottom fixed;
      -webkit-background-size: 100vmin;
      -moz-background-size: 100vmin;
      -o-background-size: 100vmin;
      background-size: 100vmin; */
    }
    /* 
    #subhost {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 100%;
      max-width: 960px;
      min-height: calc(100vh - 2.5rem);
      color: #321e00;
      margin: 0 auto;
    } */
    @keyframes fade-in-animation {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
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
    /*     #toptext {
      align-self: flex-start;
    } */
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
    }
    /*     #in {
      position: absolute;
      top: 8px;
      left: 16px;
    } */

    @media screen and (max-width: 1080px) {
      h1,
      h2,
      p {
        margin-left: 1rem;
        margin-right: 1rem;
      }
    }
    @media screen and (orientation: portrait) {
    }
  `;

  render() {
    return html`
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
            ? 'I am driven to create. Despite this, my current career path involves little creativity. Now is the time to change course. Enable my transformation and witness my full potential.'
            : '私は創作に駆り立てられます。それにもかかわらず、私の現在のキャリアパスには、ほとんど創造性が含まれていません。今が進路を変える時です。私の変革を可能にし、私の潜在能力を最大限に発揮してください。'
        }
        </p>
        <p>
${
  this.english
    ? 'Software is both ubiquitous and hungry for ingenuity. With that in mind, the solution has become painfully obvious; I must work in software.'
    : 'ソフトウェアはユビキタスであり、創意工夫に飢えています。それを念頭に置いて、解決策は痛々しいほど明白になった。ソフトウェアで作業する必要があります。'
}
        </p>
</div>
  </div>
      <div id="bottomcontainer">
        <div class="bottomtext">

  </div>
          <div id="imgcontainer">
            <img
              src="headshot-4k.jpg"
              srcset="
                headshot-HD.jpg   720w,
                headshot-FHD.jpg 1080w,
                headshot-QHD.jpg 1440w,
                headshot-4k.jpg  2160w,
                headshot-4k.jpg
              "
              sizes="96vw"
            />
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('home-page', MainPage);
