export default function HomePage() {
  return (
    <section>
      <h1 className="bg-gray-600 text-primary">🏠 Home Page</h1>
      <a className="underline underline-offset-2" href="/api/auth/google">
        Login With Google
      </a>
    </section>
  );
}
