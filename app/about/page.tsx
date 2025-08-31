import about from "../../content/about.json";

export default function AboutPage() {
  return (
    <article className="prose">
      <h1>About Sound Vibe</h1>
      <p>{about.blurb}</p>
      <h2>Referrals</h2>
      <ul>
        {about.referrals.map((r, i) => (<li key={i}>{r}</li>))}
      </ul>
    </article>
  );
}
