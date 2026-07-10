import React from 'react';
import Link from 'next/link';

interface BreadcrumbItem {
  name: string;
  url: string;
}

export default function Breadcrumbs({ items, className = '' }: { items: BreadcrumbItem[], className?: string }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://www.yukceritain.com${item.url}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="breadcrumb" className={`text-sm text-neutral-500 dark:text-neutral-400 mb-6 flex items-center gap-1.5 ${className}`}>
        <ol className="flex items-center space-x-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-center space-x-2">
              {index > 0 && <span className="mx-1">›</span>}
              {index === items.length - 1 ? (
                <span className="text-neutral-900 dark:text-neutral-200 font-medium" aria-current="page">{item.name}</span>
              ) : (
                <Link href={item.url} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
