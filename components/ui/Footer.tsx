import Image from "next/image";

const Footer: React.FC = () => {
  interface NavigationItem {
    href: string;
    name: string;
    id: number;
  }
  const footerNavs: NavigationItem[] = [
    {
      href: "https://felicia-portfolio.netlify.app/",
      name: "Portfolio",
      id: 1,
    },
    {
      href: "https://nz-locum-network.netlify.app/",
      name: "NZ Veterinary Locum Network",
      id: 2,
    },
    {
      href: "https://mixtape-me.herokuapp.com/",
      name: "Spotify app integration",
      id: 3,
    },
    {
      href: "https://what-to-eat-2.vercel.app/",
      name: "What to eat?",
      id: 4,
    },
  ];

  return (
    <footer className="mt-24 border-t border-[var(--color-border)] bg-white/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-14 text-[var(--color-muted)] lg:px-10">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <Image
              src="/logo.png"
              width={150}
              height={90}
              alt="Appreciate ya logo"
              className="w-32"
            />
            <p className="max-w-md text-sm">
              Boost morale with a click. Create a culture of recognition where
              every teammate feels seen.
            </p>
          </div>
          <div className="surface-card rounded-3xl px-5 py-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
              Celebrate daily
            </p>
            <p className="mt-2 text-lg font-semibold text-[var(--color-fg)]">
              Appreciate wins in real time.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-6 border-t border-[var(--color-border)] pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold text-[var(--color-fg)]">
            © 2024 Felicia Fel. All rights reserved.
          </p>
          <ul className="flex flex-wrap items-center gap-4">
            {footerNavs.map((item) => (
              <li
                key={item.id}
                className="text-[var(--color-muted)] hover:text-[var(--color-fg)] duration-150"
              >
                <a href={item.href}>{item.name}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
