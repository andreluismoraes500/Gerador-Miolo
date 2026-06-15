export const FERIADOS = [
  { mes: 1, dia: 1, nome: "Confraternização Universal" },
  { mes: 4, dia: 21, nome: "Tiradentes" },
  { mes: 5, dia: 1, nome: "Dia do Trabalho" },
  { mes: 9, dia: 7, nome: "Independência do Brasil" },
  { mes: 10, dia: 12, nome: "Nossa Senhora Aparecida" },
  { mes: 11, dia: 2, nome: "Finados" },
  { mes: 11, dia: 15, nome: "Proclamação da República" },
  { mes: 11, dia: 20, nome: "Consciência Negra" },
  { mes: 12, dia: 25, nome: "Natal" },
];

const COMEMORATIVAS_FIXAS = [
  { mes: 3, dia: 8, nome: "Dia Internacional da Mulher" },
  { mes: 4, dia: 23, nome: "Dia de São Jorge" }, // Mantive conforme seu primeiro código
  { mes: 6, dia: 12, nome: "Dia dos Namorados" },
  { mes: 10, dia: 12, nome: "Dia das Crianças" },
  { mes: 10, dia: 15, nome: "Dia do Professor" },
  { mes: 10, dia: 28, nome: "Dia do Servidor Público" },
];

// Algoritmo matemático para calcular o Domingo de Páscoa de qualquer ano
function calcularPascoa(ano) {
  const a = ano % 19;
  const b = Math.floor(ano / 100);
  const c = ano % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mes = Math.floor((h + l - 7 * m + 114) / 31);
  const dia = ((h + l - 7 * m + 114) % 31) + 1;

  return new Date(ano, mes - 1, dia);
}

// Retorna um objeto com as datas móveis baseadas na Páscoa
function obterDatasMoveisEclesiasticas(ano) {
  const pascoa = calcularPascoa(ano);

  // Auxiliar para clonar e adicionar/subtrair dias
  const adicionarDias = (dataBase, dias) => {
    const novaData = new Date(dataBase);
    novaData.setDate(novaData.getDate() + dias);
    return novaData;
  };

  return {
    carnaval: adicionarDias(pascoa, -47),
    cinzas: adicionarDias(pascoa, -46),
    sextaSanta: adicionarDias(pascoa, -2),
    corpusChristi: adicionarDias(pascoa, 60),
  };
}

function segundoDomingo(ano, mes) {
  const primeiroDia = new Date(ano, mes, 1);
  const primeiroDomingo = 1 + ((7 - primeiroDia.getDay()) % 7);
  return { mes, dia: primeiroDomingo + 7 };
}

export function getComemorativa(date) {
  const mes = date.getMonth();
  const dia = date.getDate();
  const ano = date.getFullYear();

  // Se já for um feriado oficial (fixo ou móvel), não marca como comemorativa
  if (getFeriado(date)) return null;

  // 1. Checa as datas comemorativas fixas
  const fixa = COMEMORATIVAS_FIXAS.find(
    (c) => c.mes === mes + 1 && c.dia === dia,
  );
  if (fixa) return fixa.nome;

  // 2. Checa as datas comemorativas móveis (Carnaval e Cinzas entram aqui para destaque sutil)
  const moveis = obterDatasMoveisEclesiasticas(ano);
  if (moveis.carnaval.getMonth() === mes && moveis.carnaval.getDate() === dia)
    return "Carnaval";
  if (moveis.cinzas.getMonth() === mes && moveis.cinzas.getDate() === dia)
    return "Quarta-feira de Cinzas";

  // 3. Checa os domingos de Mães e Pais
  const maes = segundoDomingo(ano, 4);
  const pais = segundoDomingo(ano, 7);
  if (maes.mes === mes && maes.dia === dia) return "Dia das Mães";
  if (pais.mes === mes && pais.dia === dia) return "Dia dos Pais";

  return null;
}

export function getFeriado(date) {
  const mes = date.getMonth();
  const dia = date.getDate();
  const ano = date.getFullYear();

  // 1. Procura nos feriados nacionais fixos do seu array
  const fixo = FERIADOS.find((f) => f.mes === mes + 1 && f.dia === dia);
  if (fixo) return fixo;

  // 2. Procura nos feriados móveis oficiais (Sexta-feira Santa e Corpus Christi)
  const moveis = obterDatasMoveisEclesiasticas(ano);
  if (
    moveis.sextaSanta.getMonth() === mes &&
    moveis.sextaSanta.getDate() === dia
  ) {
    return { mes: mes + 1, dia, nome: "Sexta-feira Santa" };
  }
  if (
    moveis.corpusChristi.getMonth() === mes &&
    moveis.corpusChristi.getDate() === dia
  ) {
    return { mes: mes + 1, dia, nome: "Corpus Christi" };
  }

  return null;
}

export function gerarHorarios() {
  const horarios = [];
  for (let h = 7; h <= 20; h++) {
    for (let m = 0; m < 60; m += 30) {
      if (h === 20 && m > 0) break;
      horarios.push(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
      );
    }
  }
  return horarios;
}

export function gerarDiasDoMes(ano, mes) {
  const dias = [];
  const ultimoDia = new Date(ano, mes + 1, 0).getDate();
  for (let d = 1; d <= ultimoDia; d++) dias.push(new Date(ano, mes, d));
  return dias;
}

export function gerarDiasDoAno(ano) {
  const dias = [];
  for (let m = 0; m < 12; m++) {
    const ultimoDia = new Date(ano, m + 1, 0).getDate();
    for (let d = 1; d <= ultimoDia; d++) dias.push(new Date(ano, m, d));
  }
  return dias;
}
