import html2canvas from 'html2canvas';
import {
  AlertTriangle,
  Clock,
  createIcons,
  Fingerprint,
  Loader2,
  MapPin,
  QrCode,
  Search,
  SearchX,
  Share,
  User,
  XCircle,
} from 'lucide';
import { SITE_URL } from '../lib/site';

function initIcons() {
  createIcons({
    icons: {
      Fingerprint,
      User,
      QrCode,
      MapPin,
      Clock,
      Search,
      XCircle,
      AlertTriangle,
      SearchX,
      Share,
      Loader2,
    },
  });
}

function filtrarListas(termo: string) {
  const emptyState = document.getElementById('emptyState');
  const itens = document.querySelectorAll<HTMLElement>('[data-search-text]');
  let visiveis = 0;

  itens.forEach((item) => {
    const texto = item.dataset.searchText ?? '';
    const match = !termo || texto.includes(termo);
    item.classList.toggle('hidden', !match);
    if (match) visiveis++;
  });

  document.querySelectorAll<HTMLElement>('[data-grupo-lista]').forEach((grupo) => {
    const temVisivel = [...grupo.querySelectorAll('.item-lista')].some(
      (li) => !li.classList.contains('hidden'),
    );
    grupo.classList.toggle('hidden', !temVisivel);
  });

  document.querySelectorAll<HTMLElement>('[data-grupo-pendencia]').forEach((grupo) => {
    const temVisivel = [...grupo.querySelectorAll('.item-pendencia')].some(
      (li) => !li.classList.contains('hidden'),
    );
    grupo.classList.toggle('hidden', !temVisivel);
  });

  if (emptyState) {
    emptyState.classList.toggle('hidden', visiveis > 0 || !termo);
  }
}

function initBusca() {
  const input = document.getElementById('searchInput') as HTMLInputElement | null;
  const btnLimpar = document.getElementById('clearSearchBtn');
  if (!input || !btnLimpar) return;

  input.addEventListener('input', () => {
    const termo = input.value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    btnLimpar.classList.toggle('hidden', termo.length === 0);
    filtrarListas(termo);
  });

  btnLimpar.addEventListener('click', () => {
    input.value = '';
    btnLimpar.classList.add('hidden');
    filtrarListas('');
    input.focus();
  });
}

async function compartilhar() {
  const btn = document.getElementById('shareBtn');
  const btnText = document.getElementById('shareBtnText');
  const shareIcon = document.getElementById('shareIcon');
  const loadingIcon = document.getElementById('loadingIcon');
  if (!btn || !btnText || !shareIcon || !loadingIcon) return;

  const originalText = btnText.textContent ?? 'Avisar Amigos';
  const dados = {
    title: 'RGs Prontos - São José do Belmonte',
    text: 'Seu Novo RG está pronto! Confira a lista de pessoas que já podem retirar o documento no Centro Comercial Adeilson Alves Feitosa.',
    url: `${SITE_URL}/`,
  };

  function restaurarBotao() {
    btnText.textContent = originalText;
    shareIcon.classList.remove('hidden');
    loadingIcon.classList.add('hidden');
    btn.classList.remove('pointer-events-none', 'opacity-90');
  }

  function copiarTexto() {
    navigator.clipboard.writeText(`${dados.text} Veja a lista: ${dados.url}`).then(() => {
      alert('Link copiado! Envie para seus contatos e nas redes sociais.');
    });
  }

  try {
    btnText.textContent = 'Preparando card...';
    shareIcon.classList.add('hidden');
    loadingIcon.classList.remove('hidden');
    btn.classList.add('pointer-events-none', 'opacity-90');

    const captureArea = document.getElementById('capture-area');
    const logoCapture = document.getElementById('logo-for-capture');
    if (!captureArea || !logoCapture) throw new Error('Área de captura não encontrada');

    logoCapture.classList.remove('hidden');
    logoCapture.classList.add('flex');
    await new Promise((resolve) => setTimeout(resolve, 200));

    const canvas = await html2canvas(captureArea, {
      scale: 2,
      backgroundColor: '#f5f5f7',
      useCORS: true,
      logging: false,
    });

    logoCapture.classList.add('hidden');
    logoCapture.classList.remove('flex');

    canvas.toBlob(async (blob) => {
      if (!blob) {
        restaurarBotao();
        return;
      }

      const file = new File([blob], 'RG-Belmonte.png', { type: 'image/png' });

      try {
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ ...dados, files: [file] });
        } else if (navigator.share) {
          await navigator.share(dados);
        } else {
          copiarTexto();
        }
      } catch {
        copiarTexto();
      }

      restaurarBotao();
    }, 'image/png');
  } catch (error) {
    console.error('Erro ao gerar imagem:', error);
    if (navigator.share) {
      navigator.share(dados).catch(console.error);
    } else {
      copiarTexto();
    }
    restaurarBotao();
  }
}

export function initClient() {
  initIcons();
  initBusca();

  const shareBtn = document.getElementById('shareBtn');
  shareBtn?.addEventListener('click', compartilhar);
}
