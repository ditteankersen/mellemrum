import { useEffect, useState } from "react";
import { Link } from "react-router";
import { SUPABASE_URL, headers } from "../services/supabase";
import "./HomePage.css"; 



export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Alle");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  async function getEvents() {
    try {
      setIsLoading(true);
      setError(null);


      const response = await fetch(`${SUPABASE_URL}/events?order=date.asc`, {
        headers,
      });

      if (!response.ok) {
        throw new Error("Kunne ikke hente events");
      }

      const data = await response.json();

      setEvents(data);
    } catch (error) {
      console.error("Fejl ved hentning af events:", error);
      setError("Events kunne ikke indlæses. Prøv igen senere.");
    } finally {
      setIsLoading(false);
    }}
  getEvents();
}, []); 

  const categories = ["Alle", ...new Set(events.map((event) => event.category))];

  const filteredEvents = events.filter((event) => {
    const searchText = `${event.title} ${event.summary} ${event.venueName}`.toLowerCase();
    const matchesSearch = searchText.includes(search.toLowerCase());
    const matchesCategory = category === "Alle" || event.category === category;

    return matchesSearch && matchesCategory;
  });

  function formatEventDate(eventDate) {
    const date = new Date(eventDate);
    const formattedDate = date.toLocaleDateString("da-DK", {
      weekday: "long",
      day: "numeric",
      month: "long"
    });

    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }

  function getOptimizedImage(imageUrl, width) {
    const url = new URL(imageUrl);

    url.searchParams.set("w", width);
    url.searchParams.set("q", "75");
    url.searchParams.set("auto", "format");

    return url.toString();
  }

  return (
    <>
      <header className="hero">
        <p className="eyebrow">Kultur i Aarhus</p>
        <h1>Find plads til noget nyt.</h1>
        <p className="hero-copy">
          Koncerter, talks og workshops samlet ét sted. Find dit næste event, og
          tilmeld dig på få minutter.
        </p>
        <a className="hero-link" href="#events">
          Se kommende events ↓
        </a>
      </header>

      <main id="events">
        <section className="section-heading">
          <div>
            <p className="eyebrow dark">Det sker</p>
            <h2>Kommende events</h2>
          </div>
          <p>Kuraterede oplevelser i byen – fra små scener til store idéer.</p>
        </section>

        <section className="filters">
          <label>
            Søg
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Søg efter titel eller sted"
            />
          </label>
          <label>
            Kategori
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </section>
        <section className="event-grid">
          {isLoading && <p>Indlæser events...</p>}

          {error && <p role="alert">{error}</p>}

          {!isLoading && !error && filteredEvents.length === 0 && (
            <p className="no-results">
              Vi kunne ikke finde nogen events, der matcher din søgning.
            </p>
          )}

          {!isLoading &&
            !error &&
            filteredEvents.length > 0 &&
            filteredEvents.map((event) => (
              <article className="event-card" key={event.id}>
                <img
                  src={getOptimizedImage(event.image, 800)}
                  alt=""
                  loading="lazy"
                />

                <div className="event-card-content">
                  <p className="event-category">{event.category}</p>

                  <h3>{event.title}</h3>

                  <p>{event.summary}</p>

                  <div className="event-meta">
                  <span>{formatEventDate(event.date)}</span>
                  <span>{event.venueName}</span>
                 </div>

              <Link className="card-link" to={`/events/${event.id}`}>
                Læs mere
               </Link>
              </div>
             </article>
            ))}
        </section> 
      </main>
    </>
  );
}
