// src/utils/talonarioStateSnapshot.js
//
// Diferente das agendas, a maior parte da configuração do Talonário
// (dados do pedido/receituário/receita, logos, marca d'água, cartelas de
// bingo já sorteadas etc.) vive em useState comum dentro de
// useTalonarioBuilder — não em localStorage. Por isso o "retrato" que
// mandamos para o backend aqui é montado a partir do próprio objeto
// retornado pelo hook, e não varrendo o localStorage.
//
// A única coisa que o Talonário guarda em localStorage são as cores de
// destaque por aba ("talonario-accentColors") — isso vai junto dentro de
// __localStorage, e é restaurado por restoreAgendaState (que já
// reconhece o namespace "talonario-").
import { captureLocalStoragePrefixed } from "./agendaStateSnapshot";

export function captureTalonarioState(t) {
  return {
    activeTab: t.activeTab,
    pedido: t.pedido,
    receituario: t.receituario,
    receita: t.receita,
    ordemServico: t.ordemServico,
    recibo: t.recibo,
    comanda: t.comanda,
    reserva: t.reserva,
    valePresente: t.valePresente,
    bingo: t.bingo,
    bingoCards: t.bingoCards,
    logos: t.logos,
    watermark: t.watermark,
    __localStorage: captureLocalStoragePrefixed("talonario-"),
  };
}
