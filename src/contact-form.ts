import { css, html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { encrypt, createMessage, readKey } from 'openpgp/lightweight';

export class ContactForm extends LitElement {
  @property({ type: String }) lang = '';

  @property({ type: Boolean }) english!: boolean;

  @property({ type: Boolean }) tipOpen = false;

  @property({ type: Object }) entooltip = html`
    <a href="https://en.wikipedia.org/wiki/Pretty_Good_Privacy" target="_blank">PGP</a></span>&nbsp;Encryption`;

  @property({ type: Object })
  jptooltip = html`<a href="https://ja.wikipedia.org/wiki/Pretty_Good_Privacy" target="_blank">&#65328;&#65319;&#65328;</a>で暗号化</span>`;

  firstUpdated() {
    const sRoot = this.shadowRoot;
    if (sRoot != null) {
      const messageRoot = sRoot.getElementById('messageInput');
      if (messageRoot != null) messageRoot.focus({ preventScroll: true });
    }
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
    const encrypted = await encrypt({
      message: await createMessage({ text: messageInput }),
      encryptionKeys: await readKey({ armoredKey: publicKeyArmored }),
    });
    return encrypted;
  }

  async sendMessage() {
    await this.encryptor().then(encrypted => {
      (this.pgp as HTMLInputElement).value = encrypted;
      //  ((this.pgp as HTMLInputElement).value as WebStream<string>) = encrypted;
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
      line-height: 150%;
      align-items: center;
      margin: 0 auto;
    }

    h2::selection {
      color: #fffde8;
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
      line-height: 150%;
      text-align: left;
      justify-self: flex-start;
    }
    #col {
      display: flex;
      text-align: center;
      margin: 0 auto;
      justify-content: flex-start;
      width: 90%;
      height: 100%;
      text-align: center;
      flex-direction: column;
      max-width: 800px;
      flex-grow: 1;
    }
    textarea {
      display: flex;
      box-sizing: border-box;
      resize: none;
      overflow: auto;
      width: 100%;
      height: 100%;
      border: solid #321e00 0.3em;
      border-radius: 1em 1em 0 1em;
      padding: 1em;
      font-family: inherit;
      color: #321e00;
      background: rgba(255, 253, 232, 0.8);
      font-size: 21px;
      flex: 1 1 30vh;
    }

    #buttonfoot {
      display: inline-flex;
      justify-content: space-between;
      width: 100%;
      position: relative;
      top: -1px;
      justify-content: flex-end;
    }

    #send {
      display: flex;
      background-color: var(--demobar);
      height: 1.7em;
      align-self: right;
      background-color: rgba(255, 253, 232, 0.8);
      color: #321e00;
      border-radius: 0 0 1rem 1rem;
      border: solid 0.3em#321e00;
      border-top: none;
      width: max-content;
      min-width: max-content;
      justify-self: flex-end;
      align-items: center;
      align-self: flex-end;
      position: relative;
      font-weight: 600;
      font-size: 21px;
      cursor: pointer;
    }
    #space {
      display: flex;
      flex: 1 1 30vh;
    }
    #tips {
      display: flex;
      flex-direction: column;
      font-size: 18px;
      cursor: default;
      height: 1.7rem;
      width: 100%;
      justify-self: center;
      align-self: center;
      justify-content: flex-start;
      align-content: flex-start;
      align-items: flex-start;
    }
    #tipcircle {
      display: flex;
      justify-content: center;
      align-items: center;
      align-content: center;
      text-align: center;
      box-sizing: border-box;
      border: solid 0.25em;
      border-radius: 2.5em;
      width: 2.5em;
      height: 2.5em;
      font-size: max(16px, 0.6em);
      background-color: red;
      background-color: #00000000;
      min-height: 2.5em;
      min-width: 2.5em;
      line-height: 2.5em;
      margin: 0 auto;
      overflow: hidden;
    }
    .tooltip {
      display: flex;
      flex-direction: row;
      justify-self: flex-start;
      justify-content: flex-start;
      align-content: flex-start;
      align-items: flex-start;
      align-self: flex-start;
      line-height: 150%;
      background-color: transparent;
      border: none;
      cursor: pointer;
      font-family: inherit;
      font-weight: 700;
      font-size: max(16px, 1em);
    }

    .infodot {
      display: flex;
      text-decoration: none;
      justify-self: flex-start;
    }

    a {
      color: #ef8127;
    }
    .tooltip a {
      color: #321e00;
    }

    .tooltiptext {
      display: flex;
      height: min-content;
      width: 100%;
      background-color: #321e00;
      color: #fffde8;
      text-align: left;
      padding: 0.5em;
      border-radius: 1em;
      padding-left: 1em;
      padding-right: 1em;
      margin-top: 0.5em;
      font-size: 18px;
      line-height: 150%;
    }

    .closed {
      display: none;
    }
    @media screen and (max-width: 960px) {
      textarea,
      #buttonfoot,
      #tips,
      #space {
        width: 90%;
      }
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

        <h2>${this.english ? 'Send a message.' : 'メッセージを送って。'}</h2>
        <form
          id="contact"
          name="contact"
          method="POST"
          netlify-honeypot="email"
          netlify
          action="/success"
        >
          <input type="hidden" name="form-name" value="contact" />
          <label class="bearnecessities"><input name="email" /></label>
          <input name="visitorMessage" id="pgp" type="hidden" />
        </form>
        <textarea
          name="message"
          id="messageInput"
          placeholder=${
            this.english
              ? "Is there anything you'd like to tell me?"
              : '伝えたいことはありますか？'
          }
          type="text"
        ></textarea>
        <div id="buttonfoot">
<div id="tips">
            <button class="tooltip" @click=${() => {
              this.tipOpen = !this.tipOpen;
            }}
              ><span class="infodot">★</span>${
                this.english ? this.entooltip : this.jptooltip
              }${this.tipOpen ? '▼' : '►'}</span
            ></button>
          </div>
     <button id='send' @click=${this.sendMessage}>
            ${this.english ? 'send' : '送る'}
          </button>
        </div>           <div id="space"><span class=${
          this.tipOpen ? 'tooltiptext' : 'closed'
        }
      >${
        this.english
          ? "Messages are encrypted client-side with PGP using my public key. The message is sent directly to my email inbox where I simply decrypt it with my private key. This method is likely more secure than your email client! As long as you trust me. And fortunately, there's no added hassle. The form submits as easily as any other on the internet."
          : 'メッセージは、公開鍵を使用してPGPでクライアント側で暗号化されます。メッセージは直接私の電子メールの受信トレイに送信され、そこで秘密鍵で単純に復号化します。この方法は、おそらく電子メールクライアントよりも安全です。あなたが私を信頼する限り。幸い、追加の手間はありません。このフォームは、インターネット上で他のフォームと同じように簡単に送信できます。'
      }</span
    >           
        </div>

    `;
  }
}

customElements.define('contact-form', ContactForm);
