import type { Pendencia } from './nomes';
import fallback from '../data/lista-fallback.json';

export interface ListaDocumentos {
  prontos: string[];
  pendencias: Pendencia[];
  atualizadoEm: string;
  fonte: 'api' | 'fallback';
}

interface ApiListaResponse {
  prontos?: string[];
  nomes?: string[];
  pendencias?: Pendencia[];
  atualizadoEm?: string;
  updatedAt?: string;
}

function normalizarRespostaApi(data: ApiListaResponse): ListaDocumentos {
  const prontos = data.prontos ?? data.nomes ?? [];

  if (!Array.isArray(prontos) || !Array.isArray(data.pendencias)) {
    throw new Error('Resposta da API inválida: esperado { prontos/nomes: string[], pendencias: [] }');
  }

  return {
    prontos,
    pendencias: data.pendencias,
    atualizadoEm: data.atualizadoEm ?? data.updatedAt ?? new Date().toISOString().slice(0, 10),
    fonte: 'api',
  };
}

/**
 * Busca a lista no build time.
 * - Com LISTA_API_URL: consome a API e gera HTML estático
 * - Sem API ou em caso de falha: usa src/data/lista-fallback.json
 */
export async function getLista(): Promise<ListaDocumentos> {
  const apiUrl = process.env.LISTA_API_URL;

  if (apiUrl) {
    try {
      console.log(`📡 Buscando lista em: ${apiUrl}`);
      const response = await fetch(apiUrl, {
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = (await response.json()) as ApiListaResponse;
      const lista = normalizarRespostaApi(data);
      console.log(`✅ API: ${lista.prontos.length} prontos, ${lista.pendencias.length} pendências`);
      return lista;
    } catch (error) {
      console.warn('⚠️  Falha na API, usando fallback local:', error);
    }
  }

  console.log(`📄 Fallback: ${fallback.prontos.length} prontos, ${fallback.pendencias.length} pendências`);
  return {
    prontos: fallback.prontos,
    pendencias: fallback.pendencias,
    atualizadoEm: fallback.atualizadoEm,
    fonte: 'fallback',
  };
}
