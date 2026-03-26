// ══════════════════════════════════════════
// CONFIGURAÇÕES — edite aqui!
// ══════════════════════════════════════════

// ── Jogos pré-cadastrados ──
const jogo1 = [1, 3, 6, 7, 8, 9, 11, 12, 14, 15, 17, 19, 20, 21, 25];
const jogo2 = [1, 2, 3, 5, 6, 8, 10, 12, 15, 17, 18, 19, 20, 21, 24];
const jogo3 = [3, 5, 7, 8, 9, 10, 12, 13, 14, 15, 17, 18, 19, 20, 25];
const jogo4 = [1, 5, 6, 10, 11, 12, 13, 14, 16, 17, 19, 20, 22, 23, 25];
const jogo5 = [1, 3, 4, 5, 7, 9, 10, 11, 13, 15, 16, 18, 20, 22, 25];
const jogo6 = [1, 2, 3, 6, 8, 9, 11, 12, 15, 17, 18, 20, 22, 23, 24];
const jogo7 = [3, 5, 7, 8, 9, 10, 13, 14, 17, 18, 19, 20, 22, 24, 25];
const jogo8 = [2, 4, 5, 7, 8, 10, 11, 13, 16, 17, 19, 20, 22, 24, 25];
const jogo9 = [1, 2, 3, 4, 5, 9, 10, 12, 15, 16, 18, 20, 21, 24, 25];
const jogo10 = [3, 5, 6, 8, 9, 10, 12, 13, 15, 16, 18, 20, 22, 23, 25];
const jogo11 = [1, 3, 7, 8, 10, 11, 12, 14, 17, 18, 21, 22, 23, 24, 25];


const jogos = [
  { nome: "Jogo 1", numeros: jogo1 },
  { nome: "Jogo 2", numeros: jogo2 },
  { nome: "Jogo 3", numeros: jogo3 },
  { nome: "Jogo 4", numeros: jogo4 },
  { nome: "Jogo 5", numeros: jogo5 },
  { nome: "Jogo 6", numeros: jogo6 },
  { nome: "Jogo 7", numeros: jogo7 },
  { nome: "Jogo 8", numeros: jogo8 },
  { nome: "Jogo 9", numeros: jogo9 },
  { nome: "Jogo 10", numeros: jogo10 },
  { nome: "Jogo 11", numeros: jogo11 },
];

// ══════════════════════════════════════════
// Funções auxiliares
// ══════════════════════════════════════════
function contarAcertos(jogo, resultado) {
  return jogo.filter(n => resultado.includes(n)).length;
}

function getValorPremio(acertos, premiacoes) {
  const faixaMap = { 15: 1, 14: 2, 13: 3, 12: 4, 11: 5 };
  const faixa = faixaMap[acertos];
  if (!faixa) return null;
  const p = premiacoes.find(pr => pr.faixa === faixa);
  return p ? p.valorPremio : null;
}

function formatBRL(v) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
}

function pad(n) {
  return String(n).padStart(2, "0");
}

// ══════════════════════════════════════════
// Renderização
// ══════════════════════════════════════════
function renderApp(data) {
  const app = document.getElementById("app");
  const dezenas = data.dezenas.map(Number).sort((a, b) => a - b);

  let html = "";

  // ── Resultado ──
  html += `
    <div class="glass result-header fade-up">
      <div class="result-title">🏆 LOTOFÁCIL</div>
      <div class="result-meta">
        <span class="meta-badge"><strong># Concurso ${data.concurso}</strong></span>
        <span class="meta-badge">📅 ${data.data}</span>
      </div>
      <div class="numbers-row">
        ${dezenas.map((n, i) => `<span class="ball result" style="animation-delay:${i * 50}ms">${pad(n)}</span>`).join("")}
      </div>
    </div>
  `;

  // ── Jogos ──
  html += `<div class="section-title fade-up delay-1"><span class="bar"></span> Seus Jogos</div>`;
  html += `<div class="games-grid">`;

  jogos.forEach((jogo, idx) => {
    const nums = [...jogo.numeros].sort((a, b) => a - b);
    const acertos = contarAcertos(nums, dezenas);
    const isWinner = acertos >= 11;
    const valor = getValorPremio(acertos, data.premiacoes);

    html += `
      <div class="glass game-card ${isWinner ? "winner" : ""} fade-up delay-${idx + 1}">
        <div class="game-header">
          <span class="game-name">${jogo.nome}</span>
          <span class="acertos-badge ${isWinner ? "win" : ""}">
            <span class="icon">${isWinner ? "✅" : "❌"}</span>
            ${acertos} acertos
          </span>
        </div>
        <div class="game-numbers">
          ${nums.map(n => {
      const hit = dezenas.includes(n);
      return `<span class="ball small ${hit ? "hit" : ""}">${pad(n)}</span>`;
    }).join("")}
        </div>
        ${isWinner && valor !== null ? `
          <div class="prize-box">
            <span class="icon">🏅</span>
            <div>
              <div class="prize-label">Prêmio estimado</div>
              <div class="prize-value">${formatBRL(valor)}</div>
            </div>
          </div>
        ` : ""}
        ${isWinner && valor === null ? `
          <div class="prize-box">
            <span class="icon">🎉</span>
            <div class="prize-value" style="font-size:14px">Parabéns! ${acertos} acertos!</div>
          </div>
        ` : ""}
      </div>
    `;
  });

  html += `</div>`;

  // ── Premiações ──
  html += `
    <div class="glass fade-up delay-4">
      <div class="section-title"><span class="bar"></span> 💰 Premiações</div>
      ${data.premiacoes.map(p => `
        <div class="prize-row">
          <span class="prize-desc">
            ${p.descricao}
            <span class="winners">(${p.ganhadores} ganhador${p.ganhadores !== 1 ? "es" : ""})</span>
          </span>
          <span class="prize-amount">${formatBRL(p.valorPremio)}</span>
        </div>
      `).join("")}
    </div>
  `;

  // ── Footer ──
  html += `<div class="footer">Dados obtidos via API Loterias CAIXA • Apenas para consulta</div>`;

  app.innerHTML = html;
}

function renderError(msg) {
  document.getElementById("app").innerHTML = `
    <div class="center-screen">
      <div style="font-size:40px">⚠️</div>
      <p style="font-weight:600">Erro ao carregar</p>
      <p style="color:var(--fg-muted);font-size:14px">${msg}</p>
      <button class="btn-retry" onclick="location.reload()">🔄 Tentar novamente</button>
    </div>
  `;
}

// ══════════════════════════════════════════
// Buscar dados da API
// ══════════════════════════════════════════
fetch("https://loteriascaixa-api.herokuapp.com/api/lotofacil/latest")
  .then(res => {
    if (!res.ok) throw new Error("Erro na API: " + res.status);
    return res.json();
  })
  .then(data => renderApp(data))
  .catch(err => renderError(err.message));
