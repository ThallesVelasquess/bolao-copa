import { useState, useEffect} from "react";

const BIN_ID = "6a31bc77da38895dfecc6962";
const ACCESS_KEY = "$2a$10$PSWhMqV5dRadaudB0kH2eOiz068nAa0uxXf2zvXStpXxXF8Cp4P1G";
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;
const BIN_HEADERS = {
  "Content-Type": "application/json",
  "X-Access-Key": ACCESS_KEY,  // Access Key em vez de Master Key (resolve CORS)
};

// ─── DB HELPERS (busca sempre o record mais recente antes de salvar) ──────────
async function dbGetAll() {
  const res = await fetch(JSONBIN_URL + "/latest", { headers: BIN_HEADERS });
  if (!res.ok) throw new Error("Erro ao ler JSONBin");
  const data = await res.json();
  return data.record || {};
}

async function dbSet(key, value) {
  // Sempre lê o estado mais recente antes de escrever (evita sobrescrever dados)
  const current = await dbGetAll();
  const updated = { ...current, [key]: value };
  const res = await fetch(JSONBIN_URL, {
    method: "PUT",
    headers: BIN_HEADERS,
    body: JSON.stringify(updated),
  });
  if (!res.ok) throw new Error("Erro ao salvar JSONBin");
  return updated;
}

// ─── DADOS DO BOLÃO ────────────────────────────────────────────────
const PARTICIPANTES = [
  "Alexandre","A. Diniz","Andre Gama","Andre Zani","Ana","Gilberto",
  "Larissa","Lorena","Carreira","Rafael","Suelen","Thais","Thalles",
  "W. Julian","A. Amaral","Will"
];

const JOGOS_GRUPOS = [
  { id:"g01", rodada:1, data:"2026-06-13T19:00:00", timeA:"Brasil",    timeB:"Marrocos" },
  { id:"g02", rodada:1, data:"2026-06-14T14:00:00", timeA:"Alemanha",  timeB:"Curaçao" },
  { id:"g03", rodada:1, data:"2026-06-14T17:00:00", timeA:"Holanda",   timeB:"Japão" },
  { id:"g04", rodada:1, data:"2026-06-15T13:00:00", timeA:"Espanha",   timeB:"Cabo Verde" },
  { id:"g05", rodada:1, data:"2026-06-15T19:00:00", timeA:"Uruguai",   timeB:"Arábia Saudita" },
  { id:"g06", rodada:1, data:"2026-06-16T16:00:00", timeA:"França",    timeB:"Senegal" },
  { id:"g07", rodada:1, data:"2026-06-16T22:00:00", timeA:"Argentina", timeB:"Argélia" },
  { id:"g08", rodada:1, data:"2026-06-17T14:00:00", timeA:"Portugal",  timeB:"RD Congo" },
  { id:"g09", rodada:1, data:"2026-06-17T17:00:00", timeA:"Inglaterra",timeB:"Croácia" },
  { id:"g10", rodada:2, data:"2026-06-19T21:30:00", timeA:"Brasil",    timeB:"Haiti" },
  { id:"g11", rodada:2, data:"2026-06-20T17:00:00", timeA:"Alemanha",  timeB:"Costa do Marfim" },
  { id:"g12", rodada:2, data:"2026-06-20T14:00:00", timeA:"Holanda",   timeB:"Suécia" },
  { id:"g13", rodada:2, data:"2026-06-21T13:00:00", timeA:"Espanha",   timeB:"Arábia Saudita" },
  { id:"g14", rodada:2, data:"2026-06-21T19:00:00", timeA:"Uruguai",   timeB:"Cabo Verde" },
  { id:"g15", rodada:2, data:"2026-06-22T18:00:00", timeA:"França",    timeB:"Iraque" },
  { id:"g16", rodada:2, data:"2026-06-22T14:00:00", timeA:"Argentina", timeB:"Austria" },
  { id:"g17", rodada:2, data:"2026-06-23T14:00:00", timeA:"Portugal",  timeB:"Uzbequistão" },
  { id:"g18", rodada:2, data:"2026-06-23T17:00:00", timeA:"Inglaterra",timeB:"Gana" },
  { id:"g19", rodada:3, data:"2026-06-24T19:00:00", timeA:"Brasil",    timeB:"Escócia" },
  { id:"g20", rodada:3, data:"2026-06-25T17:00:00", timeA:"Alemanha",  timeB:"Equador" },
  { id:"g21", rodada:3, data:"2026-06-25T20:00:00", timeA:"Holanda",   timeB:"Tunísia" },
  { id:"g22", rodada:3, data:"2026-06-26T21:00:00", timeA:"Espanha",   timeB:"Uruguai" },
  { id:"g23", rodada:3, data:"2026-06-26T16:00:00", timeA:"França",    timeB:"Noruega" },
  { id:"g24", rodada:3, data:"2026-06-27T23:00:00", timeA:"Argentina", timeB:"Jordânia" },
  { id:"g25", rodada:3, data:"2026-06-27T20:30:00", timeA:"Portugal",  timeB:"Colômbia" },
  { id:"g26", rodada:3, data:"2026-06-27T18:00:00", timeA:"Inglaterra",timeB:"Panamá" },
];

