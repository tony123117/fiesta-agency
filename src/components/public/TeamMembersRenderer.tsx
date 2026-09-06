import { useState } from 'react';
import type { TeamMembersContent } from '@/lib/types';

export function TeamMembersRenderer({ content }: { content: unknown }) {
  const data = content as TeamMembersContent;
  const members = data?.members || [];
  const [activeIdx, setActiveIdx] = useState(0);

  if (members.length === 0) return null;

  const activeMember = members[activeIdx] || members[0];

  return (
    <section className="section-pad bg-charcoal">
      <div className="container-site">
        {data?.heading && <h2 className="section text-ivory mb-12">{data.heading}</h2>}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-6">
            <div className="overflow-hidden">
              <img
                src={activeMember.image}
                alt={`${activeMember.role} — ${activeMember.name}`}
                className="w-full object-cover transition-all duration-700"
                style={{ aspectRatio: '4/5' }}
                loading="lazy"
              />
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="border-t border-white/[0.08]">
              {members.map((member, i) => (
                <div
                  key={member.id}
                  className="group cursor-pointer border-b border-white/[0.08] py-5 md:py-8"
                  onMouseEnter={() => setActiveIdx(i)}
                  onFocus={() => setActiveIdx(i)}
                  tabIndex={0}
                  role="button"
                  aria-label={`View ${member.role}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-serif font-light text-ivory tracking-tight mb-2 transition-colors duration-300 group-hover:text-gold text-lg md:text-xl leading-tight">
                        {member.role}
                      </h3>
                      {member.bio && (
                        <p className="text-body-sm text-stone leading-relaxed max-w-md">
                          {member.bio}
                        </p>
                      )}
                    </div>
                    <span className="font-serif font-light text-gold/30 shrink-0 mt-1 transition-colors duration-300 group-hover:text-gold/60 text-lg" aria-hidden="true">
                      →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
