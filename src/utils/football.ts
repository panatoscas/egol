/**
 * Utilitários de futebol — bandeiras e formatação de horário (UTC → BRT)
 */

// ---------------------------------------------------------------------------
// Bandeiras por código FIFA/Sofascore (3 letras)
// ---------------------------------------------------------------------------

const FLAG_BY_CODE: Record<string, string> = {
  // Américas
  BRA: '🇧🇷', ARG: '🇦🇷', URU: '🇺🇾', COL: '🇨🇴', CHI: '🇨🇱',
  ECU: '🇪🇨', PER: '🇵🇪', PAR: '🇵🇾', BOL: '🇧🇴', VEN: '🇻🇪',
  USA: '🇺🇸', CAN: '🇨🇦', MEX: '🇲🇽', CRC: '🇨🇷', HON: '🇭🇳',
  PAN: '🇵🇦', JAM: '🇯🇲', HAI: '🇭🇹', TRI: '🇹🇹', GUA: '🇬🇹',
  SLV: '🇸🇻', NCA: '🇳🇮', CUB: '🇨🇺',

  // Europa
  FRA: '🇫🇷', ENG: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', ESP: '🇪🇸', GER: '🇩🇪', ITA: '🇮🇹',
  POR: '🇵🇹', NED: '🇳🇱', BEL: '🇧🇪', CRO: '🇭🇷', SUI: '🇨🇭',
  DEN: '🇩🇰', SWE: '🇸🇪', NOR: '🇳🇴', POL: '🇵🇱', SRB: '🇷🇸',
  AUT: '🇦🇹', HUN: '🇭🇺', CZE: '🇨🇿', SVK: '🇸🇰', ROU: '🇷🇴',
  BUL: '🇧🇬', GRE: '🇬🇷', TUR: '🇹🇷', UKR: '🇺🇦', RUS: '🇷🇺',
  SCO: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', WAL: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', NIR: '🇬🇧', IRL: '🇮🇪',
  FIN: '🇫🇮', ISL: '🇮🇸', ALB: '🇦🇱', SVN: '🇸🇮', MNE: '🇲🇪',
  BIH: '🇧🇦', MKD: '🇲🇰', LUX: '🇱🇺', GEO: '🇬🇪', AZE: '🇦🇿',
  ARM: '🇦🇲',

  // África
  MAR: '🇲🇦', SEN: '🇸🇳', GHA: '🇬🇭', NGA: '🇳🇬', CMR: '🇨🇲',
  CIV: '🇨🇮', EGY: '🇪🇬', ALG: '🇩🇿', TUN: '🇹🇳', MLI: '🇲🇱',
  BUR: '🇧🇫', ZAM: '🇿🇲', GAB: '🇬🇦', COD: '🇨🇩', ANG: '🇦🇴',
  ZIM: '🇿🇼', MOZ: '🇲🇿', TAN: '🇹🇿', UGA: '🇺🇬', KEN: '🇰🇪',
  ETH: '🇪🇹', RSA: '🇿🇦', LIB: '🇱🇾', SOM: '🇸🇴', GUI: '🇬🇳',
  BEN: '🇧🇯', TOG: '🇹🇬', CAP: '🇨🇻', EQG: '🇬🇶',

  // Ásia & Oceania
  JPN: '🇯🇵', KOR: '🇰🇷', IRN: '🇮🇷', SAU: '🇸🇦', QAT: '🇶🇦',
  AUS: '🇦🇺', NZL: '🇳🇿', CHN: '🇨🇳', IND: '🇮🇳', IRQ: '🇮🇶',
  UAE: '🇦🇪', JOR: '🇯🇴', LEB: '🇱🇧', SYR: '🇸🇾', KUW: '🇰🇼',
  OMA: '🇴🇲', BHR: '🇧🇭', YEM: '🇾🇪', PAK: '🇵🇰', BAN: '🇧🇩',
  UZB: '🇺🇿', KAZ: '🇰🇿', TKM: '🇹🇲', KGZ: '🇰🇬', TJK: '🇹🇯',
  VIE: '🇻🇳', THA: '🇹🇭', MYS: '🇲🇾', IDN: '🇮🇩', PHI: '🇵🇭',
  SGP: '🇸🇬', HKG: '🇭🇰', TPE: '🇹🇼', ISR: '🇮🇱',
};

