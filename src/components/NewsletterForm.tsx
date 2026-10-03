"use client";

export default function NewsletterForm() {
  return (
    <form
      className="flex items-center gap-2 w-full sm:w-auto"
      onSubmit={(e) => {
        e.preventDefault();
        // TODO: wire up real newsletter API
        const input = e.currentTarget.querySelector("input") as HTMLInputElement;
        if (input) input.value = "";
        alert("Thanks for subscribing!");
      }}
      aria-label="Newsletter subscription"
    >
      <input
        type="email"
        placeholder="Enter your email"
        required
        className="flex-1 sm:w-72 px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-neutral-400 text-sm font-body focus:outline-none focus:border-solvorry/60 focus:bg-solvorry/5 focus:ring-1 focus:ring-solvorry/50 transition-all shadow-inner"
        aria-label="Email address for newsletter"
      />
      <button
        type="submit"
        className="px-6 py-3.5 bg-solvorry hover:bg-solvorry-light text-white text-sm font-display font-semibold rounded-xl transition-all duration-300 hover:shadow-glow hover:-translate-y-0.5 whitespace-nowrap"
      >
        Join Now
      </button>
    </form>
  );
}
