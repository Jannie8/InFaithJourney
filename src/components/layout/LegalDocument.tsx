import type { ReactNode } from 'react';

type LegalSection = {
  title: string;
  content: ReactNode;
};

type LegalDocumentProps = {
  eyebrow: string;
  title: string;
  introduction: ReactNode;
  sections: LegalSection[];
};

export function LegalDocument({ eyebrow, title, introduction, sections }: LegalDocumentProps) {
  return (
    <main className="flex-1 bg-[#F7F3EE] px-6 pb-24 pt-40 md:pt-52">
      <article className="mx-auto max-w-4xl">
        <header className="mb-12 border-b border-primary/15 pb-10 text-center md:mb-16">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.28em] text-primary">{eyebrow}</p>
          <h1 className="font-headline text-4xl leading-tight text-primary md:text-6xl">{title}</h1>
          <div className="mx-auto mt-6 h-px w-24 bg-secondary" />
        </header>

        <div className="mb-12 rounded-3xl border border-primary/10 bg-white/55 p-6 text-base leading-8 text-foreground/80 shadow-sm md:p-9 md:text-lg">
          {introduction}
        </div>

        <div className="space-y-10 md:space-y-12">
          {sections.map((section) => (
            <section key={section.title} className="scroll-mt-28">
              <h2 className="mb-4 font-headline text-2xl font-semibold text-primary md:text-3xl">
                {section.title}
              </h2>
              <div className="space-y-4 text-[15px] leading-7 text-foreground/75 md:text-base md:leading-8">
                {section.content}
              </div>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
