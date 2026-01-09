import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Configuracao de tipos permitidos com magic bytes e limites
const ALLOWED_TYPES: Record<string, {
  mimeTypes: string[];
  magicBytes: number[][];
  maxSize: number;
  resourceType: 'image' | 'video' | 'raw';
}> = {
  image: {
    mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
    magicBytes: [
      [0xFF, 0xD8, 0xFF],           // JPEG
      [0x89, 0x50, 0x4E, 0x47],     // PNG
      [0x47, 0x49, 0x46],           // GIF
      [0x52, 0x49, 0x46, 0x46],     // WebP (RIFF)
      [0x3C, 0x3F, 0x78, 0x6D],     // SVG (<?xm)
      [0x3C, 0x73, 0x76, 0x67],     // SVG (<svg)
    ],
    maxSize: 10 * 1024 * 1024, // 10MB para imagens
    resourceType: 'image',
  },
  video: {
    mimeTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
    magicBytes: [
      [0x00, 0x00, 0x00],           // MP4/MOV (ftyp)
      [0x1A, 0x45, 0xDF, 0xA3],     // WebM
    ],
    maxSize: 100 * 1024 * 1024, // 100MB para videos
    resourceType: 'video',
  },
};

// Verifica magic bytes do arquivo
function checkMagicBytes(buffer: Buffer, allowedMagic: number[][]): boolean {
  for (const magic of allowedMagic) {
    let match = true;
    for (let i = 0; i < magic.length; i++) {
      if (buffer[i] !== magic[i]) {
        match = false;
        break;
      }
    }
    if (match) return true;
  }
  return false;
}

// Determina o tipo de arquivo
function getFileType(mimeType: string): 'image' | 'video' | null {
  if (ALLOWED_TYPES.image.mimeTypes.includes(mimeType)) return 'image';
  if (ALLOWED_TYPES.video.mimeTypes.includes(mimeType)) return 'video';
  return null;
}

export async function POST(request: NextRequest) {
  // Verificar autenticacao
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'uploads';

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    // Validar tipo MIME
    const fileType = getFileType(file.type);
    if (!fileType) {
      return NextResponse.json({ 
        error: 'Tipo de arquivo nao permitido. Use: JPEG, PNG, GIF, WebP, SVG, MP4, WebM ou MOV' 
      }, { status: 400 });
    }

    const typeConfig = ALLOWED_TYPES[fileType];

    // Validar tamanho
    if (file.size > typeConfig.maxSize) {
      const maxSizeMB = typeConfig.maxSize / (1024 * 1024);
      return NextResponse.json({ 
        error: `Arquivo muito grande. Maximo: ${maxSizeMB}MB para ${fileType === 'image' ? 'imagens' : 'videos'}` 
      }, { status: 400 });
    }

    // Converter File para Buffer para verificar magic bytes
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validar magic bytes (conteudo real do arquivo)
    if (!checkMagicBytes(buffer, typeConfig.magicBytes)) {
      return NextResponse.json({ 
        error: 'Conteudo do arquivo nao corresponde ao tipo declarado' 
      }, { status: 400 });
    }

    // Sanitizar nome da pasta (prevenir path traversal)
    const sanitizedFolder = folder
      .replace(/\.\./g, '')
      .replace(/[^a-zA-Z0-9\-_\/]/g, '')
      .substring(0, 50);

    // Converter para base64 para upload
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Upload para Cloudinary
    const result = await cloudinary.uploader.upload(base64, {
      folder: `tierrifilms/${sanitizedFolder}`,
      resource_type: typeConfig.resourceType,
      // Limitar transformacoes para seguranca
      allowed_formats: fileType === 'image' 
        ? ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'] 
        : ['mp4', 'webm', 'mov'],
    });

    return NextResponse.json({
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      size: result.bytes,
      type: fileType,
    });
  } catch (error) {
    console.error('Erro no upload:', error);
    return NextResponse.json({ error: 'Erro ao fazer upload' }, { status: 500 });
  }
}
