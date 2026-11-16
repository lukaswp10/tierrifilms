import { neon, types as tiposPg } from '@neondatabase/serverless';
import { revalidatePath } from 'next/cache';

// Banco do site (Neon Postgres). Só roda no servidor: rotas de API e
// componentes de servidor. O navegador nunca fala com o banco.
//
// A interface imita o pedaço do supabase-js que o site já usava
// (from/select/eq/order/single/insert/update/upsert/delete), devolvendo
// { data, error, count }, para a troca do Supabase não mudar o
// comportamento das rotas. Tudo vira SQL parametrizado; nomes de tabela e de
// coluna passam por lista/regex, nunca vão crus para a consulta.

const TABELAS = [
  'usuarios',
  'configuracoes',
  'categorias',
  'galerias',
  'galeria_fotos',
  'equipe',
  'parceiros',
  'leads',
  'lead_interacoes',
  'whatsapp_templates',
] as const;
type Tabela = (typeof TABELAS)[number];

// Tabelas que aparecem no site público: escrever nelas pede página nova.
const TABELAS_DO_SITE: readonly Tabela[] = ['configuracoes', 'categorias', 'galerias', 'galeria_fotos', 'equipe', 'parceiros'];

// (vao em cada consulta: no driver 1.2 a opcao na conexao nao vale para .query())
// Mesmos formatos que o Supabase devolvia: data como 'AAAA-MM-DD',
// timestamp como ISO ('...T...Z'), numeric e bigint como número.
const OID = { int8: 20, numeric: 1700, date: 1082, timestamp: 1114, timestamptz: 1184 };
const leitores = {
  getTypeParser(id: number, formato?: 'text' | 'binary') {
    if (id === OID.date) return (v: string) => v;
    if (id === OID.timestamptz) return (v: string) => new Date(v).toISOString();
    if (id === OID.timestamp) return (v: string) => new Date(v.replace(' ', 'T') + 'Z').toISOString();
    if (id === OID.numeric || id === OID.int8) return (v: string) => Number(v);
    return tiposPg.getTypeParser(id, formato);
  },
};

let conexao: ReturnType<typeof neon> | null = null;
function banco() {
  if (!conexao) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL nao configurada');
    conexao = neon(url);
  }
  return conexao;
}

/** SQL direto (parametrizado com $1, $2...). Para consultas que o construtor não cobre. */
export async function consulta<T = Record<string, unknown>>(texto: string, parametros: unknown[] = []): Promise<T[]> {
  return (await banco().query(texto, parametros, { types: leitores })) as T[];
}

export type ErroDb = { message: string; code?: string };
export type Resultado<T> = { data: T | null; error: ErroDb | null; count: number | null };

const NOME = /^[a-z_][a-z0-9_]*$/;
function coluna(nome: string): string {
  const n = nome.trim();
  if (!NOME.test(n)) throw new Error(`coluna invalida: ${nome}`);
  return `"${n}"`;
}
function colunas(lista: string): string {
  const l = lista.trim();
  if (l === '*' || l === '') return '*';
  return l.split(',').map(coluna).join(', ');
}

