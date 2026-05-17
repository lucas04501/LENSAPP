export interface Quote {
  text: string;
  author: string;
  category: "Disciplina" | "Neurociência" | "Mindset";
}

export const QUOTES: Quote[] = [
  // Disciplina e Constância (20)
  { text: "A disciplina é a ponte entre metas e realizações.", author: "Jim Rohn", category: "Disciplina" },
  { text: "Nós somos o que fazemos repetidamente. A excelência, portanto, não é um ato, mas um hábito.", author: "Aristóteles", category: "Disciplina" },
  { text: "O sucesso é a soma de pequenos esforços repetidos dia após dia.", author: "Robert Collier", category: "Disciplina" },
  { text: "A disciplina é a maior forma de amor-próprio.", author: "Autor Desconhecido", category: "Disciplina" },
  { text: "Constância é o que transforma o comum em extraordinário.", author: "LENS", category: "Disciplina" },
  { text: "Não pare quando estiver cansado, pare quando tiver terminado.", author: "David Goggins", category: "Disciplina" },
  { text: "A motivação faz você começar, o hábito faz você continuar.", author: "Jim Ryun", category: "Disciplina" },
  { text: "Disciplina não é privação, é libertação.", author: "Autor Desconhecido", category: "Disciplina" },
  { text: "Vença a manhã e você vencerá o dia.", author: "Jocko Willink", category: "Disciplina" },
  { text: "O compromisso é o que separa os sonhadores dos realizadores.", author: "Autor Desconhecido", category: "Disciplina" },
  { text: "Pequenas vitórias diárias levam a grandes triunfos anuais.", author: "Robin Sharma", category: "Disciplina" },
  { text: "A vontade de se preparar deve ser maior que a vontade de vencer.", author: "Bobby Knight", category: "Disciplina" },
  { text: "Disciplina é fazer o que precisa ser feito, mesmo quando você não quer.", author: "Autor Desconhecido", category: "Disciplina" },
  { text: "Onde a disciplina falha, o progresso estaciona.", author: "LENS", category: "Disciplina" },
  { text: "A dor da disciplina é menor que a dor do arrependimento.", author: "Jim Rohn", category: "Disciplina" },
  { text: "Foco é dizer não para centenas de boas ideias.", author: "Steve Jobs", category: "Disciplina" },
  { text: "A constância é a mãe da maestria.", author: "Robin Sharma", category: "Disciplina" },
  { text: "Seja mais forte que sua melhor desculpa.", author: "Autor Desconhecido", category: "Disciplina" },
  { text: "A disciplina supera o talento quando o talento não tem disciplina.", author: "Tim Notke", category: "Disciplina" },
  { text: "A repetição é a linguagem da maestria.", author: "Autor Desconhecido", category: "Disciplina" },

  // Neurociência e Hábitos (20)
  { text: "Neurônios que disparam juntos, conectam-se juntos.", author: "Donald Hebb", category: "Neurociência" },
  { text: "Os hábitos são o juro composto do autoaperfeiçoamento.", author: "James Clear", category: "Neurociência" },
  { text: "Seu cérebro é uma máquina de economia de energia; ele ama rotinas.", author: "Charles Duhigg", category: "Neurociência" },
  { text: "A neuroplasticidade é a prova de que você nunca está preso a quem é agora.", author: "LENS", category: "Neurociência" },
  { text: "Mude o ambiente e você mudará o comportamento.", author: "B.F. Skinner", category: "Neurociência" },
  { text: "Um hábito é um comportamento que foi repetido vezes suficientes para se tornar automático.", author: "James Clear", category: "Neurociência" },
  { text: "O cérebro não diferencia um hábito bom de um ruim.", author: "Charles Duhigg", category: "Neurociência" },
  { text: "A dopamina é sobre antecipação, não apenas sobre prazer.", author: "Robert Sapolsky", category: "Neurociência" },
  { text: "Crie fricção para hábitos ruins e facilite os hábitos bons.", author: "James Clear", category: "Neurociência" },
  { text: "O pré-frontal planeja, os gânglios da base executam.", author: "LENS", category: "Neurociência" },
  { text: "Pequenas mudanças no sistema geram grandes mudanças no resultado.", author: "James Clear", category: "Neurociência" },
  { text: "A resistência mental é construída no desconforto.", author: "Andrew Huberman", category: "Neurociência" },
  { text: "Seu cérebro aprende com o que você faz, não com o que você diz que vai fazer.", author: "Autor Desconhecido", category: "Neurociência" },
  { text: "O sono é o preço que pagamos pela plasticidade diurna.", author: "Giulio Tononi", category: "Neurociência" },
  { text: "Foque no processo, o resultado é um subproduto biológico.", author: "Autor Desconhecido", category: "Neurociência" },
  { text: "A atenção é a moeda mais valiosa do seu cérebro.", author: "LENS", category: "Neurociência" },
  { text: "O córtex cingulado anterior anterior é o músculo da força de vontade.", author: "Andrew Huberman", category: "Neurociência" },
  { text: "A cada repetição, você envia um voto para o tipo de pessoa que quer ser.", author: "James Clear", category: "Neurociência" },
  { text: "Ritmos circadianos estáveis criam mentes estáveis.", author: "Autor Desconhecido", category: "Neurociência" },
  { text: "A neurogênese continua enquanto houver aprendizado.", author: "Autor Desconhecido", category: "Neurociência" },

  // Mindset e Transformação (20)
  { text: "A mente que se abre a uma nova ideia jamais voltará ao seu tamanho original.", author: "Albert Einstein", category: "Mindset" },
  { text: "Se você quer o que nunca teve, deve fazer o que nunca fez.", author: "Thomas Jefferson", category: "Mindset" },
  { text: "Sua percepção do mundo é o reflexo do seu estado interno.", author: "LENS", category: "Mindset" },
  { text: "Onde o foco vai, a energia flui.", author: "Tony Robbins", category: "Mindset" },
  { text: "O fracasso é apenas a oportunidade de começar de novo, de forma mais inteligente.", author: "Henry Ford", category: "Mindset" },
  { text: "Seja o arquiteto do seu futuro, não o prisioneiro do seu passado.", author: "Autor Desconhecido", category: "Mindset" },
  { text: "A jornada de mil milhas começa com um único passo.", author: "Lao Tzu", category: "Mindset" },
  { text: "O que você foca, expande.", author: "Autor Desconhecido", category: "Mindset" },
  { text: "Sua vida muda quando você muda suas prioridades.", author: "LENS", category: "Mindset" },
  { text: "Acredite que você pode e você estará no meio do caminho.", author: "Theodore Roosevelt", category: "Mindset" },
  { text: "Limitações vivem apenas em nossas mentes.", author: "Jamie Paolinetti", category: "Mindset" },
  { text: "O impossível é apenas uma opinião.", author: "Paulo Coelho", category: "Mindset" },
  { text: "Tudo o que você sempre quis está do outro lado do medo.", author: "George Addair", category: "Mindset" },
  { text: "Seja impaciente com as ações, mas paciente com os resultados.", author: "Naval Ravikant", category: "Mindset" },
  { text: "A qualidade da sua vida é a qualidade dos seus pensamentos.", author: "Marco Aurélio", category: "Mindset" },
  { text: "Sua identidade segue seus hábitos.", author: "LENS", category: "Mindset" },
  { text: "O obstáculo é o caminho.", author: "Ryan Holiday", category: "Mindset" },
  { text: "Seja você a mudança que deseja ver no mundo.", author: "Mahatma Gandhi", category: "Mindset" },
  { text: "O único lugar onde o sucesso vem antes do trabalho é no dicionário.", author: "Vidal Sassoon", category: "Mindset" },
  { text: "Você é o mestre do seu destino, o capitão da sua alma.", author: "William Ernest Henley", category: "Mindset" },
];

export function getQuoteOfTheDay(): Quote {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  const index = dayOfYear % QUOTES.length;
  return QUOTES[index];
}