// Mapeamento por nome (fallback quando o código não bate)
const FLAG_BY_NAME: Array<[RegExp, string]> = [
  [/brazil|brasil/i, '🇧🇷'],
  [/argentina/i, '🇦🇷'],
  [/mexico|méxico/i, '🇲🇽'],
  [/cameroon|camar/i, '🇨🇲'],
  [/australia|austr/i, '🇦🇺'],
  [/france|fran[cç]/i, '🇫🇷'],
  [/england|ingla/i, '🏴󠁧󠁢󠁥󠁮󠁧󠁿'],
  [/spain|espa[nñ]/i, '🇪🇸'],
  [/germany|alemanha|deutschland/i, '🇩🇪'],
  [/portugal/i, '🇵🇹'],
  [/united states|usa|estados unidos/i, '🇺🇸'],
  [/canada/i, '🇨🇦'],
  [/uruguay/i, '🇺🇾'],
  [/colombia/i, '🇨🇴'],
  [/chile/i, '🇨🇱'],
  [/ecuador/i, '🇪🇨'],
  [/peru/i, '🇵🇪'],
  [/paraguay/i, '🇵🇾'],
  [/japan|jap[ã]/i, '🇯🇵'],
  [/south korea|cor[ée]ia/i, '🇰🇷'],
  [/morocco|marrocos/i, '🇲🇦'],
  [/senegal/i, '🇸🇳'],
  [/ghana|gana/i, '🇬🇭'],
  [/nigeria|nig[eé]ria/i, '🇳🇬'],
  [/iran/i, '🇮🇷'],
  [/saudi|ar[aá]bia saudita/i, '🇸🇦'],
  [/netherlands|holanda|pa[íi]ses baixos/i, '🇳🇱'],
  [/belgium|b[eé]lgica/i, '🇧🇪'],
  [/croatia|cro[áa]cia/i, '🇭🇷'],
  [/switzerland|su[íi][çc]/i, '🇨🇭'],
  [/denmark|dinamarca/i, '🇩🇰'],
  [/poland|pol[ôo]nia/i, '🇵🇱'],
  [/serbia|s[eé]rvia/i, '🇷🇸'],
  [/turkey|turquia/i, '🇹🇷'],
  [/ukraine|ucr[âa]nia/i, '🇺🇦'],
  [/ivory coast|c[ôo]te d'ivoire/i, '🇨🇮'],
  [/qatar/i, '🇶🇦'],
  [/costa rica/i, '🇨🇷'],
  [/new zealand|nova zel[âa]ndia/i, '🇳🇿'],
  [/south africa|[aá]frica do sul/i, '🇿🇦'],
];

export function getFlagEmoji(code: string, name: string): string {
  if (FLAG_BY_CODE[code?.toUpperCase()]) return FLAG_BY_CODE[code.toUpperCase()];
  for (const [pattern, flag] of FLAG_BY_NAME) {
    if (pattern.test(name)) return flag;
  }
  return '🏳️';
}

// ---------------------------------------------------------------------------
// Tempo UTC → BRT (UTC-3)
// ---------------------------------------------------------------------------

const BRT_OFFSET_MS = -3 * 60 * 60 * 1000;

/**
 * Converte "HH:MM" em UTC para "HH:MM" em BRT (UTC-3).
 * Se o horário não estiver disponível retorna string vazia.
 */
export function utcTimeToBRT(timeUtc: string | null | undefined): string {
  if (!timeUtc) return '';
  const [hStr, mStr] = timeUtc.split(':');
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  if (isNaN(h) || isNaN(m)) return '';

  // Subtrai 3h
  let brtH = h - 3;
  if (brtH < 0) brtH += 24;
  return `${String(brtH).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * Formata uma data ISO "YYYY-MM-DD" para "13 jun" em pt-BR.
 */
export function formatMatchDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  try {
    return new Date(dateStr + 'T12:00:00').toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Quantos dias faltam para uma data "YYYY-MM-DD".
 */
export function daysUntil(dateStr: string): number {
  const now = new Date();
  const target = new Date(dateStr + 'T00:00:00');
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}
