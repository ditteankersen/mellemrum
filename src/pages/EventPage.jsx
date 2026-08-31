import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { SUPABASE_URL, headers } from "../services/supabase";

export default function EventPage() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    async function getEvent() {
      const response = await fetch(`${SUPABASE_URL}/events?id=eq.${eventId}`, {
        headers,
      });
      const data = await response.json();
      setEvent(data[0]);
    }

    getEvent();
  }, [eventId]);

  async function handleSubmit(eventSubmit) {
    eventSubmit.preventDefault();
    console.log({ name, email, event: event.title });

    if (submitting) return;

    setSubmitting(true);
    setSubmitStatus(null);
    setSubmitError(null);

    try {
      const response = await fetch(`${SUPABASE_URL}/registrations`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          name,
          email,
          eventTitle: event.title,
          eventDate: event.date,
          status: "Tilmeldt",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        console.error("Supabase-fejl:", errorData);
        throw new Error(errorData.message || "Fejl ved tilmelding");
      }

      setSubmitStatus("success");
      setName("");
      setEmail("");
    } catch (error) {
      console.error("Tilmeldingsfejl:", error);
      setSubmitError("Der opstod en fejl ved tilmelding. Prøv igen senere.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!event) {
    return null;
  }

  const date = new Date(event.date);

  return (
    <>
      <main className="event-page">
        <Link className="back-link" to="/">
          ← Alle events
        </Link>

        <section className="event-detail">
          <img src={event.image} alt="" />
          <div className="event-detail-content">
            <p className="event-category">{event.category}</p>
            <h1>{event.title}</h1>
            <p className="lead">{event.summary}</p>
            <div className="detail-list">
              <p>
                <strong>Dato</strong>
                {date.toLocaleDateString("da-DK", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}{" "}
                kl.{" "}
                {date.toLocaleTimeString("da-DK", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p>
                <strong>Sted</strong>
                <span>
                  {event.venueName}
                  <br />
                  {event.venueAddress}, {event.venuePostalCode}{" "}
                  {event.venueCity}
                  {event.venueWebsite && (
                    <>
                      <br />
                      <a href={event.venueWebsite}>Besøg venue</a>
                    </>
                  )}
                </span>
              </p>
              <p>
                <strong>Pris</strong>
                {event.price === 0 ? "Gratis" : `${event.price} kr.`}
              </p>
            </div>
            <p>{event.description}</p>
          </div>
        </section>

        <section className="signup-panel">
          <div>
            <p className="eyebrow dark">Tilmelding</p>
            <h2>Reserver din plads</h2>
            <p>
              Udfyld formularen, så sender vi din tilmelding til arrangøren.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <label>
              Navn
              <input
                value={name}
                onChange={(inputEvent) => setName(inputEvent.target.value)}
              />
            </label>
            <span>E-mail</span>
            <input
              value={email}
              onChange={(inputEvent) => setEmail(inputEvent.target.value)}
              placeholder="dig@example.com"
            />

            <button type="submit" disabled={submitting}>
              {submitting ? "Tilmelder..." : "Tilmeld mig"}
            </button>
            {submitStatus === "success" && (
              <p className="success-message">Du er nu tilmeldt {event.title}</p>
            )}

            {submitError && <p className="error-message">{submitError}</p>}
          </form>
        </section>
      </main>
   
    </>
  );
}