type Filtro = { col: string; op: '=' | '>=' | '<=' | 'in' | 'busca'; valor: unknown };
type Acao = 'select' | 'insert' | 'update' | 'upsert' | 'delete';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class Consulta<Linha = any, Saida = Linha[]> implements PromiseLike<Resultado<Saida>> {
  private acao: Acao = 'select';
  private cols = '*';
  private contar = false;
  private soContagem = false;
  private devolver = false;
  private umaLinha = false;
  private filtros: Filtro[] = [];
  private ordens: { col: string; asc: boolean }[] = [];
  private limite: number | null = null;
  private linhas: Record<string, unknown>[] = [];
  private conflito: string | null = null;

  constructor(private tabela: Tabela) {}

  select(cols = '*', opcoes?: { count?: 'exact'; head?: boolean }): Consulta<Linha, Saida> {
    this.cols = cols;
    if (this.acao === 'select') {
      this.contar = opcoes?.count === 'exact';
      this.soContagem = !!opcoes?.head;
    } else {
      this.devolver = true;
    }
    return this;
  }
  insert(valores: Record<string, unknown> | Record<string, unknown>[]): Consulta<Linha, Saida> {
    this.acao = 'insert';
    this.linhas = Array.isArray(valores) ? valores : [valores];
    return this;
  }
  upsert(valores: Record<string, unknown>, opcoes: { onConflict: string }): Consulta<Linha, Saida> {
    this.acao = 'upsert';
    this.linhas = [valores];
    this.conflito = opcoes.onConflict;
    return this;
  }
  update(valores: Record<string, unknown>): Consulta<Linha, Saida> {
    this.acao = 'update';
    this.linhas = [valores];
    return this;
  }
  delete(): Consulta<Linha, Saida> {
    this.acao = 'delete';
    return this;
  }
  eq(col: string, valor: unknown): Consulta<Linha, Saida> {
    this.filtros.push({ col, op: '=', valor });
    return this;
  }
  gte(col: string, valor: unknown): Consulta<Linha, Saida> {
    this.filtros.push({ col, op: '>=', valor });
    return this;
  }
  lte(col: string, valor: unknown): Consulta<Linha, Saida> {
    this.filtros.push({ col, op: '<=', valor });
    return this;
  }
  in(col: string, valores: unknown[]): Consulta<Linha, Saida> {
    this.filtros.push({ col, op: 'in', valor: valores });
    return this;
  }
  /** Linhas em que QUALQUER das colunas contém o termo (sem diferenciar maiúsculas). */
  buscar(cols: string[], termo: string): Consulta<Linha, Saida> {
    this.filtros.push({ col: cols.join(','), op: 'busca', valor: termo });
    return this;
  }
  order(col: string, opcoes?: { ascending?: boolean }): Consulta<Linha, Saida> {
    this.ordens.push({ col, asc: opcoes?.ascending !== false });
    return this;
  }
  limit(n: number): Consulta<Linha, Saida> {
    this.limite = Number.isFinite(n) && n > 0 ? Math.floor(n) : null;
    return this;
  }
  single(): Consulta<Linha, Linha> {
    this.umaLinha = true;
    return this as unknown as Consulta<Linha, Linha>;
  }

  then<A = Resultado<Saida>, B = never>(
    ok?: ((r: Resultado<Saida>) => A | PromiseLike<A>) | null,
    falha?: ((e: unknown) => B | PromiseLike<B>) | null,
  ): PromiseLike<A | B> {
    return this.executar().then(ok, falha);
  }

  private onde(params: unknown[]): string {
    if (this.filtros.length === 0) return '';
    const partes = this.filtros.map((f) => {
      if (f.op === 'in') {
        const lista = f.valor as unknown[];
        if (lista.length === 0) return 'false';
        params.push(lista);
        return `${coluna(f.col)} = ANY($${params.length})`;
      }
      if (f.op === 'busca') {
        const termo = String(f.valor).replace(/[\\%_]/g, (c) => '\\' + c);
        params.push(`%${termo}%`);
        const n = params.length;
        return '(' + f.col.split(',').map((c) => `${coluna(c)} ILIKE $${n}`).join(' OR ') + ')';
      }
      if (f.valor === null) return `${coluna(f.col)} IS NULL`;
      params.push(f.valor);
      return `${coluna(f.col)} ${f.op} $${params.length}`;
    });
    return ' WHERE ' + partes.join(' AND ');
  }

  private montar(): { texto: string; params: unknown[] } {
    const t = `"${this.tabela}"`;
    const params: unknown[] = [];
    const retorno = this.devolver ? ` RETURNING ${colunas(this.cols)}` : '';

    if (this.acao === 'select') {
      if (this.soContagem) return { texto: `SELECT count(*)::int AS count FROM ${t}${this.onde(params)}`, params };
      let texto = `SELECT ${colunas(this.cols)}${this.contar ? ', count(*) OVER()::int AS "__total"' : ''} FROM ${t}${this.onde(params)}`;
      if (this.ordens.length) texto += ' ORDER BY ' + this.ordens.map((o) => `${coluna(o.col)} ${o.asc ? 'ASC' : 'DESC'}`).join(', ');
      if (this.limite) texto += ` LIMIT ${this.limite}`;
      return { texto, params };
    }

    if (this.acao === 'insert' || this.acao === 'upsert') {
      const linhas = this.linhas.map(semIndefinidos);
      const nomes = [...new Set(linhas.flatMap((l) => Object.keys(l)))];
      if (nomes.length === 0) return { texto: `INSERT INTO ${t} DEFAULT VALUES${retorno}`, params };
      const valores = linhas.map(
        (l) =>
          '(' +
          nomes
            .map((n) => {
              if (!(n in l)) return 'DEFAULT';
              params.push(l[n]);
              return `$${params.length}`;
            })
            .join(', ') +
          ')',
      );
      let texto = `INSERT INTO ${t} (${nomes.map(coluna).join(', ')}) VALUES ${valores.join(', ')}`;
      if (this.acao === 'upsert') {
        const alvo = coluna(this.conflito!);
        const atualizar = nomes.filter((n) => coluna(n) !== alvo);
        texto += ` ON CONFLICT (${alvo}) ` + (atualizar.length ? 'DO UPDATE SET ' + atualizar.map((n) => `${coluna(n)} = EXCLUDED.${coluna(n)}`).join(', ') : 'DO NOTHING');
      }
      return { texto: texto + retorno, params };
    }

    // update / delete sem filtro mudaria a tabela inteira: recusa.
    if (this.filtros.length === 0) throw new Error(`${this.acao} sem filtro em ${this.tabela}`);
    if (this.acao === 'delete') {
      const onde = this.onde(params);
      return { texto: `DELETE FROM ${t}${onde}${retorno}`, params };
    }
    const dados = semIndefinidos(this.linhas[0]);
    const nomes = Object.keys(dados);
    if (nomes.length === 0) {
      // Nada para mudar: devolve a linha como está.
      const onde = this.onde(params);
      return { texto: `SELECT ${colunas(this.cols)} FROM ${t}${onde}`, params };
    }
    const sets = nomes.map((n) => {
      params.push(dados[n]);
      return `${coluna(n)} = $${params.length}`;
    });
    const onde = this.onde(params);
    return { texto: `UPDATE ${t} SET ${sets.join(', ')}${onde}${retorno}`, params };
  }

  private async executar(): Promise<Resultado<Saida>> {
    try {
      const { texto, params } = this.montar();
      const linhas = (await banco().query(texto, params, { types: leitores })) as Record<string, unknown>[];

      if (this.acao !== 'select') {
        if (TABELAS_DO_SITE.includes(this.tabela)) atualizarSite();
        if (!this.devolver) return { data: null, error: null, count: null };
      }
      if (this.soContagem) return { data: null, error: null, count: Number(linhas[0]?.count ?? 0) };

      let count: number | null = null;
      if (this.contar) {
        count = linhas.length ? Number(linhas[0].__total) : 0;
        for (const l of linhas) delete l.__total;
      }
      if (this.umaLinha) {
        if (linhas.length !== 1) {
          return { data: null, error: { message: `esperava 1 linha, veio ${linhas.length}`, code: 'PGRST116' }, count };
        }
        return { data: linhas[0] as Saida, error: null, count };
      }
      return { data: linhas as Saida, error: null, count };
    } catch (e) {
      const erro = e as { message?: string; code?: string };
      return { data: null, error: { message: erro.message ?? String(e), code: erro.code }, count: null };
    }
  }
}

function semIndefinidos(o: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined));
}

/** Depois de mudar conteúdo pelo painel, o site público mostra a versão nova no próximo acesso. */
function atualizarSite() {
  try {
    revalidatePath('/', 'layout');
  } catch {
    // fora de uma requisição (ex.: script): não há página para renovar
  }
}

export const db = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  from<Linha = any>(tabela: Tabela): Consulta<Linha> {
    if (!TABELAS.includes(tabela)) throw new Error(`tabela desconhecida: ${tabela}`);
    return new Consulta<Linha>(tabela);
  },
};
