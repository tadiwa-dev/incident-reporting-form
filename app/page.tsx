import IncidentForm from "@/components/IncidentForm";

export default function Home() {
  return (
    <main className="min-h-screen py-10 px-4 sm:py-16">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="mb-10">
          <p className="text-xs uppercase tracking-widest text-stone-400 mb-4">
            For Youth, By Youth Movement
          </p>
          <h1 className="font-[family-name:var(--font-serif)] text-3xl sm:text-4xl font-bold text-stone-900 leading-tight mb-4">
            Report a Concern
          </h1>
          <p className="text-stone-500 leading-relaxed max-w-lg">
            Use this form to raise a safeguarding concern. You may remain
            anonymous. All submissions are reviewed confidentially by designated
            safeguarding leads.
          </p>
        </header>

        {/* Privacy callout */}
        <div className="border-l-2 border-stone-300 pl-4 mb-10">
          <p className="text-sm text-stone-500 leading-relaxed">
            <span className="font-semibold text-stone-700">Your privacy is protected.</span>{" "}
            No data is stored after submission. Retaliation against anyone who
            raises a concern in good faith is not tolerated.
          </p>
        </div>

        {/* Form */}
        <IncidentForm />

        {/* Footer */}
        <footer className="mt-16 pt-6 border-t border-stone-200">
          <p className="text-xs text-stone-400">
            © {new Date().getFullYear()} For Youth, By Youth Movement
          </p>
        </footer>
      </div>
    </main>
  );
}
