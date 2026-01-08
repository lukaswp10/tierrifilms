import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'project',
  title: 'Projeto',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titulo do Projeto',
      type: 'string',
      description: 'Ex: Casamento Ana & Pedro',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL do Projeto',
      type: 'slug',
      description: 'Clique em "Generate" para criar automaticamente',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Categoria',
      type: 'reference',
      to: [{ type: 'category' }],
      description: 'Selecione a categoria do projeto',
    }),
    defineField({
      name: 'description',
      title: 'Descricao',
      type: 'text',
      description: 'Uma breve descricao do projeto',
      rows: 3,
    }),
    defineField({
      name: 'coverImage',
      title: 'Imagem de Capa',
      type: 'image',
      description: 'Imagem principal que aparece na listagem',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Galeria de Fotos',
      type: 'array',
      description: 'Arraste as fotos aqui (pode adicionar varias de uma vez)',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'caption',
              title: 'Legenda (opcional)',
              type: 'string',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'videoUrl',
      title: 'Link do Video (YouTube ou Vimeo)',
      type: 'url',
      description: 'Cole o link do video principal do projeto (opcional)',
    }),
    defineField({
      name: 'eventDate',
      title: 'Data do Evento',
      type: 'date',
      description: 'Quando o evento aconteceu',
      options: {
        dateFormat: 'DD/MM/YYYY',
      },
    }),
    defineField({
      name: 'featured',
      title: 'Destaque na Home',
      type: 'boolean',
      description: 'Marque para aparecer na pagina inicial',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Ordem de Exibicao',
      type: 'number',
      description: 'Numero menor aparece primeiro (1, 2, 3...)',
      initialValue: 10,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category.title',
      media: 'coverImage',
      featured: 'featured',
    },
    prepare({ title, category, media, featured }) {
      return {
        title: featured ? `? ${title}` : title,
        subtitle: category || 'Sem categoria',
        media,
      };
    },
  },
  orderings: [
    {
      title: 'Ordem Manual',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Mais Recentes',
      name: 'dateDesc',
      by: [{ field: 'eventDate', direction: 'desc' }],
    },
  ],
});

