import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import Footer from "@/components/ui/Footer";
import {
  RiSparkling2Fill,
  RiTeamFill,
  RiGiftFill,
  RiPulseFill,
  RiChatSmile2Fill,
} from "react-icons/ri";

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <section className="relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-40 right-0 h-96 w-96 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,167,167,0.6),transparent_70%)] blur-3xl" />
          <div className="absolute -bottom-32 left-0 h-96 w-96 rounded-full bg-[radial-gradient(circle_at_center,rgba(130,170,255,0.55),transparent_70%)] blur-3xl" />
        </div>
        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 pb-20 pt-12 lg:flex-row lg:items-center lg:gap-16 lg:px-10">
          <div className="flex-1 space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)] shadow-sm">
              <RiSparkling2Fill className="text-[var(--color-accent)]" />
              Recognition, reimagined
            </span>
            <h1 className="text-4xl font-semibold leading-tight text-[var(--color-fg)] sm:text-5xl lg:text-6xl">
              Together, build a culture where gratitude travels fast.
            </h1>
            <p className="max-w-xl text-lg text-[var(--color-muted)]">
              Appreciate Ya turns everyday moments into momentum. Share wins,
              celebrate effort, and keep teams connected across every timezone.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href="/add">Send a kudo</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/dashboard">Explore the wall</Link>
              </Button>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-[var(--color-muted)]">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />
                Celebrate peers in seconds.
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[var(--color-accent-2)]" />
                Spotlight wins across teams.
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="surface-card relative overflow-hidden rounded-[32px] p-6">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,111,97,0.08),rgba(79,70,229,0.12))]" />
              <div className="relative">
                <Image
                  src="/appreciateYa-2.jpg"
                  width={ 700 }
                  height={ 520 }
                  alt="Team members sharing appreciation"
                  className="h-auto w-full rounded-3xl object-cover shadow-2xl"
                />
                <div className="absolute -bottom-6 left-6 right-6 rounded-2xl bg-white/90 p-4 shadow-lg">
                  <p className="text-sm font-semibold text-[var(--color-fg)]">
                    "Thanks for jumping in and unblocking the launch."
                  </p>
                  <p className="text-xs text-[var(--color-muted)]">
                    Shared 2 minutes ago · Product Team
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 lg:px-10">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          { [
            {
              title: "Instant shout-outs",
              text: "Recognize effort at the moment it matters most.",
              icon: <RiChatSmile2Fill className="text-2xl" />,
            },
            {
              title: "Team rituals",
              text: "Create a rhythm of gratitude across every squad.",
              icon: <RiTeamFill className="text-2xl" />,
            },
            {
              title: "Meaningful rewards",
              text: "Pair kudos with small gifts that feel thoughtful.",
              icon: <RiGiftFill className="text-2xl" />,
            },
            {
              title: "Pulse check",
              text: "See morale trends and nurture healthy habits.",
              icon: <RiPulseFill className="text-2xl" />,
            },
          ].map((item) => (
            <div
              key={ item.title }
              className="surface-card flex h-full flex-col gap-4 rounded-3xl p-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-surface-2)] text-[var(--color-accent-2)]">
                { item.icon }
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--color-fg)]">
                  { item.title }
                </h3>
                <p className="mt-2 text-sm text-[var(--color-muted)]">
                  { item.text }
                </p>
              </div>
            </div>
          )) }
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-6 lg:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-[var(--color-fg)] sm:text-4xl">
              A simple flow that keeps recognition moving.
            </h2>
            <p className="text-lg text-[var(--color-muted)]">
              Appreciate Ya fits into your day without extra effort. Highlight
              moments, write a note, and let the community keep the energy
              going.
            </p>
            <div className="grid gap-4">
              { ["Spotlight someone", "Write a short note", "Share to the wall"].map(
                (step, index) => (
                  <div
                    key={ step }
                    className="flex items-center gap-4 rounded-2xl bg-white/80 p-4"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent-2)] text-sm font-semibold text-white">
                      { index + 1 }
                    </div>
                    <p className="text-sm font-medium text-[var(--color-fg)]">
                      { step }
                    </p>
                  </div>
                ),
              ) }
            </div>
          </div>
          <div className="surface-card rounded-[32px] p-6">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                Daily highlight
              </p>
              <h3 className="text-2xl font-semibold text-[var(--color-fg)]">
                "Made the handoff seamless for the entire team."
              </h3>
              <p className="text-sm text-[var(--color-muted)]">
                Recent appreciation cards keep everyone aligned on what great
                looks like.
              </p>
              <div className="flex gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-[var(--color-accent)]"
                  style={ { backgroundColor: "rgba(255, 111, 97, 0.2)" } }
                >
                  P
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--color-fg)]">
                    Priya Patel
                  </p>
                  <p className="text-xs text-[var(--color-muted)]">
                    Customer Success
                  </p>
                </div>
              </div>
              <Button asChild variant="outline">
                <Link href="/mykudos/received">View your kudos</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-6 lg:px-10">
        <div className="surface-card grid gap-8 rounded-[36px] px-8 py-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
              Built for modern teams
            </p>
            <h2 className="text-3xl font-semibold text-[var(--color-fg)]">
              Keep appreciation visible, measurable, and human.
            </h2>
            <p className="text-sm text-[var(--color-muted)]">
              Create shared rituals, celebrate milestones, and let managers spot
              the impact immediately.
            </p>
          </div>
          <div className="space-y-4">
            { ["Live feed of shout-outs", "Private notes for managers", "Shareable recap cards"].map(
              (item) => (
                <div
                  key={ item }
                  className="flex items-center gap-3 rounded-2xl bg-white/80 px-4 py-3"
                >
                  <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />
                  <p className="text-sm font-medium text-[var(--color-fg)]">
                    { item }
                  </p>
                </div>
              ),
            ) }
          </div>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-6 lg:px-10">
        <div className="glass-panel rounded-[36px] px-8 py-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-3xl font-semibold text-[var(--color-fg)]">
                Ready to make appreciation effortless?
              </h2>
              <p className="mt-2 text-sm text-[var(--color-muted)]">
                Send a note, share a win, and make someone&apos;s day in under a
                minute.
              </p>
            </div>
            <Button asChild size="lg">
              <Link href="/add">Start sharing kudos</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
