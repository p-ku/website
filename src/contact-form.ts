import { css, html, LitElement, property } from 'lit-element';
import * as openpgp from 'openpgp';

class ContactForm extends LitElement {
  @property({ type: String }) lang = '';
  @property({ type: Boolean }) english = true;

  firstUpdated() {
    if (location.pathname.includes('jp')) {
      this.english = false;
      this.lang = '/jp';
    } else {
      this.english = true;
      this.lang = '';
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
    const { data: encrypted } = await openpgp.encrypt({
      message: openpgp.message.fromText(messageInput),
      publicKeys: (await openpgp.key.readArmored(publicKeyArmored)).keys,
      privateKeys: [],
    });

    return encrypted;
  }

  /*   setMessage() {
    this.finalMessage = 'boo';
  } */

  /*   encryptorWrap() {
    this.finalMessage = 
  } */

  async sendMessage() {
    await this.encryptor().then(encrypted => {
      (this.messageInput as HTMLInputElement).value = encrypted;
    });
    await (this.contact as HTMLFormElement).submit();
  }

  static styles = css`
    :host {
      color: #321e00;
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

    @keyframes app-logo-spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `;

  /*   set finalMessage(val) {
    let oldVal = this.finalMessage;
    (this.finalMessage as HTMLInputElement).value = val;
    this.requestUpdate('finalMessage', oldVal);
  } */

  get messageInput() {
    return this.shadowRoot?.getElementById('messageInput');
  }

  get contact() {
    return this.shadowRoot?.getElementById('contact');
  }

  /*   get finalMessage() {
    return this.shadowRoot?.getElementById('finalMessage');
  } */

  render() {
    return html`<form
        id="contact"
        name="contact"
        method="POST"
        netlify-honeypot="email"
        data-netlify="true"
        netlify
      >
        <input type="hidden" name="form-name" value="contact" />
        <label class="bearnecessities"><input name="email" /></label>
        <textarea name="message" id="messageInput" type="text"></textarea>
      </form>
      <button @click=${this.sendMessage}>
        ${this.english ? 'Send' : '送る'}
      </button> `;
  }
}

customElements.define('contact-form', ContactForm);