const PALPITES_PLANILHA = {
  g01: { Alexandre:[2,1], "A. Diniz":[2,1], "Andre Gama":[1,0], Ana:[2,0], Gilberto:[2,1], Larissa:[2,1], Lorena:[3,1], Rafael:[2,1], Suelen:[1,1], Thais:[2,0], Thalles:[3,1], "A. Amaral":[2,1], Will:[2,0] },
  g02: { Alexandre:[3,0], "A. Diniz":[3,0], "Andre Gama":[6,0], Ana:[3,0], Gilberto:[4,0], Larissa:[2,0], Lorena:[4,1], Rafael:[5,0], Suelen:[3,0], Thais:[3,0], Thalles:[5,0], "A. Amaral":[3,1], Will:[4,0] },
  g03: { Alexandre:[2,1], "A. Diniz":[1,1], "Andre Gama":[2,0], Ana:[1,0], Gilberto:[2,2], Larissa:[2,1], Lorena:[2,2], Rafael:[2,1], Suelen:[2,1], Thais:[1,2], Thalles:[3,2], "A. Amaral":[1,1], Will:[2,1] },
  g04: { Alexandre:[3,0], "A. Diniz":[3,0], "Andre Gama":[4,1], Ana:[3,0], Gilberto:[3,0], Larissa:[3,0], Lorena:[2,1], Rafael:[3,0], Suelen:[3,1], Thais:[3,1], Thalles:[4,1], "A. Amaral":[3,0], Will:[5,1] },
  g05: { Alexandre:[2,1], "A. Diniz":[2,0], "Andre Gama":[3,0], Ana:[2,0], Gilberto:[2,1], Larissa:[2,0], Lorena:[2,0], Rafael:[2,0], Suelen:[1,0], Thais:[2,1], Thalles:[1,1], "A. Amaral":[2,1], Will:[3,0] },
  g06: { Alexandre:[2,0], "A. Diniz":[2,1], "Andre Gama":[3,1], Ana:[2,0], Gilberto:[3,1], Larissa:[2,1], Lorena:[3,0], Rafael:[2,1], Suelen:[1,0], Thais:[4,1], Thalles:[3,0], "A. Amaral":[3,0], Will:[3,1] },
  g07: { Alexandre:[2,0], "A. Diniz":[3,0], "Andre Gama":[4,1], Ana:[1,0], Gilberto:[4,0], Larissa:[2,0], Lorena:[3,1], Rafael:[2,0], Suelen:[1,1], Thais:[3,0], Thalles:[2,0], "A. Amaral":[2,1], Will:[3,0] },
  g08: { Alexandre:[3,0], "A. Diniz":[2,0], Ana:[2,0], Gilberto:[3,0], Larissa:[3,0], Lorena:[2,1], Rafael:[3,0], Suelen:[1,0], Thais:[5,0], Thalles:[3,0], "A. Amaral":[2,0], Will:[3,0] },
  g09: { Alexandre:[2,1], "A. Diniz":[2,1], Ana:[1,1], Gilberto:[2,1], Larissa:[1,1], Lorena:[1,2], Rafael:[2,1], Suelen:[3,2], Thais:[1,0], Thalles:[2,1], "A. Amaral":[2,2], Will:[2,2] },
  g10: { "A. Diniz":[2,0], Ana:[3,0], Larissa:[3,0], Suelen:[2,0], "A. Amaral":[3,0], Will:[4,0] },
  g11: { "A. Diniz":[3,0], "Andre Gama":[3,1], Ana:[2,1], Larissa:[2,0], Suelen:[3,1], Will:[3,0] },
  g12: { "A. Diniz":[1,0], Ana:[2,1], Larissa:[2,1], Suelen:[2,2], Will:[1,0] },
  g13: { "A. Diniz":[3,0], Ana:[2,0], Larissa:[2,0], Suelen:[3,1], Will:[4,0] },
  g14: { "A. Diniz":[2,0], Ana:[2,0], Larissa:[2,0], Suelen:[2,1], Will:[3,0] },
  g15: { "A. Diniz":[4,0], Ana:[2,0], Larissa:[2,0], Suelen:[4,1], Will:[4,0] },
  g16: { "A. Diniz":[2,1], Ana:[2,1], Larissa:[2,1], Suelen:[1,2], Will:[2,0] },
  g17: { "A. Diniz":[3,0], Ana:[2,0], Larissa:[3,1], Suelen:[3,1], Will:[3,0] },
  g18: { "A. Diniz":[2,0], Ana:[2,0], Larissa:[2,0], Suelen:[2,1], Will:[3,0] },
  g19: { "A. Diniz":[2,1], Ana:[1,0], Larissa:[2,0], Suelen:[3,1] },
  g20: { "A. Diniz":[3,1], Ana:[1,0], Larissa:[1,1], Suelen:[3,2] },
  g21: { "A. Diniz":[2,0], Ana:[1,0], Larissa:[2,0] },
  g22: { "A. Diniz":[2,1], Ana:[1,0], Larissa:[2,1] },
  g23: { "A. Diniz":[2,1], Ana:[1,0], Larissa:[1,1] },
  g24: { "A. Diniz":[3,0], Ana:[1,0], Larissa:[3,0] },
  g25: { "A. Diniz":[2,1], Ana:[2,1], Larissa:[1,1] },
  g26: { "A. Diniz":[4,0], Ana:[1,0], Larissa:[2,0] },
};

