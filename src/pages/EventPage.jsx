import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router";
import { SUPABASE_URL, headers } from "../services/supabase";
import "./EventPage.css";

export default function EventPage() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [eventError, setEventError] = useState(null);
  const [eventNotFound, setEventNotFound] = useState(false);

useEffect(() => {
  async function getEvent() {
   try {
     setIsLoading(true);
     setEventError(null);
     setEventNotFound(false);
     setEvent(null);

     const response = await fetch(`${SUPABASE_URL}/events?id=eq.${eventId}`, {
       headers,
     });

     if (!response.ok) {
       throw new Error("Kunne ikke hente event");
     }

     const data = await response.json();

     if (!data[0]) {
       setEventNotFound(true);
       return;
     }

     setEvent(data[0]);
   } catch (error) {
     console.error("Fejl ved hentning af event:", error);
     setEventError("Eventet kunne ikke indlæses. Prøv igen senere.");
   } finally {
     setIsLoading(false);
   }}
  getEvent();
}, [eventId]);

async function handleSubmit(eventSubmit) {
  eventSubmit.preventDefault();

  setNameError("");
  setEmailError("");
  setSubmitStatus(null);
  setSubmitError(null);

  let hasError = false;

  if (!name.trim()) {
    setNameError("Indtast venligst dit navn.");
    hasError = true;
  }

  if (!email.trim()) {
    setEmailError("Indtast venligst din e-mail.");
    hasError = true;
  } else if (!email.includes("@")) {
    setEmailError("Indtast en gyldig e-mailadresse.");
    hasError = true;
  }

  if (hasError || submitting) {
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();

  setSubmitting(true);

  try {

    const existingRegistrationResponse = await fetch(
      `${SUPABASE_URL}/registrations?eventId=eq.${event.id}&email=eq.${encodeURIComponent(normalizedEmail)}`,
      {
        headers,
      },
    );

    if (!existingRegistrationResponse.ok) {
      throw new Error("Kunne ikke kontrollere eksisterende tilmeldinger");
    }

    const existingRegistrations = await existingRegistrationResponse.json();


    if (existingRegistrations.length > 0) {
      setEmailError("Denne e-mail er allerede tilmeldt dette event.");
      return;
    }

    const response = await fetch(`${SUPABASE_URL}/registrations`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: name.trim(),
        email: normalizedEmail,
        eventId: event.id,
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

if (isLoading) {
  return (
    <main className="event-page loading-page">
      <p>Indlæser event...</p>
    </main>
  );
}

if (eventNotFound) {
  return <Navigate to="/404" replace />;
}

if (eventError) {
  return (
    <main>
      <p role="alert">{eventError}</p>
    </main>
  );
}

if (!event) {
  return null;
} 

  const date = new Date(event.date);

  function getOptimizedImage(imageUrl, width) {
    const url = new URL(imageUrl);

    url.searchParams.set("w", width);
    url.searchParams.set("q", "80");
    url.searchParams.set("auto", "format");

    return url.toString();
  }

  return (
    <>
      <main className="event-page">
        <Link className="back-link" to="/">
          ← Alle events
        </Link>

        <section className="event-detail">
          <img
            className="event-detail-image"
            src={getOptimizedImage(event.image, 1400)}
            alt=""
            fetchPriority="high"
          />
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
              <span>Navn</span>

              <input
                type="text"
                value={name}
                onChange={(inputEvent) => {
                  setName(inputEvent.target.value);
                  setNameError("");
                }}
                placeholder="Navn"
              />

              {nameError && (
                <span className="field-error" role="alert">
                  {nameError}
                </span>
              )}
            </label>

            <label>
              <span>E-mail</span>

              <input
                type="email"
                value={email}
                onChange={(inputEvent) => {
                  setEmail(inputEvent.target.value);
                  setEmailError("");
                }}
                placeholder="dig@example.com"
              />

              {emailError && (
                <span className="field-error" role="alert">
                  {emailError}
                </span>
              )}
            </label> 

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
