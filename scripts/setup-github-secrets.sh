#!/usr/bin/env bash
set -euo pipefail

# Configura os secrets do GitHub Actions para deploy no servidor.
# Pré-requisito: gh auth login

REPO="${1:-fmomoreira/documentos-lista}"
SSH_KEY="${SSH_KEY:-$HOME/.ssh/bel_deploy}"

if ! command -v gh >/dev/null 2>&1; then
  echo "Instale o GitHub CLI: brew install gh"
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "Faça login primeiro: gh auth login"
  exit 1
fi

if [[ ! -f "$SSH_KEY" ]]; then
  echo "Chave SSH não encontrada: $SSH_KEY"
  exit 1
fi

echo "Configurando secrets em $REPO ..."

gh secret set SSH_PRIVATE_KEY --repo "$REPO" < "$SSH_KEY"
gh secret set SSH_HOST --repo "$REPO" --body "72.62.10.221"
gh secret set SSH_USER --repo "$REPO" --body "root"
gh secret set DEPLOY_PATH --repo "$REPO" --body "/var/www/documentacao.saojosedobelmonte.pe.gov.br"

echo ""
echo "Secrets SSH configurados."
echo "Opcionais (API no build):"
echo "  gh secret set LISTA_API_URL --repo $REPO --body 'https://sua-api/...'"
echo "  gh secret set LISTA_API_KEY --repo $REPO --body 'sua-chave'"
echo ""
echo "Pronto. Push na main dispara o deploy."
