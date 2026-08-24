import { LOGO_OG, RETIRADA, SITE_NAME, SITE_URL } from './site';

export function buildJsonLd(totalNomes: number, dateModified: string) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${SITE_URL}/#webpage`,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        description:
          'Consulta oficial de cidadãos com Carteira de Identidade Nacional (CIN) pronta para retirada em São José do Belmonte, Pernambuco.',
        inLanguage: 'pt-BR',
        dateModified,
        isPartOf: {
          '@type': 'WebSite',
          name: 'Documentação - Prefeitura de São José do Belmonte',
          url: SITE_URL,
        },
        about: {
          '@type': 'GovernmentService',
          name: 'Retirada de Carteira de Identidade Nacional (CIN)',
        },
        speakable: {
          '@type': 'SpeakableSpecification',
          cssSelector: ['h1', '#listaNomes', 'main section p'],
        },
      },
      {
        '@type': 'GovernmentService',
        name: 'Entrega de Nova Carteira de Identidade Nacional (CIN)',
        provider: {
          '@type': 'GovernmentOrganization',
          name: 'Prefeitura Municipal de São José do Belmonte',
          url: 'https://saojosedobelmonte.pe.gov.br',
          logo: LOGO_OG,
        },
        description:
          'Serviço de consulta e retirada do novo RG (CIN) para moradores de São José do Belmonte, PE.',
        areaServed: {
          '@type': 'City',
          name: 'São José do Belmonte',
          addressRegion: 'PE',
          addressCountry: 'BR',
        },
        serviceLocation: {
          '@type': 'Place',
          name: RETIRADA.local,
          address: {
            '@type': 'PostalAddress',
            streetAddress: RETIRADA.endereco,
            addressLocality: 'São José do Belmonte',
            addressRegion: 'PE',
            postalCode: '56950-000',
            addressCountry: 'BR',
          },
        },
        hoursAvailable: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '08:00',
          closes: '13:00',
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Onde retirar o RG pronto em São José do Belmonte?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: `A retirada é feita no ${RETIRADA.local}, na ${RETIRADA.endereco}, ${RETIRADA.referencia}.`,
            },
          },
          {
            '@type': 'Question',
            name: 'Qual o horário para retirar o RG em São José do Belmonte?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: `O atendimento ocorre de segunda a sexta-feira, das 08:00 às 13:00.`,
            },
          },
          {
            '@type': 'Question',
            name: 'Como saber se meu RG está pronto em São José do Belmonte?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Acesse esta página oficial e use a barra de busca para pesquisar seu nome completo.',
            },
          },
          {
            '@type': 'Question',
            name: 'O que fazer se meu nome não está na lista de RGs prontos?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Verifique a seção de Pendência de Documentos nesta página.',
            },
          },
        ],
      },
      {
        '@type': 'ItemList',
        name: 'Lista de RGs Prontos - São José do Belmonte',
        description: 'Cidadãos com Carteira de Identidade Nacional (CIN) pronta para retirada',
        numberOfItems: totalNomes,
      },
    ],
  };
}
