import { PetStore } from 'schema-dts';

interface SEOProps {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
}

export function SEO({ title, description, url, imageUrl }: SEOProps) {
  const siteName = '[NOMBRE_PETSHOP]';
  const fullTitle = `${title} | ${siteName}`;
  
  const petStoreJsonLd: PetStore = {
    '@type': 'PetStore',
    name: siteName,
    description: 'Todo para tu mascota, hoy y cerca tuyo.',
    url: process.env.NEXT_PUBLIC_SITE_URL || '',
    image: imageUrl || `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: '[BARRIO]',
      addressRegion: 'CABA',
      addressCountry: 'AR',
    },
    openingHours: [
      '[HORARIO]',
    ],
    telephone: '[WA_NUMERO]',
    priceRange: '[$ / $$ / $$$]',
    service: [
      {
        '@type': 'Service',
        name: 'Veterinaria',
        description: 'Atención veterinaria profesional',
      },
      {
        '@type': 'Service',
        name: 'Peluquería',
        description: 'Estética y cuidado para tu mascota',
      },
      {
        '@type': 'Service',
        name: 'Entrenamiento',
        description: 'Entrenamiento para mascotas',
      },
    ],
  };

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      {imageUrl && <meta property="og:image" content={imageUrl} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {imageUrl && <meta name="twitter:image" content={imageUrl} />}
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(petStoreJsonLd),
        }}
      />
    </>
  );
}