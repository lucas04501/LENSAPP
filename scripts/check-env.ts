import { loadEnvConfig } from '@next/env';

/**
 * Script de validação de variáveis de ambiente pré-build
 */
const requiredEnvVars = [
  'DATABASE_URL',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'NEXT_PUBLIC_APP_URL',
];

function checkEnv() {
  // Carrega as variáveis de ambiente seguindo a lógica do Next.js
  // Isso garante que .env, .env.local, e variáveis do sistema sejam consideradas
  loadEnvConfig(process.cwd());

  console.log('🔍 Validando variáveis de ambiente...');
  
  const missing = requiredEnvVars.filter((name) => {
    const value = process.env[name];
    return !value || value.trim() === '';
  });

  if (missing.length > 0) {
    console.error('❌ Erro: As seguintes variáveis de ambiente estão faltando ou estão vazias:');
    missing.forEach((name) => console.error(`   - ${name}`));
    console.error('\n💡 Dica: Verifique se as variáveis estão configuradas no painel da Vercel');
    console.error('   ou no seu arquivo .env local.');
    process.exit(1);
  }

  console.log('✅ Todas as variáveis obrigatórias estão presentes.');
}

checkEnv();
