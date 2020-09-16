import { css, html, LitElement, property } from 'lit-element';
import * as openpgp from 'openpgp';
import { render } from 'lit-html';

class ContactForm extends LitElement {
  @property({ type: String }) lang = '';
  @property({ type: Boolean }) english = true;
  @property({ attribute: false }) entooltip = html` Encrypted with
    <a href="https://en.wikipedia.org/wiki/Pretty_Good_Privacy" target="_blank"
      >PGP</a
    >
    <span class="tooltiptext"
      >Messages are encrypted client-side with PGP using my public key. The
      message is sent directly to my email inbox where I simply decrypt it with
      my private key. This method is likely more secure than your email client!
      As long as you trust me. And fortunately, there's no added hassle. The
      form submits as easily as any other on the internet.</span
    >`;
  @property()
  jptooltip = html`<a href="https://ja.wikipedia.org/wiki/Pretty_Good_Privacy" target="_blank"
      >PGP</a
    >で暗号化<span class="tooltiptext"
      >メッセージはPGPでクライアント側で暗号化されます。受信トレイに届いたメッセージは簡単に復号化できます。これはおそらくあなたの電子メールクライアントよりも安全です！あなたが私を信頼する限り。</span
    ></span
  >`;

  firstUpdated() {
    if (location.pathname.includes('jp')) {
      this.english = false;
      this.lang = '/jp';
    } else {
      this.english = true;
      this.lang = '';
    }
    this.shadowRoot.getElementById('messageInput').focus();
  }

