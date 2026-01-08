import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProjectBySlug, getAllProjects, urlFor } from '@/lib/sanity';
import ProjectGallery from '@/components/ProjectGallery';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((project) => ({
    slug: project.slug.current,
  }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  
  if (!project) {
    return { title: 'Projeto nao encontrado' };
  }
  
  return {
    title: `${project.title} | Tierrifilms`,
    description: project.description || `Veja o projeto ${project.title}`,
    openGraph: {
      images: [urlFor(project.coverImage).width(1200).height(630).url()],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  
  if (!project) {
    notFound();
  }
  
  return <ProjectGallery project={project} />;
}

