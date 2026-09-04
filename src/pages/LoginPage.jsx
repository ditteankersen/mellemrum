import { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/"; 

  function handleSubmit(event) {
    event.preventDefault();

    setError("");

    const success = login(email, password);

    if (!success) {
      setError("Forkert e-mail eller adgangskode.");
      return;
    }

    navigate(from, { replace: true });
  }

  return (
    <main className="login-page">
      <section className="login-container">
        <p className="eyebrow dark">Administration</p>

        <h1>Log ind</h1>

        <p>Log ind for at se og administrere tilmeldinger.</p>

        <form onSubmit={handleSubmit}>
          <label>
            <span>E-mail</span>

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@mellemrum.dk"
              required
            />
          </label>

          <label>
            <span>Adgangskode</span>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Adgangskode"
              required
            />
          </label>

          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}

          <button type="submit">Log ind</button>
        </form>

        <p className="prototype-login-info">
          Prototype-login:
          <br />
          admin@mellemrum.dk
          <br />
          Adgangskode: mellemrum
        </p>
      </section>
    </main>
  );
}