  async encryptor() {
    const publicKeyArmored = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: OpenPGP.js v4.10.7
Comment: https://openpgpjs.org

xjMEXvY7phYJKwYBBAHaRw8BAQdAzZqwHwdTp3PPQ0IFFSSYA/rydTouTzoH
uFTZ7XFnUyHNI2NvbnRhY3RAcC1rdS5jb20gPGNvbnRhY3RAcC1rdS5jb20+
wngEEBYKACAFAl72O6YGCwkHCAMCBBUICgIEFgIBAAIZAQIbAwIeAQAKCRBO
WAFxhEUl0zlaAQD42uAEk0g9VXN6mbjNsgrK5R4U5W0iHQTRmJwH3Q39DwEA
h2Sewbss0afGSfkkYm0DyOYYZa7saxclBPRqyoET6AvOOARe9jumEgorBgEE
AZdVAQUBAQdAzxnhfAgrXToXzTlzwniiNIOt+Cjj3m5dFMbyrOY4Y24DAQgH
wmEEGBYIAAkFAl72O6YCGwwACgkQTlgBcYRFJdMHFwEAsUudUgoDkTFz7ECq
cf+2tN4iEA7jNSUsKcxbtxOcYEsA/2SzrAVdtDH5RuSVYVVIvyHFALPybmVV
TComQBkFSpoM
=35BW
-----END PGP PUBLIC KEY BLOCK-----
`;
    const messageInput = (this.messageInput as HTMLInputElement).value;
    const { data: encrypted } = await openpgp.encrypt({
      message: openpgp.message.fromText(messageInput),
      publicKeys: (await openpgp.key.readArmored(publicKeyArmored)).keys,
      privateKeys: [],
    });

    return encrypted;
  }

  async sendMessage() {
    await this.encryptor().then(encrypted => {
      (this.pgp as HTMLInputElement).value = encrypted;
    });
    await (this.contact as HTMLFormElement).submit();
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      max-width: 960px;
      height: 100%;
      color: #321e00;
      flex-grow: 1;
    }

    h2::selection {
      color: var(--white);
      background-color: #ef8127;
    }
    a::selection,
    span::selection {
      background: transparent;
    }

    .bearnecessities {
      opacity: 0;
      position: absolute;
      top: 0;
      left: 0;
      height: 0;
      width: 0;
      z-index: -1;
    }

    h2 {
      line-height: 1em;
      text-align: left;
      margin-left: var(--navbar-height);
      justify-self: flex-start;
    }
    #col {
      display: flex;
      text-align: center;
      margin: 0 auto;
      justify-content: center;
      width: 90%;
      height: 100%;
      text-align: center;
      flex-direction: column;
      max-width: 800px;
      flex-grow: 1;
    }
    textarea {
      resize: none;
      overflow: auto;
      height: 55vh;
      width: calc(100% - (var(--navbar-height) / 2));
      border: solid #321e005e 3px;

      border-radius: calc(var(--navbar-height) / 4)
        calc(var(--navbar-height) / 4) 0 calc(var(--navbar-height) / 4);
      padding: calc(var(--navbar-height) / 4);
      font-family: inherit;
      color: var(--navbar);
      background: rgba(255, 253, 232, 0.8);
      flex-grow: 1;
      font-size: inherit;
      /*       box-shadow: 0px 0px 5px 1px inset;
 */
    }

    textarea:active {
      /*       box-shadow: 0px 0px 5px 1px #00b2b0 inset;
 */
      border: outset #00b2af76;
    }
    #buttonfoot {
      display: inline-flex;
      justify-content: space-between;
      width: 100%;
      position: relative;
      top: -1px;
      right: -6px;
    }

    button {
      background-color: var(--demobar);
      height: calc(var(--demobar-height) + 3px);
      min-width: calc(var(--demobar-height) * 2.5);
      align-self: right;
      background-color: #00000000;
      color: #00b2b0;
      border-radius: 0 0 calc(var(--navbar-height) / 4)
        calc(var(--navbar-height) / 4);
      border: solid 3px #00b2b0;
      border-top: none;
      width: 15%;
      min-width: max-content;
      justify-content: right;
      align-items: right;
      position: relative;
      font-weight: 600;
      font-size: calc(var(--demobar-height) / 1.5);
      cursor: pointer;
    }

    .tooltip {
      text-decoration: underline dotted;
    }
    #tips {
      font-size: var(--footer-font-size);
      cursor: default;
    }
    .infodot {
      text-decoration: none;
    }

    a {
      color: #ef8127;
    }
    .tooltip a {
      color: var(--navbar);
    }

    .tooltiptext {
      visibility: hidden;
      width: clamp(240px, 30vw, 320px);
      background-color: var(--navbar);
      color: var(--white);
      text-align: center;
      padding: 5px;
      border-radius: 6px 6px 6px 0;
      position: absolute;
      z-index: 1;
      bottom: calc(2 * var(--footer-font-size) + 5px);
      left: calc(var(--footer-font-size) / 2);
    }
    #tips:hover .tooltiptext {
      visibility: visible;
    }

    .tooltip .tooltiptext::after {
      content: ' ';
      position: absolute;
      top: 100%; /* At the bottom of the tooltip */
      left: 5px;
      margin-left: -5px;
      border-width: 5px;
      border-style: solid;
      border-color: var(--navbar) transparent transparent var(--navbar);
    }
  `;

  get messageInput() {
    return this.shadowRoot?.getElementById('messageInput');
  }
  get pgp() {
    return this.shadowRoot?.getElementById('pgp');
  }
  get contact() {
    return this.shadowRoot?.getElementById('contact');
  }

  render() {
    return html`
      <div id="col">
        <h2>${this.english ? 'Send a message.' : 'メッセージを送って。'}</h2>
        <form
          id="contact"
          name="contact"
          method="POST"
          netlify-honeypot="email"
          netlify
        >
          <input type="hidden" name="form-name" value="contact" />
          <label class="bearnecessities"><input name="email" /></label>
          <input name="visitorMessage" id="pgp" type="hidden" />
        </form>
        <textarea
          name="message"
          id="messageInput"
          placeholder=${this.english
            ? "Is there anything you'd like to tell me?"
            : '伝えたいことはありますか？'}
          type="text"
        ></textarea>
        <div id="buttonfoot">
          <div id="tips">
            <span class="infodot">🛈 </span>
            <span class="tooltip">
              ${this.english ? this.entooltip : this.jptooltip}</span
            >
          </div>
          <button @click=${this.sendMessage}>
            ${this.english ? 'send' : '送る'}
          </button>
        </div>
      </div>
    `;
  }
}

customElements.define('contact-form', ContactForm);
