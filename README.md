# TIERRIFILMS - Site de Portfolio

Site de portfolio para videomaker, desenvolvido com Next.js 14, Tailwind CSS e Framer Motion.

## Stack Tecnologica

- **Framework:** Next.js 14 (App Router)
- **Estilizacao:** Tailwind CSS
- **Animacoes:** Framer Motion
- **Icones:** Lucide React
- **Deploy:** Vercel

## Secoes do Site

1. **Hero** - Banner principal com logo e chamada para acao
2. **Sobre** - Informacoes sobre a empresa
3. **Portfolio** - Grid de projetos/cases
4. **Servicos** - Cards com servicos oferecidos
5. **Numeros** - Estatisticas animadas
6. **Contato** - Formulario e informacoes de contato
7. **Footer** - Rodape com links e redes sociais

## Como Rodar Localmente

```bash
# Instalar dependencias
npm install

# Rodar em desenvolvimento
npm run dev

# Build para producao
npm run build

# Rodar build de producao
npm start
```

## Deploy na Vercel

1. Faca push do codigo para o GitHub
2. Acesse [vercel.com](https://vercel.com)
3. Conecte sua conta GitHub
4. Importe o repositorio `tierrifilms`
5. Clique em Deploy

O site estara disponivel em `tierrifilms.vercel.app`

## Personalizacao

### Trocar Imagens
- As imagens de placeholder estao nos componentes usando URLs do Unsplash
- Substitua as URLs pelas suas proprias imagens

### Trocar Textos
- Edite os componentes em `/components/`
- Cada secao tem seu proprio arquivo

### Trocar Cores
- As cores principais estao em `/app/globals.css`
- Cor principal (dourado): `#c9a227`
- Fundo: `#0a0a0a`

### Trocar Informacoes de Contato
- Edite o arquivo `/components/Contact.tsx`
- Atualize telefone, email, redes sociais e WhatsApp

## Estrutura de Pastas

```
tierrifilms/
??? app/
?   ??? layout.tsx      # Layout principal
?   ??? page.tsx        # Pagina inicial
?   ??? globals.css     # Estilos globais
??? components/
?   ??? Navbar.tsx      # Menu de navegacao
?   ??? Hero.tsx        # Banner principal
?   ??? About.tsx       # Secao Sobre
?   ??? Portfolio.tsx   # Grid de projetos
?   ??? Services.tsx    # Cards de servicos
?   ??? Stats.tsx       # Numeros/estatisticas
?   ??? Contact.tsx     # Formulario de contato
?   ??? Footer.tsx      # Rodape
??? public/             # Arquivos estaticos
??? package.json        # Dependencias
```

## Licenca

Projeto desenvolvido para TIERRIFILMS.
