import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { v2 as cloudinary } from 'cloudinary';

// Configurar Cloudinary (mesmo que upload/route.ts)
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Limites do plano gratuito (para referencia)
const LIMITS = {
  cloudinary: {
    storage: 25 * 1024 * 1024 * 1024, // 25 GB em bytes
    bandwidth: 25 * 1024 * 1024 * 1024, // 25 GB em bytes
    credits: 25,
  },
  supabase: {
    database: 500 * 1024 * 1024, // 500 MB em bytes
    bandwidth: 5 * 1024 * 1024 * 1024, // 5 GB em bytes
  },
  vercel: {
    bandwidth: 100 * 1024 * 1024 * 1024, // 100 GB em bytes
    buildMinutes: 6000,
  },
};

// Helper para formatar bytes em unidades legiveis
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export async function GET() {
  try {
    // 1. Buscar uso do Cloudinary via SDK Admin API
    let cloudinaryData = null;
    
    try {
      // Usar o SDK do Cloudinary para buscar usage
      const usageResult = await cloudinary.api.usage();
      cloudinaryData = usageResult;
    } catch (error) {
      console.error('Erro ao buscar uso do Cloudinary:', error);
    }

    // 2. Calcular uso do banco de dados Supabase
    const supabaseData = {
      tables: [] as { name: string; count: number }[],
      totalRecords: 0,
      estimatedSize: 0,
    };

    try {
      // Contar registros de cada tabela
      const tables = ['configuracoes', 'galerias', 'galeria_fotos', 'equipe', 'usuarios'];
      
      for (const table of tables) {
        const { count } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        supabaseData.tables.push({ name: table, count: count || 0 });
        supabaseData.totalRecords += count || 0;
      }

      // Estimativa de tamanho (media de 2KB por registro)
      supabaseData.estimatedSize = supabaseData.totalRecords * 2048;
    } catch (error) {
      console.error('Erro ao calcular uso do Supabase:', error);
    }

    // 3. Formatar resposta
    const usage = {
      cloudinary: cloudinaryData ? {
        storage: {
          used: cloudinaryData.storage?.usage || 0,
          limit: LIMITS.cloudinary.storage,
          usedFormatted: formatBytes(cloudinaryData.storage?.usage || 0),
          limitFormatted: '25 GB',
          percentage: Math.round(((cloudinaryData.storage?.usage || 0) / LIMITS.cloudinary.storage) * 100),
        },
        bandwidth: {
          used: cloudinaryData.bandwidth?.usage || 0,
          limit: LIMITS.cloudinary.bandwidth,
          usedFormatted: formatBytes(cloudinaryData.bandwidth?.usage || 0),
          limitFormatted: '25 GB',
          percentage: Math.round(((cloudinaryData.bandwidth?.usage || 0) / LIMITS.cloudinary.bandwidth) * 100),
        },
        credits: {
          used: cloudinaryData.credits?.usage || 0,
          limit: cloudinaryData.credits?.limit || LIMITS.cloudinary.credits,
          percentage: Math.round(((cloudinaryData.credits?.usage || 0) / (cloudinaryData.credits?.limit || LIMITS.cloudinary.credits)) * 100),
        },
        resources: cloudinaryData.resources || 0,
        plan: cloudinaryData.plan || 'Free',
        lastUpdated: cloudinaryData.last_updated || new Date().toISOString(),
      } : null,
      
      supabase: {
        database: {
          used: supabaseData.estimatedSize,
          limit: LIMITS.supabase.database,
          usedFormatted: formatBytes(supabaseData.estimatedSize),
          limitFormatted: '500 MB',
          percentage: Math.round((supabaseData.estimatedSize / LIMITS.supabase.database) * 100),
        },
        tables: supabaseData.tables,
        totalRecords: supabaseData.totalRecords,
      },

      vercel: {
        bandwidth: {
          limit: LIMITS.vercel.bandwidth,
          limitFormatted: '100 GB',
          note: 'Consulte o dashboard da Vercel para uso real',
        },
        buildMinutes: {
          limit: LIMITS.vercel.buildMinutes,
          limitFormatted: '6.000 min',
          note: 'Consulte o dashboard da Vercel para uso real',
        },
      },

      limits: LIMITS,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(usage);
  } catch (error) {
    console.error('Erro ao buscar uso:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar informacoes de uso' },
      { status: 500 }
    );
  }
}
