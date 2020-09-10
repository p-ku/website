import { LitElement, html, css, property } from 'lit-element';

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
  static styles = css`
    :host {
      color: #321e00;
    }
    .logo > svg {
      margin-top: 72px;
      animation: app-logo-spin infinite 20s linear;
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

  render() {
    return html`<form
      name="contact"
      method="POST"
      netlify-honeypot="email"
      data-netlify="true"
    >
      <label class="ohnohoney" for="email"></label>
      <input
        class="ohnohoney"
        autocomplete="off"
        type="email"
        id="email"
        name="email"
        placeholder="Your e-mail here"
      />
      <p>
        <label>Message: <textarea name="message"></textarea></label>
      </p>
      <p>
        <button type="submit">Send</button>
      </p>
    </form> `;
  }
}

customElements.define('contact-form', ContactForm);
