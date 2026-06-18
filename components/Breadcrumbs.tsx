import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  url?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const allItems = [{ label: 'Inicio', url: '/' }, ...items];

  // Schema.org JSON-LD BreadcrumbList
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': allItems.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.label,
      'item': item.url ? `${process.env.NEXT_PUBLIC_SITE_URL || ''}${item.url}` : undefined,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center text-xs text-zinc-500 overflow-x-auto whitespace-nowrap py-1">
        <ol className="flex items-center gap-1.5">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1;
            const Icon = index === 0 ? Home : null;

            return (
              <li key={index} className="flex items-center gap-1.5">
                {index > 0 && <ChevronRight size={12} className="text-zinc-700 flex-shrink-0" />}
                
                {isLast || !item.url ? (
                  <span className="font-medium text-zinc-300 max-w-[180px] truncate" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.url}
                    className="flex items-center gap-1 hover:text-zinc-300 transition-colors text-zinc-500"
                  >
                    {Icon && <Icon size={12} className="flex-shrink-0" />}
                    <span>{item.label}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
