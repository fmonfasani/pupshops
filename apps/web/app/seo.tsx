import type { Metadata } from 'next';

export const defaultMetadata: Metadata = {
  title: 'Pupshops - Tienda y Servicios para Mascotas',
  description:
    'Compra productos premium para tus mascotas, agenda turnos para servicios y gestioná tus pedidos desde una única plataforma.',
  openGraph: {
    title: 'Pupshops',
    description:
      'Tienda de mascotas con catálogo en línea, servicios veterinarios y reservas de turnos.',
    url: 'https://pupshops.local',
    siteName: 'Pupshops',
    locale: 'es_AR',
    type: 'website'
  }
};
