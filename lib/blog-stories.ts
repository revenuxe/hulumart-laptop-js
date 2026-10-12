export interface BlogStory {
  heading: string;
  opening: string;
  takeaways: [string, string, string];
  ctaTitle: string;
  ctaText: string;
  ctaLabel: string;
  ctaHref: string;
}

const stories: Record<string, BlogStory> = {
  'best-place-to-sell-used-laptop-bangalore': {
    heading: 'A good offer is more than a number.',
    opening: 'Imagine getting two offers for the same laptop. One looks higher, but the pickup and inspection terms are unclear. The other explains exactly what happens next. Before choosing a buyer, compare the whole transaction—not just the first number you hear.',
    takeaways: ['Compare offers for the same condition and accessories.', 'Choose a selling route that fits your time and priorities.', 'Agree on inspection, handover, and verified payment.'],
    ctaTitle: 'Start with the laptop you actually own.', ctaText: 'Choose your model and describe its condition, then discuss assessment and pickup with our team.', ctaLabel: 'Select my laptop', ctaHref: '/sell/laptop',
  },
  'prepare-laptop-for-sale': {
    heading: 'Your next chapter starts with a backup.',
    opening: 'Imagine the pickup is arranged, but your photos and work files are still on the laptop. Preparing the device before that moment gives you time to check your backup, remove accounts, and make a clear record of what you are selling.',
    takeaways: ['Check that your backup opens before resetting.', 'Remove personal accounts and linked device locks.', 'Record specifications, faults, and included accessories.'],
    ctaTitle: 'Prepared your device? Take the next step.', ctaText: 'Keep your model and condition notes ready when starting a selling request. Ask us if you need help identifying the device.', ctaLabel: 'Start my selling request', ctaHref: '/sell/laptop',
  },
  'buying-refurbished-laptop-guide': {
    heading: 'A lower price is only the beginning.',
    opening: 'Imagine finding a refurbished laptop that seems perfect for your budget. The real question is whether its battery, hardware, support, and return terms fit your everyday needs. A short checklist can turn an attractive listing into a better-informed decision.',
    takeaways: ['Match the exact hardware to the work you need to do.', 'Check condition, battery, warranty, and return terms.', 'Account for accessories and any likely replacement costs.'],
    ctaTitle: 'Need help planning your next laptop?', ctaText: 'Tell our team what you need the computer for, your budget, and the questions you want answered before choosing.', ctaLabel: 'Discuss my laptop needs', ctaHref: '/contact',
  },
  'refurbished-vs-new-laptops': {
    heading: 'Choose for the day after the purchase.',
    opening: 'Imagine a refurbished business laptop and a new entry-level model at similar prices. Neither label tells you which one will suit your work. Compare the configuration, condition, support, and total cost against the tasks you will actually use it for.',
    takeaways: ['Start with your workload rather than the new or used label.', 'Compare the complete cost and support terms.', 'Decide which tradeoffs you are comfortable accepting.'],
    ctaTitle: 'Build an upgrade plan that fits your work.', ctaText: 'Share your everyday tasks and budget with our team, or begin with a selling request for the laptop you are replacing.', ctaLabel: 'Talk about my upgrade', ctaHref: '/contact',
  },
  'sell-used-laptop-bangalore': {
    heading: 'The laptop still works. Your plans have changed.',
    opening: 'Imagine an old laptop sitting in a drawer after an upgrade. Selling it starts with a few practical questions: which model is it, what condition is it in, and what must happen before it leaves your hands? Work through those questions before arranging a sale.',
    takeaways: ['Identify the exact configuration and describe faults honestly.', 'Confirm collection and assessment arrangements for your address.', 'Protect your files and verify payment before handover.'],
    ctaTitle: 'Give your old laptop its next chapter.', ctaText: 'Find your model and share its condition and pickup pincode. Our team will help you discuss the next step.', ctaLabel: 'Choose my device', ctaHref: '/sell/laptop',
  },
  'how-to-get-highest-resale-value-for-laptop': {
    heading: 'A better comparison starts with better details.',
    opening: 'Imagine two listings for the same laptop. One says only “good condition”; the other explains the processor, storage, battery, and known wear. Accurate details help buyers assess the real device and help you compare offers on the same basis.',
    takeaways: ['Document the specification and condition before asking for offers.', 'Compare final terms rather than headline estimates.', 'Check whether preparation costs are worth spending.'],
    ctaTitle: 'Put your condition notes to work.', ctaText: 'Start with the correct model and a clear description. Final offers depend on the verified device and agreed terms.', ctaLabel: 'Start a device assessment', ctaHref: '/sell/laptop',
  },
};

export function blogStory(slug: string): BlogStory | undefined { return stories[slug]; }
