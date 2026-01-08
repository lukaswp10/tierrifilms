import { createClient } from 'next-sanity';
import { createImageUrlBuilder } from '@sanity/image-url';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SanityImageSource = any;

export const client = createClient({
  projectId: '1f1t33c8',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true, // true para producao (mais rapido)
});

// Builder para URLs de imagem
const builder = createImageUrlBuilder({ projectId: '1f1t33c8', dataset: 'production' });

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// Tipos TypeScript
export interface SanityProject {
  _id: string;
  title: string;
  slug: { current: string };
  category?: { title: string; slug: { current: string } };
  description?: string;
  coverImage: SanityImageSource;
  gallery?: Array<{
    _key: string;
    asset: SanityImageSource;
    caption?: string;
  }>;
  videoUrl?: string;
  eventDate?: string;
  featured?: boolean;
  order?: number;
}

// Queries GROQ
export const queries = {
  // Projetos em destaque para a home
  featuredProjects: `*[_type == "project" && featured == true] | order(order asc) {
    _id,
    title,
    slug,
    description,
    coverImage,
    category->{title, slug},
    eventDate
  }`,
  
  // Todos os projetos
  allProjects: `*[_type == "project"] | order(order asc) {
    _id,
    title,
    slug,
    description,
    coverImage,
    category->{title, slug},
    eventDate,
    featured
  }`,
  
  // Projeto por slug (para pagina individual)
  projectBySlug: `*[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    coverImage,
    gallery,
    videoUrl,
    category->{title, slug},
    eventDate
  }`,
  
  // Todas as categorias
  allCategories: `*[_type == "category"] | order(title asc) {
    _id,
    title,
    slug
  }`,
  
  // Projetos por categoria
  projectsByCategory: `*[_type == "project" && category->slug.current == $category] | order(order asc) {
    _id,
    title,
    slug,
    description,
    coverImage,
    eventDate
  }`,
};

// Funcoes helper para buscar dados
export async function getFeaturedProjects(): Promise<SanityProject[]> {
  return client.fetch(queries.featuredProjects);
}

export async function getAllProjects(): Promise<SanityProject[]> {
  return client.fetch(queries.allProjects);
}

export async function getProjectBySlug(slug: string): Promise<SanityProject | null> {
  return client.fetch(queries.projectBySlug, { slug });
}

export async function getAllCategories() {
  return client.fetch(queries.allCategories);
}

export async function getProjectsByCategory(category: string): Promise<SanityProject[]> {
  return client.fetch(queries.projectsByCategory, { category });
}