const EMOJIS = {
  "Brasil":"🇧🇷","Marrocos":"🇲🇦","Alemanha":"🇩🇪","Curaçao":"🇨🇼","Holanda":"🇳🇱","Japão":"🇯🇵",
  "Espanha":"🇪🇸","Cabo Verde":"🇨🇻","Uruguai":"🇺🇾","Arábia Saudita":"🇸🇦","França":"🇫🇷","Senegal":"🇸🇳",
  "Argentina":"🇦🇷","Argélia":"🇩🇿","Portugal":"🇵🇹","RD Congo":"🇨🇩","Inglaterra":"🏴󠁧󠁢󠁥󠁮󠁧󠁿","Croácia":"🇭🇷",
  "Haiti":"🇭🇹","Costa do Marfim":"🇨🇮","Suécia":"🇸🇪","Iraque":"🇮🇶","Austria":"🇦🇹","Uzbequistão":"🇺🇿",
  "Gana":"🇬🇭","Escócia":"🏴󠁧󠁢󠁳󠁣󠁴󠁿","Equador":"🇪🇨","Tunísia":"🇹🇳","Noruega":"🇳🇴","Jordânia":"🇯🇴",
  "Colômbia":"🇨🇴","Panamá":"🇵🇦"
};

function flag(team) { return EMOJIS[team] || "⚽"; }

function calcPontos(palpite, resultado) {
  if (!palpite || !resultado) return 0;
  const [pa, pb] = palpite; const [ra, rb] = resultado;
  if (pa === ra && pb === rb) return 3;
  const vP = pa > pb ? "A" : pa < pb ? "B" : "E";
  const vR = ra > rb ? "A" : ra < rb ? "B" : "E";
  return vP === vR ? 1 : 0;
}

function formatData(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", { weekday:"short", day:"2-digit", month:"2-digit" }) +
    " " + d.toLocaleTimeString("pt-BR", { hour:"2-digit", minute:"2-digit" });
}

function jogoTravado(iso) { return new Date() >= new Date(iso); }

// Merge palpites da planilha com os salvos no JSONBin (JSONBin tem prioridade)
function mergePalpites(planilha, salvos) {
  const merged = {};
  const todasChaves = new Set([...Object.keys(planilha), ...Object.keys(salvos || {})]);
  for (const gid of todasChaves) {
    merged[gid] = { ...(planilha[gid] || {}), ...(salvos?.[gid] || {}) };
  }
  return merged;
}

