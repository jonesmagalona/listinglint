import ListingChecker from "@/components/ListingChecker";

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-amber-700">ListingLint</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">Check a used-equipment listing before it goes live</h1>
        <p className="mt-3 max-w-3xl text-stone-600">
          Paste the seller&apos;s text as it arrived: email, chat message or form notes, in English or mixed with Tagalog or
          Cebuano. AI pulls out the make, model, year, hours, price and location. Then fixed, tested rules check for missing
          fields, implausible numbers and duplicates, and draft the questions to send back to the seller.
        </p>
      </header>
      <ListingChecker />
      <footer className="mt-12 border-t border-stone-200 pt-4 text-xs text-stone-500">
        Demo project for a graduate course. All reference data (makes, price bands, existing listings) is made up. AI
        extraction can be wrong: a person should review before publishing.
      </footer>
    </main>
  );
}
