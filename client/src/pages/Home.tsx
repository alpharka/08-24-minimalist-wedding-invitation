import {
  BookOpen,
  CalendarDays,
  CalendarPlus,
  ClipboardList,
  Heart,
  Images,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

/**
 * Minimalist Wedding Invitation Website
 * Design Philosophy: "Less, but better"
 * - Generous whitespace and vertical flow
 * - Elegant typography (Playfair Display + Inter)
 * - Restrained luxury with gold accents
 * - Soft animations and refined interactions
 */

export default function Home() {
  const [rsvpData, setRsvpData] = useState({
    name: "",
    email: "",
    guests: "1",
    dietary: "",
  });
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [wishesText, setWishesText] = useState("");
  const sectionRefs = useRef<Array<HTMLElement | null>>([]);
  const [revealedSections, setRevealedSections] = useState<Set<number>>(() => new Set([0]));

  useEffect(() => {
    const sections = sectionRefs.current.filter(
      (section): section is HTMLElement => Boolean(section),
    );
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealAll = () => setRevealedSections(new Set(sections.map((_, index) => index)));

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealAll();
      return;
    }

    const sectionIndexes = new Map<HTMLElement, number>(
      sections.map((section, index) => [section, index]),
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const sectionIndex = sectionIndexes.get(entry.target as HTMLElement);
          if (sectionIndex === undefined) return;

          setRevealedSections((current) => {
            if (current.has(sectionIndex)) return current;
            const next = new Set(current);
            next.add(sectionIndex);
            return next;
          });
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const revealClass = (sectionIndex: number, className: string) =>
    `${className} scroll-reveal ${revealedSections.has(sectionIndex) ? "is-visible" : ""}`;

  const handleAddToCalendar = () => {
    const calendarEvent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Sarah & Michael//Wedding Invitation//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "X-WR-CALNAME:Sarah & Michael's Wedding",
      "BEGIN:VEVENT",
      "UID:sarah-michael-wedding-2025@invitation.local",
      "DTSTAMP:20240101T000000Z",
      "DTSTART:20250614T230000Z",
      "DTEND:20250615T050000Z",
      "SUMMARY:Sarah & Michael's Wedding",
      "LOCATION:Riverside Garden Pavilion\\, 1234 Riverside Drive\\, Portland\\, OR 97214",
      "DESCRIPTION:Join us as we celebrate Sarah and Michael. Ceremony at 4:00 PM, reception at 6:00 PM.",
      "STATUS:CONFIRMED",
      "TRANSP:OPAQUE",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\\r\\n");

    const file = new Blob([calendarEvent], { type: "text/calendar;charset=utf-8" });
    const downloadUrl = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = "sarah-michael-wedding.ics";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(downloadUrl);
    toast.success("Your calendar event is ready to download.");
  };

  const handleRsvpChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRsvpData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpData.name || !rsvpData.email) {
      toast.error("Please fill in all required fields");
      return;
    }
    setRsvpSubmitted(true);
    toast.success("Thank you for confirming your presence!");
    setTimeout(() => {
      setRsvpData({ name: "", email: "", guests: "1", dietary: "" });
      setRsvpSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-0">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-[#EAEAEA] z-50">
        <div className="container flex items-center justify-between py-4">
          <div className="text-2xl font-serif font-bold text-[#D4AF37]">&</div>
          <nav className="hidden md:flex gap-8 text-xs font-medium tracking-wide uppercase">
            <a href="#couple" className="text-[#1F1F1F] hover:text-[#D4AF37] transition-colors">
              Story
            </a>
            <a href="#event" className="text-[#1F1F1F] hover:text-[#D4AF37] transition-colors">
              Event
            </a>
            <a href="#gallery" className="text-[#1F1F1F] hover:text-[#D4AF37] transition-colors">
              Gallery
            </a>
            <a href="#rsvp" className="text-[#1F1F1F] hover:text-[#D4AF37] transition-colors">
              RSVP
            </a>
          </nav>
        </div>
      </header>

      {/* Cover Section */}
      <section
        ref={(element) => { sectionRefs.current[0] = element; }}
        className={revealClass(0, "pt-32 pb-20 md:pt-40 md:pb-32 px-4")}
      >
        <div className="container text-center fade-in">
          <div className="mb-8 flex justify-center">
            <div className="text-6xl md:text-7xl font-serif font-bold text-[#D4AF37]">&</div>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-[#1F1F1F] mb-6">
            Sarah & Michael
          </h1>
          <p className="text-base md:text-lg text-[#666666] mb-12 max-w-2xl mx-auto font-light">
            Two hearts, one story.
          </p>
          <a href="#invitation-start" className="btn-minimal inline-block">Buka Undangan</a>
        </div>
      </section>

      {/* Divider */}
      <div className="flex justify-center">
        <div className="divider-gold"></div>
      </div>

      {/* Quote Section */}
      <section
        id="invitation-start"
        ref={(element) => { sectionRefs.current[1] = element; }}
        className={revealClass(1, "py-16 md:py-24 px-4")}
      >
        <div className="container text-center">
          <p className="text-2xl md:text-3xl font-serif italic text-[#1F1F1F] leading-relaxed">
            "Love is the master key that opens the gates of happiness."
          </p>
          <p className="text-sm text-[#999999] mt-6">— Oliver Wendell Holmes</p>
        </div>
      </section>

      {/* Divider */}
      <div className="flex justify-center">
        <div className="divider-gold"></div>
      </div>

      {/* Wedding Couple Section */}
      <section
        id="couple"
        ref={(element) => { sectionRefs.current[2] = element; }}
        className={revealClass(2, "section px-4")}
      >
        <div className="container">
          <div className="text-center mb-16">
            <div className="divider-gold mb-8"></div>
            <h2 className="text-3xl md:text-4xl font-serif text-[#1F1F1F] mb-8">Our Story</h2>
          </div>

          <div className="max-w-3xl mx-auto mb-16">
            <div className="rounded-lg overflow-hidden shadow-sm mb-12">
              <img
                src="/manus-storage/hero-couple_a849dbd2.png"
                alt="Sarah and Michael"
                className="w-full h-96 object-cover"
              />
            </div>
            <p className="text-center text-[#666666] leading-relaxed mb-8">
              Sarah, an architect with an eye for beauty, and Michael, a musician with a soul for creation, found each other in a moment that felt like destiny. Their love story is one of quiet moments, shared dreams, and the certainty that they were meant to walk this path together.
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="flex justify-center">
        <div className="divider-gold"></div>
      </div>

      {/* Event Section */}
      <section
        id="event"
        ref={(element) => { sectionRefs.current[3] = element; }}
        className={revealClass(3, "section px-4")}
      >
        <div className="container">
          <div className="text-center mb-16">
            <div className="divider-gold mb-8"></div>
            <h2 className="text-3xl md:text-4xl font-serif text-[#1F1F1F]">Wedding Details</h2>
          </div>

          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-12">
              <h3 className="text-2xl font-serif text-[#1F1F1F] mb-6">Saturday, June 14, 2025</h3>
              <p className="text-[#666666] mb-2">Ceremony at 4:00 PM</p>
              <p className="text-[#666666] mb-6">Reception at 6:00 PM</p>
              <p className="text-sm text-[#999999] mb-4">Riverside Garden Pavilion</p>
              <p className="text-sm text-[#999999] mb-8">1234 Riverside Drive, Portland, OR 97214</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button className="btn-minimal">Get Directions</button>
                <button
                  type="button"
                  onClick={handleAddToCalendar}
                  className="btn-minimal inline-flex items-center justify-center gap-2"
                  aria-label="Download Sarah and Michael's wedding event for your calendar"
                >
                  <CalendarPlus size={16} strokeWidth={1.5} aria-hidden="true" />
                  Add to Calendar
                </button>
              </div>
            </div>
            <div className="pt-8 border-t border-[#EAEAEA]">
              <p className="text-sm text-[#666666]">Black Tie Optional</p>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="flex justify-center">
        <div className="divider-gold"></div>
      </div>

      {/* Gallery Section */}
      <section
        id="gallery"
        ref={(element) => { sectionRefs.current[4] = element; }}
        className={revealClass(4, "section px-4")}
      >
        <div className="container">
          <div className="text-center mb-16">
            <div className="divider-gold mb-8"></div>
            <h2 className="text-3xl md:text-4xl font-serif text-[#1F1F1F]">Moments</h2>
          </div>

          <div className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            <div className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <img
                src="/manus-storage/gallery-1_913839a7.png"
                alt="Wedding moment"
                className="w-full h-56 object-cover"
              />
            </div>
            <div className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <img
                src="/manus-storage/gallery-2_f489969a.png"
                alt="Wedding moment"
                className="w-full h-56 object-cover"
              />
            </div>
            <div className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <img
                src="/manus-storage/gallery-3_9836e6f0.png"
                alt="Wedding moment"
                className="w-full h-56 object-cover"
              />
            </div>
            <div className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <img
                src="/manus-storage/hero-couple_a849dbd2.png"
                alt="Wedding moment"
                className="w-full h-56 object-cover"
              />
            </div>
            <div className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <img
                src="/manus-storage/gallery-1_913839a7.png"
                alt="Wedding moment"
                className="w-full h-56 object-cover"
              />
            </div>
            <div className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <img
                src="/manus-storage/gallery-3_9836e6f0.png"
                alt="Wedding moment"
                className="w-full h-56 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="flex justify-center">
        <div className="divider-gold"></div>
      </div>

      {/* RSVP Section */}
      <section
        id="rsvp"
        ref={(element) => { sectionRefs.current[5] = element; }}
        className={revealClass(5, "section px-4")}
      >
        <div className="container max-w-2xl">
          <div className="text-center mb-12">
            <div className="divider-gold mb-8"></div>
            <h2 className="text-3xl md:text-4xl font-serif text-[#1F1F1F] mb-4">Confirm Your Presence</h2>
            <p className="text-sm text-[#999999]">We'd be honored to celebrate with you. Please respond by May 31, 2025.</p>
          </div>

          {rsvpSubmitted ? (
            <div className="card-minimal text-center">
              <h3 className="text-2xl font-serif text-[#1F1F1F] mb-3">Thank You!</h3>
              <p className="text-[#666666]">
                We've received your response. We can't wait to celebrate with you on June 14th.
              </p>
            </div>
          ) : (
            <form onSubmit={handleRsvpSubmit} className="space-y-6 max-w-md mx-auto">
              <div>
                <label className="block text-xs font-medium text-[#1F1F1F] mb-3 uppercase tracking-wide">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={rsvpData.name}
                  onChange={handleRsvpChange}
                  placeholder="Your name"
                  className="input-minimal"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1F1F1F] mb-3 uppercase tracking-wide">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={rsvpData.email}
                  onChange={handleRsvpChange}
                  placeholder="your@email.com"
                  className="input-minimal"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1F1F1F] mb-3 uppercase tracking-wide">Number of Guests</label>
                <select
                  name="guests"
                  value={rsvpData.guests}
                  onChange={handleRsvpChange}
                  className="input-minimal"
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1F1F1F] mb-3 uppercase tracking-wide">Dietary Restrictions</label>
                <textarea
                  name="dietary"
                  value={rsvpData.dietary}
                  onChange={handleRsvpChange}
                  placeholder="Please let us know if you have any dietary restrictions"
                  className="input-minimal resize-none"
                  rows={3}
                />
              </div>

              <button type="submit" className="btn-minimal w-full">
                Confirm Attendance
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Gift Section */}
      <section
        ref={(element) => { sectionRefs.current[6] = element; }}
        className={revealClass(6, "section px-4")}
      >
        <div className="container max-w-2xl">
          <div className="text-center mb-12">
            <div className="divider-gold mb-8"></div>
            <h2 className="text-3xl md:text-4xl font-serif text-[#1F1F1F] mb-4">Gift Registry</h2>
            <p className="text-sm text-[#999999]">Your presence is our greatest gift. If you wish to honor us, here are our preferences.</p>
          </div>

          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div>
              <h3 className="text-lg font-serif text-[#1F1F1F] mb-2">Honeymoon Fund</h3>
              <p className="text-sm text-[#666666] mb-4">Help us create unforgettable memories on our honeymoon to Italy.</p>
              <button className="btn-minimal text-sm">View Fund</button>
            </div>

            <div className="pt-6 border-t border-[#EAEAEA]">
              <h3 className="text-lg font-serif text-[#1F1F1F] mb-2">Home Essentials</h3>
              <p className="text-sm text-[#666666] mb-4">Browse our curated registry of items for our new home.</p>
              <button className="btn-minimal text-sm">View Registry</button>
            </div>
          </div>
        </div>
      </section>

      {/* Wedding Wishes Section */}
      <section
        id="wishes"
        ref={(element) => { sectionRefs.current[7] = element; }}
        className={revealClass(7, "section px-4")}
      >
        <div className="container max-w-2xl">
          <div className="text-center mb-12">
            <div className="divider-gold mb-8"></div>
            <h2 className="text-3xl md:text-4xl font-serif text-[#1F1F1F] mb-4">Share Your Wishes</h2>
            <p className="text-sm text-[#999999]">Leave us a message of love and support.</p>
          </div>

          <div className="max-w-2xl mx-auto">
            <textarea
              placeholder="Your heartfelt message..."
              value={wishesText}
              onChange={(e) => setWishesText(e.target.value)}
              className="input-minimal resize-none w-full"
              rows={5}
            />
            <button onClick={() => {
              if (wishesText.trim()) {
                toast.success("Thank you for your wishes!");
                setWishesText("");
              }
            }} className="btn-minimal w-full mt-6">
              Send Wishes
            </button>
          </div>
        </div>
      </section>

      {/* Closing Section */}
      <section
        ref={(element) => { sectionRefs.current[8] = element; }}
        className={revealClass(8, "section px-4")}
      >
        <div className="container text-center max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-serif text-[#1F1F1F] mb-6">
            We Can't Wait to Celebrate with You
          </h2>
          <p className="text-[#666666] mb-8 leading-relaxed">
            Join us for a day filled with love, laughter, and cherished moments as we begin our forever journey together.
          </p>
          <a href="#rsvp" className="inline-block">
            <button className="btn-minimal">Confirm Your Presence</button>
          </a>
        </div>
      </section>

      {/* Mobile bottom navigation */}
      <nav className="mobile-bottom-nav md:hidden" aria-label="Navigasi undangan">
        <a href="#couple" aria-label="Buka bagian cerita">
          <BookOpen size={17} strokeWidth={1.6} aria-hidden="true" />
          <span>Story</span>
        </a>
        <a href="#event" aria-label="Buka bagian acara">
          <CalendarDays size={17} strokeWidth={1.6} aria-hidden="true" />
          <span>Event</span>
        </a>
        <a href="#gallery" aria-label="Buka galeri momen">
          <Images size={17} strokeWidth={1.6} aria-hidden="true" />
          <span>Gallery</span>
        </a>
        <a href="#rsvp" aria-label="Buka konfirmasi kehadiran">
          <ClipboardList size={17} strokeWidth={1.6} aria-hidden="true" />
          <span>RSVP</span>
        </a>
        <a href="#wishes" aria-label="Buka bagian ucapan">
          <Heart size={17} strokeWidth={1.6} aria-hidden="true" />
          <span>Wishes</span>
        </a>
      </nav>

      {/* Footer */}
      <footer className="border-t border-[#EAEAEA] py-8 px-4">
        <div className="container text-center">
          <p className="text-sm text-[#999999]">
            © 2025 Sarah & Michael. Created with love.
          </p>
        </div>
      </footer>
    </div>
  );
}