export default function BolaoApp() {
  const [tela, setTela] = useState("ranking");
  const [usuario, setUsuario] = useState(null);
  const [palpites, setPalpites] = useState({ ...PALPITES_PLANILHA });
  const [resultados, setResultados] = useState({});
  const [jogosMatasMata, setJogosMatasMata] = useState([]);
  const [adminSenha, setAdminSenha] = useState("");
  const [adminOk, setAdminOk] = useState(false);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [msg, setMsg] = useState("");
  const [jogoAtivo, setJogoAtivo] = useState(null);
  const [placarTemp, setPlacarTemp] = useState([0, 0]);

  // Carrega dados do JSONBin ao iniciar
  useEffect(() => {
    async function carregar() {
      try {
        const record = await dbGetAll();
        const pSalvos = record["palpites"] || {};
        const r = record["resultados"];
        const m = record["mata"];
        // Merge: planilha + JSONBin (JSONBin sobrescreve planilha em caso de conflito)
        setPalpites(mergePalpites(PALPITES_PLANILHA, pSalvos));
        if (r) setResultados(r);
        if (m) setJogosMatasMata(m);
      } catch (e) {
        setMsg("⚠️ Erro ao carregar dados: " + e.message);
      }
      setLoading(false);
    }
    carregar();
  }, []);

  function showMsg(txt) { setMsg(txt); setTimeout(() => setMsg(""), 3000); }

  async function salvarPalpite(jogoId, placar) {
    setSalvando(true);
    // Atualiza estado local imediatamente
    const novosPalpites = {
      ...palpites,
      [jogoId]: { ...(palpites[jogoId] || {}), [usuario]: placar }
    };
    setPalpites(novosPalpites);

    try {
      // Calcula apenas os palpites que diferem da planilha original para salvar
      const extras = {};
      for (const gid of Object.keys(novosPalpites)) {
        for (const nome of Object.keys(novosPalpites[gid] || {})) {
          const valPlanilha = PALPITES_PLANILHA[gid]?.[nome];
          const valNovo = novosPalpites[gid][nome];
          // Salva se não existe na planilha OU se o valor mudou
          if (!valPlanilha || JSON.stringify(valPlanilha) !== JSON.stringify(valNovo)) {
            if (!extras[gid]) extras[gid] = {};
            extras[gid][nome] = valNovo;
          }
        }
      }
      await dbSet("palpites", extras);
      showMsg("✅ Palpite salvo!");
    } catch (e) {
      showMsg("❌ Erro ao salvar: " + e.message);
    }
    setSalvando(false);
    setJogoAtivo(null);
  }

  async function salvarResultado(jogoId, placar) {
    const novos = { ...resultados, [jogoId]: placar };
    setResultados(novos);
    try {
      await dbSet("resultados", novos);
      showMsg("✅ Resultado salvo!");
    } catch (e) {
      showMsg("❌ Erro ao salvar resultado: " + e.message);
    }
  }

  async function adicionarJogoMata(jogo) {
    const novos = [...jogosMatasMata, jogo];
    setJogosMatasMata(novos);
    try {
      await dbSet("mata", novos);
      showMsg("✅ Jogo adicionado!");
    } catch (e) {
      showMsg("❌ Erro ao adicionar jogo: " + e.message);
    }
  }

  async function removerJogoMata(idx) {
    const novos = jogosMatasMata.filter((_, i) => i !== idx);
    setJogosMatasMata(novos);
    try {
      await dbSet("mata", novos);
      showMsg("✅ Jogo removido!");
    } catch (e) {
      showMsg("❌ Erro ao remover jogo: " + e.message);
    }
  }

  const todosJogos = [...JOGOS_GRUPOS, ...jogosMatasMata];

  function pontosUsuario(nome) {
    let total = 0;
    for (const jogo of todosJogos) {
      const resultado = resultados[jogo.id];
      const palpite = palpites[jogo.id]?.[nome];
      if (Array.isArray(palpite) && Array.isArray(resultado))
        total += calcPontos(palpite, resultado);
    }
    return total;
  }

  const ranking = PARTICIPANTES.map(n => ({ nome: n, pontos: pontosUsuario(n) }))
    .sort((a, b) => b.pontos - a.pontos);

  const agora = new Date();
  const proximos = todosJogos
    .filter(j => new Date(j.data) > agora)
    .sort((a, b) => new Date(a.data) - new Date(b.data))
    .slice(0, 5);

  if (loading) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:"#0a1628",color:"#ffd700",fontFamily:"sans-serif",fontSize:"1.2rem"}}>
      ⚽ Carregando Bolão...
    </div>
  );

  return (
    <div style={{fontFamily:"'Segoe UI',sans-serif",background:"#0a1628",minHeight:"100vh",color:"#e8eaf0"}}>
      <div style={{background:"linear-gradient(135deg,#003580 0%,#0057b7 50%,#003580 100%)",padding:"16px 20px",borderBottom:"3px solid #ffd700"}}>
        <div style={{maxWidth:600,margin:"0 auto"}}>
          <div style={{fontSize:"1.3rem",fontWeight:800,color:"#ffd700",letterSpacing:1}}>🏆 BOLÃO DA COPA 2026</div>
          <div style={{fontSize:"0.75rem",color:"#b8d4ff",marginTop:2}}>Copa do Mundo 2026 · PA</div>
          {usuario && <div style={{fontSize:"0.8rem",color:"#7ec8e3",marginTop:4}}>👤 {usuario} · <span style={{cursor:"pointer",textDecoration:"underline"}} onClick={() => setUsuario(null)}>trocar</span></div>}
        </div>
      </div>

      {msg && <div style={{background:"#1a3a2a",color:"#5dfc8d",textAlign:"center",padding:"8px",fontSize:"0.9rem",position:"sticky",top:0,zIndex:10}}>{msg}</div>}

      <div style={{maxWidth:600,margin:"0 auto",padding:"0 0 80px"}}>
        {!usuario && (
          <div style={{padding:"24px 16px"}}>
            <div style={{fontSize:"1.1rem",fontWeight:700,marginBottom:16,color:"#ffd700"}}>Quem é você?</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {PARTICIPANTES.map(n => (
                <button key={n} onClick={() => setUsuario(n)}
                  style={{background:"#112240",border:"1px solid #1e3a5f",borderRadius:10,padding:"12px 8px",color:"#e8eaf0",cursor:"pointer",fontSize:"0.9rem",fontWeight:600,transition:"all 0.15s"}}
                  onMouseOver={e => e.target.style.background="#1e3a5f"}
                  onMouseOut={e => e.target.style.background="#112240"}>
                  {n}
                </button>
              ))}
            </div>
          </div>
        )}

        {proximos.length > 0 && (
          <div style={{padding:"16px 16px 0"}}>
            <div style={{fontSize:"0.7rem",fontWeight:700,letterSpacing:2,color:"#ffd700",marginBottom:8,textTransform:"uppercase"}}>⏰ Próximos Jogos</div>
            <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:8}}>
              {proximos.map(j => {
                const temPalpite = usuario && Array.isArray(palpites[j.id]?.[usuario]);
                const minutosRestantes = Math.floor((new Date(j.data) - agora) / 60000);
                const urgente = minutosRestantes < 120;
                return (
                  <div key={j.id} style={{minWidth:150,background:urgente?"#2a1a00":"#112240",border:`1px solid ${urgente?"#ff6b00":"#1e3a5f"}`,borderRadius:10,padding:"10px 12px",flexShrink:0,cursor:usuario?"pointer":"default"}}
                    onClick={() => usuario && (setJogoAtivo(j), setPlacarTemp(palpites[j.id]?.[usuario] || [1,0]), setTela("palpitar"))}>
                    <div style={{fontSize:"0.65rem",color:urgente?"#ff9040":"#7ec8e3",marginBottom:4}}>{formatData(j.data)}</div>
                    <div style={{fontSize:"0.85rem",fontWeight:700}}>{flag(j.timeA)} {j.timeA}</div>
                    <div style={{fontSize:"0.7rem",color:"#aaa",margin:"2px 0"}}>vs</div>
                    <div style={{fontSize:"0.85rem",fontWeight:700}}>{flag(j.timeB)} {j.timeB}</div>
                    {temPalpite && <div style={{fontSize:"0.65rem",color:"#5dfc8d",marginTop:4}}>✓ {palpites[j.id][usuario][0]}x{palpites[j.id][usuario][1]}</div>}
                    {!temPalpite && usuario && <div style={{fontSize:"0.65rem",color:"#ff9040",marginTop:4}}>⚡ Palpitar</div>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tela === "ranking" && (
          <div style={{padding:"16px"}}>
            <div style={{fontSize:"0.7rem",fontWeight:700,letterSpacing:2,color:"#ffd700",marginBottom:12,textTransform:"uppercase"}}>🏆 Classificação</div>
            {ranking.map((p, i) => (
              <div key={p.nome} style={{display:"flex",alignItems:"center",gap:12,background:i<3?"#112240":"#0d1e36",border:`1px solid ${i===0?"#ffd700":i===1?"#c0c0c0":i===2?"#cd7f32":"#1e3a5f"}`,borderRadius:10,padding:"12px 16px",marginBottom:8}}>
                <div style={{fontWeight:800,fontSize:"1.2rem",color:i===0?"#ffd700":i===1?"#c0c0c0":i===2?"#cd7f32":"#556",width:28,textAlign:"center"}}>
                  {i===0?"🥇":i===1?"🥈":i===2?"🥉":i+1}
                </div>
                <div style={{flex:1,fontWeight:600,fontSize:"0.95rem"}}>{p.nome}</div>
                <div style={{fontWeight:800,fontSize:"1.1rem",color:"#ffd700"}}>{p.pontos} <span style={{fontSize:"0.7rem",color:"#888"}}>pts</span></div>
              </div>
            ))}
          </div>
        )}

        {tela === "jogos" && (
          <div style={{padding:"16px"}}>
            {[1,2,3].map(r => (
              <div key={r}>
                <div style={{fontSize:"0.7rem",fontWeight:700,letterSpacing:2,color:"#ffd700",marginBottom:10,textTransform:"uppercase",marginTop:r>1?20:0}}>
                  {r}ª Rodada
                </div>
                {JOGOS_GRUPOS.filter(j => j.rodada === r).map(j => {
                  const travado = jogoTravado(j.data);
                  const resultado = resultados[j.id];
                  const meuPalpite = usuario ? palpites[j.id]?.[usuario] : null;
                  const pontos = Array.isArray(meuPalpite) && Array.isArray(resultado) ? calcPontos(meuPalpite, resultado) : null;
                  return (
                    <div key={j.id} style={{background:"#112240",border:"1px solid #1e3a5f",borderRadius:10,padding:"12px 14px",marginBottom:8}}>
                      <div style={{fontSize:"0.65rem",color:"#7ec8e3",marginBottom:8,display:"flex",justifyContent:"space-between"}}>
                        <span>{formatData(j.data)}</span>
                        {travado ? <span style={{color:"#ff6b6b"}}>🔒 Encerrado</span> : <span style={{color:"#5dfc8d"}}>🟢 Aberto</span>}
                      </div>
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
                        <div style={{flex:1,textAlign:"left",fontWeight:700,fontSize:"0.9rem"}}>{flag(j.timeA)} {j.timeA}</div>
                        <div style={{textAlign:"center"}}>
                          {resultado
                            ? <div style={{background:"#0d4a1a",borderRadius:8,padding:"4px 10px",fontWeight:800,color:"#5dfc8d"}}>{resultado[0]}×{resultado[1]}</div>
                            : <div style={{color:"#444",fontSize:"0.8rem"}}>vs</div>}
                        </div>
                        <div style={{flex:1,textAlign:"right",fontWeight:700,fontSize:"0.9rem"}}>{j.timeB} {flag(j.timeB)}</div>
                      </div>
                      {usuario && (
                        <div style={{marginTop:8,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                          {Array.isArray(meuPalpite)
                            ? <span style={{fontSize:"0.75rem",color:"#7ec8e3"}}>Seu palpite: {meuPalpite[0]}×{meuPalpite[1]}</span>
                            : <span style={{fontSize:"0.75rem",color:"#556"}}>Sem palpite</span>}
                          {!travado && (
                            <button onClick={() => { setJogoAtivo(j); setPlacarTemp(Array.isArray(meuPalpite)?meuPalpite:[1,0]); setTela("palpitar"); }}
                              style={{background:"#0057b7",border:"none",borderRadius:6,padding:"4px 10px",color:"white",cursor:"pointer",fontSize:"0.75rem",fontWeight:600}}>
                              {Array.isArray(meuPalpite)?"Editar":"Palpitar"}
                            </button>
                          )}
                          {pontos !== null && (
                            <span style={{fontSize:"0.75rem",fontWeight:700,color:pontos===3?"#ffd700":pontos===1?"#7ec8e3":"#ff6b6b"}}>
                              {pontos===3?"⭐ 3 pts":pontos===1?"✓ 1 pt":"✗ 0 pts"}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
            {jogosMatasMata.length > 0 && (
              <div>
                <div style={{fontSize:"0.7rem",fontWeight:700,letterSpacing:2,color:"#ff9040",marginBottom:10,textTransform:"uppercase",marginTop:20}}>⚔️ Mata-mata</div>
                {jogosMatasMata.map((j,idx) => {
                  const travado = jogoTravado(j.data);
                  const resultado = resultados[j.id];
                  const meuPalpite = usuario ? palpites[j.id]?.[usuario] : null;
                  return (
                    <div key={j.id} style={{background:"#1a1a2e",border:"1px solid #2a2a4e",borderRadius:10,padding:"12px 14px",marginBottom:8}}>
                      <div style={{fontSize:"0.65rem",color:"#ff9040",marginBottom:8,display:"flex",justifyContent:"space-between"}}>
                        <span>{j.fase} · {formatData(j.data)}</span>
                        {travado ? <span style={{color:"#ff6b6b"}}>🔒</span> : <span style={{color:"#5dfc8d"}}>🟢</span>}
                      </div>
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
                        <div style={{flex:1,fontWeight:700,fontSize:"0.9rem"}}>{flag(j.timeA)} {j.timeA}</div>
                        <div>{resultado ? <div style={{background:"#1a2a1a",borderRadius:6,padding:"3px 8px",fontWeight:800,color:"#5dfc8d"}}>{resultado[0]}×{resultado[1]}</div> : <span style={{color:"#444"}}>vs</span>}</div>
                        <div style={{flex:1,textAlign:"right",fontWeight:700,fontSize:"0.9rem"}}>{j.timeB} {flag(j.timeB)}</div>
                      </div>
                      {usuario && !travado && (
                        <button onClick={() => { setJogoAtivo(j); setPlacarTemp(Array.isArray(meuPalpite)?meuPalpite:[1,0]); setTela("palpitar"); }}
                          style={{marginTop:8,background:"#0057b7",border:"none",borderRadius:6,padding:"4px 10px",color:"white",cursor:"pointer",fontSize:"0.75rem",fontWeight:600}}>
                          {Array.isArray(meuPalpite)?"Editar palpite":"Palpitar"}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {tela === "palpitar" && jogoAtivo && (
          <div style={{padding:"16px"}}>
            <button onClick={() => { setJogoAtivo(null); setTela("jogos"); }} style={{background:"none",border:"none",color:"#7ec8e3",cursor:"pointer",fontSize:"0.9rem",marginBottom:16,padding:0}}>
              ← Voltar
            </button>
            <div style={{background:"#112240",border:"2px solid #0057b7",borderRadius:14,padding:"24px 20px",textAlign:"center"}}>
              <div style={{fontSize:"0.7rem",color:"#7ec8e3",marginBottom:16}}>{formatData(jogoAtivo.data)}</div>
              <div style={{display:"flex",justifyContent:"space-around",alignItems:"center",marginBottom:24,gap:16}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:"2rem"}}>{flag(jogoAtivo.timeA)}</div>
                  <div style={{fontWeight:700,fontSize:"0.9rem",marginTop:4}}>{jogoAtivo.timeA}</div>
                </div>
                <div style={{fontSize:"1.2rem",color:"#556"}}>vs</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:"2rem"}}>{flag(jogoAtivo.timeB)}</div>
                  <div style={{fontWeight:700,fontSize:"0.9rem",marginTop:4}}>{jogoAtivo.timeB}</div>
                </div>
              </div>
              <div style={{fontSize:"0.8rem",color:"#ffd700",marginBottom:12,fontWeight:600}}>Seu palpite de placar:</div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:16}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
                  <button onClick={() => setPlacarTemp([placarTemp[0]+1, placarTemp[1]])} style={btnStyle}>▲</button>
                  <div style={{fontSize:"2.5rem",fontWeight:800,width:60,textAlign:"center",background:"#0d1e36",borderRadius:8,padding:"8px 0"}}>{placarTemp[0]}</div>
                  <button onClick={() => setPlacarTemp([Math.max(0,placarTemp[0]-1), placarTemp[1]])} style={btnStyle}>▼</button>
                </div>
                <div style={{fontSize:"2rem",fontWeight:800,color:"#ffd700"}}>×</div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
                  <button onClick={() => setPlacarTemp([placarTemp[0], placarTemp[1]+1])} style={btnStyle}>▲</button>
                  <div style={{fontSize:"2.5rem",fontWeight:800,width:60,textAlign:"center",background:"#0d1e36",borderRadius:8,padding:"8px 0"}}>{placarTemp[1]}</div>
                  <button onClick={() => setPlacarTemp([placarTemp[0], Math.max(0,placarTemp[1]-1)])} style={btnStyle}>▼</button>
                </div>
              </div>
              <div style={{fontSize:"0.72rem",color:"#888",margin:"16px 0 8px"}}>
                1 pt = acertar vencedor · 3 pts = placar exato
              </div>
              <button onClick={() => salvarPalpite(jogoAtivo.id, placarTemp)} disabled={salvando}
                style={{background:"#ffd700",border:"none",borderRadius:10,padding:"14px 32px",color:"#0a1628",fontWeight:800,fontSize:"1rem",cursor:"pointer",width:"100%",marginTop:8}}>
                {salvando ? "Salvando..." : "💾 Confirmar Palpite"}
              </button>
            </div>
          </div>
        )}

        {tela === "admin" && (
          <div style={{padding:"16px"}}>
            {!adminOk ? (
              <div style={{background:"#112240",borderRadius:12,padding:24}}>
                <div style={{fontSize:"1rem",fontWeight:700,marginBottom:12,color:"#ffd700"}}>🔐 Área Admin</div>
                <input type="password" placeholder="Senha" value={adminSenha} onChange={e => setAdminSenha(e.target.value)}
                  style={{width:"100%",padding:"10px 12px",borderRadius:8,border:"1px solid #1e3a5f",background:"#0d1e36",color:"white",fontSize:"1rem",boxSizing:"border-box",marginBottom:12}} />
                <button onClick={() => { if(adminSenha==="copa2026") setAdminOk(true); else showMsg("❌ Senha errada"); }}
                  style={{background:"#ffd700",border:"none",borderRadius:8,padding:"10px 24px",color:"#0a1628",fontWeight:800,cursor:"pointer",width:"100%"}}>
                  Entrar
                </button>
              </div>
            ) : (
              <div>
                <div style={{fontSize:"0.7rem",fontWeight:700,letterSpacing:2,color:"#ffd700",marginBottom:12,textTransform:"uppercase"}}>🎯 Inserir Resultados</div>
                {todosJogos.map(j => {
                  const r = resultados[j.id];
                  const travado = jogoTravado(j.data);
                  return (
                    <div key={j.id} style={{background:"#112240",border:"1px solid #1e3a5f",borderRadius:10,padding:"12px",marginBottom:8}}>
                      <div style={{fontSize:"0.75rem",color:"#7ec8e3",marginBottom:6}}>{flag(j.timeA)} {j.timeA} vs {j.timeB} {flag(j.timeB)}</div>
                      <div style={{fontSize:"0.65rem",color:"#556",marginBottom:8}}>{formatData(j.data)}{!travado && " · ainda não iniciou"}</div>
                      <AdminResultado jogoId={j.id} resultado={r} onSalvar={salvarResultado} />
                    </div>
                  );
                })}
                <div style={{fontSize:"0.7rem",fontWeight:700,letterSpacing:2,color:"#ff9040",margin:"20px 0 12px",textTransform:"uppercase"}}>➕ Adicionar Jogo Mata-Mata</div>
                <AdicionarMata onAdicionar={adicionarJogoMata} />
                {jogosMatasMata.map((j,idx) => (
                  <div key={j.id} style={{background:"#1a1a2e",border:"1px solid #2a2a4e",borderRadius:8,padding:"10px 12px",marginBottom:6,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontSize:"0.8rem"}}>{j.fase}: {j.timeA} vs {j.timeB}</span>
                    <button onClick={() => removerJogoMata(idx)} style={{background:"#5a1a1a",border:"none",borderRadius:6,padding:"4px 8px",color:"#ff6b6b",cursor:"pointer",fontSize:"0.75rem"}}>Remover</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{position:"fixed",bottom:0,left:0,right:0,background:"#0a1628",borderTop:"2px solid #1e3a5f",display:"flex",justifyContent:"space-around",padding:"8px 0 12px",zIndex:100}}>
        {[
          {id:"ranking", icon:"🏆", label:"Ranking"},
          {id:"jogos",   icon:"⚽", label:"Jogos"},
          {id:"admin",   icon:"⚙️", label:"Admin"},
        ].map(t => (
          <button key={t.id} onClick={() => { setTela(t.id); setJogoAtivo(null); }}
            style={{background:"none",border:"none",color:tela===t.id?"#ffd700":"#556",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"4px 16px",borderRadius:8}}>
            <span style={{fontSize:"1.3rem"}}>{t.icon}</span>
            <span style={{fontSize:"0.65rem",fontWeight:tela===t.id?700:400}}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

const btnStyle = {
  background:"#1e3a5f",border:"none",borderRadius:6,width:40,height:32,color:"white",
  cursor:"pointer",fontSize:"0.9rem",fontWeight:700
};

function AdminResultado({ jogoId, resultado, onSalvar }) {
  const [gA, setGA] = useState(resultado?.[0] ?? "");
  const [gB, setGB] = useState(resultado?.[1] ?? "");
  return (
    <div style={{display:"flex",gap:8,alignItems:"center"}}>
      <input type="number" min={0} max={20} value={gA} onChange={e=>setGA(e.target.value)}
        style={{width:50,padding:"6px 8px",borderRadius:6,border:"1px solid #1e3a5f",background:"#0d1e36",color:"white",textAlign:"center"}} />
      <span style={{color:"#556"}}>×</span>
      <input type="number" min={0} max={20} value={gB} onChange={e=>setGB(e.target.value)}
        style={{width:50,padding:"6px 8px",borderRadius:6,border:"1px solid #1e3a5f",background:"#0d1e36",color:"white",textAlign:"center"}} />
      <button onClick={() => { if(gA!==""&&gB!=="") onSalvar(jogoId,[parseInt(gA),parseInt(gB)]); }}
        style={{background:"#0057b7",border:"none",borderRadius:6,padding:"6px 12px",color:"white",cursor:"pointer",fontSize:"0.8rem",fontWeight:600}}>
        Salvar
      </button>
      {resultado && <span style={{color:"#5dfc8d",fontSize:"0.75rem"}}>✓ {resultado[0]}×{resultado[1]}</span>}
    </div>
  );
}

function AdicionarMata({ onAdicionar }) {
  const [timeA, setTimeA] = useState("");
  const [timeB, setTimeB] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("16:00");
  const [fase, setFase] = useState("Oitavas");

  function add() {
    if (!timeA || !timeB || !data) return;
    onAdicionar({ id:`m_${Date.now()}`, timeA, timeB, data:`${data}T${hora}:00`, fase, rodada:"mata" });
    setTimeA(""); setTimeB(""); setData("");
  }

  const inp = {padding:"8px 10px",borderRadius:6,border:"1px solid #1e3a5f",background:"#0d1e36",color:"white",fontSize:"0.85rem",width:"100%",boxSizing:"border-box"};
  return (
    <div style={{background:"#112240",border:"1px solid #1e3a5f",borderRadius:10,padding:14,marginBottom:12}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
        <input placeholder="Time A" value={timeA} onChange={e=>setTimeA(e.target.value)} style={inp} />
        <input placeholder="Time B" value={timeB} onChange={e=>setTimeB(e.target.value)} style={inp} />
        <input type="date" value={data} onChange={e=>setData(e.target.value)} style={inp} />
        <input type="time" value={hora} onChange={e=>setHora(e.target.value)} style={inp} />
        <select value={fase} onChange={e=>setFase(e.target.value)} style={inp}>
          {["Oitavas","Quartas","Semifinal","3º Lugar","Final"].map(f=><option key={f}>{f}</option>)}
        </select>
      </div>
      <button onClick={add} style={{background:"#ff9040",border:"none",borderRadius:8,padding:"8px 16px",color:"#0a1628",fontWeight:800,cursor:"pointer",width:"100%"}}>
        + Adicionar Jogo
      </button>
    </div>
  );
}