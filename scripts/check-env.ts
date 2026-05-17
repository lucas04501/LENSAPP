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
  console.log('🔍 Validando variáveis de ambiente...');
  
  const missing = requiredEnvVars.filter((name) => !process.env[name]);

  if (missing.length > 0) {
    console.error('❌ Erro: As seguintes variáveis de ambiente estão faltando:');
    missing.forEach((name) => console.error(`   - ${name}`));
    process.exit(1);
  }

  console.log('✅ Todas as variáveis obrigatórias estão presentes.');
}

checkEnv();
