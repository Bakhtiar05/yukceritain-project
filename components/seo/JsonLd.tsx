import React from 'react';

export function OrganizationJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'YukceritaIN',
    url: 'https://www.yukceritain.com',
    logo: 'https://www.yukceritain.com/assets/logo-v5.png',
    description: 'Platform konseling online untuk kesehatan mental yang aman, nyaman, dan terjangkau.',
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function WebSiteJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'YukceritaIN',
    url: 'https://www.yukceritain.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://www.yukceritain.com/events?search={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function ArticleJsonLd({ post }: { post: any }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.cover_image ? [post.cover_image] : [],
    datePublished: post.created_at,
    dateModified: post.updated_at || post.created_at,
    author: {
      '@type': 'Person',
      name: post.author_name || 'YukceritaIN',
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function EventJsonLd({ event }: { event: any }) {
  const isOnline = event.event_type === 'ONLINE';
  const isFree = event.pricing_type === 'FREE';
  const isFull = event.quota > 0 && event.registered_count >= event.quota;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.short_description,
    startDate: event.start_datetime,
    endDate: event.end_datetime,
    eventAttendanceMode: isOnline ? 'https://schema.org/OnlineEventAttendanceMode' : 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: isOnline ? {
      '@type': 'VirtualLocation',
      url: event.meeting_platform || 'https://www.yukceritain.com',
    } : {
      '@type': 'Place',
      name: event.venue_name || 'TBA',
      address: {
        '@type': 'PostalAddress',
        streetAddress: event.venue_address || 'TBA',
      }
    },
    image: event.cover_image ? [event.cover_image] : [],
    offers: {
      '@type': 'Offer',
      url: `https://www.yukceritain.com/events/${event.slug}`,
      price: isFree ? '0' : event.price,
      priceCurrency: event.currency || 'IDR',
      availability: isFull ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
      validFrom: event.created_at,
    },
    performer: event.speaker ? {
      '@type': 'Person',
      name: event.speaker,
    } : undefined,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function FaqJsonLd({ faqs }: { faqs: { q: string, a: string }[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
