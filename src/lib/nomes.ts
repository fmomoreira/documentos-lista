export interface Pendencia {
  nome: string;
  pendencia: string;
}

const EXCECOES = ['da', 'de', 'do', 'das', 'dos'];

export function formatarNome(nome: string): string {
  return nome
    .toLowerCase()
    .split(' ')
    .map((palavra, index) => {
      if (index > 0 && EXCECOES.includes(palavra)) return palavra;
      return palavra.charAt(0).toUpperCase() + palavra.slice(1);
    })
    .join(' ');
}

export function normalizarBusca(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function letraInicial(nome: string): string {
  return nome
    .charAt(0)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
}

export function prepararNomes(nomesBrutos: string[]): string[] {
  return [...new Set(nomesBrutos.map(formatarNome))].sort((a, b) =>
    a.localeCompare(b, 'pt-BR'),
  );
}

export function agruparNomes(nomes: string[]): Record<string, string[]> {
  return nomes.reduce<Record<string, string[]>>((acc, nome) => {
    const letra = letraInicial(nome);
    if (!acc[letra]) acc[letra] = [];
    acc[letra].push(nome);
    return acc;
  }, {});
}

export function agruparPendencias(pendencias: Pendencia[]): Record<string, Pendencia[]> {
  return pendencias.reduce<Record<string, Pendencia[]>>((acc, item) => {
    const letra = letraInicial(item.nome);
    if (!acc[letra]) acc[letra] = [];
    acc[letra].push(item);
    return acc;
  }, {});
}
