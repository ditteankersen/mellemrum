import { useEffect, useState } from "react";
import { Link } from "react-router";
import { SUPABASE_URL, headers } from "../services/supabase";
import "./RegistrationsPage.css"; 

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [registrationCount, setRegistrationCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  async function getRegistrations() {
    try {
      setIsLoading(true);
      setError(null);

   const response = await fetch(
     `${SUPABASE_URL}/registrations?select=*,events(title,date,venueName,venueAddress)&order=createdAt.desc`,
     { headers },
   );

      if (!response.ok) {
        throw new Error("Kunne ikke hente tilmeldinger");
      }

      const data = await response.json();

      setRegistrations(data);
      setRegistrationCount(data.length);
    } catch (error) {
      console.error("Fejl ved hentning af tilmeldinger:", error);
      setError("Tilmeldinger kunne ikke indlæses. Prøv igen senere.");
    } finally {
      setIsLoading(false);
    }}
  getRegistrations();
}, []);

  return (
    <>
      <header className="admin-header">
        <p className="eyebrow">Internt overblik</p>
        <h1>Tilmeldinger</h1>
        <p>{registrationCount} tilmeldinger i alt</p>
      </header>
      <main>
        {isLoading && <p>Indlæser tilmeldinger...</p>}

        {error && <p role="alert">{error}</p>}

        {!isLoading && !error && (
          <div className="registration-list">
            <div className="registration-row registration-labels">
              <span>Navn</span>
              <span>Event</span>
              <span>Dato</span>
              <span>Status</span>
            </div>

            {registrations.map((registration) => (
              <div className="registration-row" key={registration.id}>
                <div>
                  <strong>{registration.name}</strong>
                  <small>{registration.email}</small>
                </div>

                <span>{registration.events.title}</span>

                <span>
                  {new Date(registration.events.date).toLocaleDateString(
                    "da-DK",
                  )}
                </span>

                <span className="status">{registration.status}</span>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
