import { useState } from "react";
import "./ContactPage.css"; 

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitStatus, setSubmitStatus] = useState(null);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    setSubmitStatus("success");

    setFormData({
      name: "",
      email: "",
      message: "",
    });
  }

  return (
    <main className="contact-page">
      <header className="contact-hero">
        <p className="eyebrow dark">Kontakt</p>

        <h1>
          Lad os tage
          <br />
          en snak.
        </h1>

        <p className="contact-intro">
          Har du spørgsmål til et event, en tilmelding eller Mellemrum? Så hører
          vi gerne fra dig.
        </p>
      </header>

      <section className="contact-section">
        <div className="contact-info">
          <p className="eyebrow dark">Kontakt os</p>

          <h2>Vi er her for at hjælpe.</h2>

          <p>
            Skriv til os, hvis du har spørgsmål eller brug for hjælp. Vi vender
            tilbage hurtigst muligt.
          </p>

          <div className="contact-details">
            <div className="contact-detail">
              <span className="contact-label">E-mail</span>

              <a href="mailto:kontakt@mellemrum.dk">kontakt@mellemrum.dk</a>
            </div>

            <div className="contact-detail">
              <span className="contact-label">Svartid</span>

              <p>Vi svarer typisk inden for 2-5 hverdage.</p>
            </div>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <label>
            <span>Navn</span>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Dit navn"
              required
            />
          </label>

          <label>
            <span>E-mail</span>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="dig@example.com"
              required
            />
          </label>

          <label>
            <span>Besked</span>

            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Hvad kan vi hjælpe dig med?"
              rows="6"
              required
            />
          </label>

          <button type="submit">Send besked →</button>

          {submitStatus === "success" && (
            <p className="success-message" role="status">
              Tak for din besked! Vi vender tilbage hurtigst muligt.
            </p>
          )}
        </form>
      </section>
    </main>
  );
}
