<?php
/**
 * Plugin Name: English Vivo
 * Description: AI-powered English learning app for Brazilian Portuguese speakers. Sister app to Português Vivo. Renders via [english_vivo] shortcode.
 * Version: 1.1.0
 * Author: Mike Schmidt / Anthropic
 */

defined('ABSPATH') || exit;

define('EV_VERSION', '1.1.0');
define('EV_URL', plugin_dir_url(__FILE__));

add_action('wp_enqueue_scripts', function () {
    wp_register_style('english-vivo', EV_URL . 'assets/css/app.css', [], EV_VERSION);
    wp_register_script('english-vivo', EV_URL . 'assets/js/app.js', [], EV_VERSION, true);
});

add_shortcode('english_vivo', function () {
    wp_enqueue_style('english-vivo');
    wp_enqueue_script('english-vivo');

    ob_start();
    ?>
    <div class="ev-root">
    <div class="app">
      <!-- ONBOARDING -->
      <div id="onboarding" style="display:none;max-width:420px;margin:3rem auto;padding:0 1rem">
        <div style="text-align:center;margin-bottom:2rem">
          <div style="font-size:32px;margin-bottom:.5rem">🇺🇸</div>
          <div style="font-size:22px;font-weight:500;margin-bottom:4px">English Vivo</div>
          <div style="font-size:14px;color:var(--color-text-secondary)">Aprenda inglês do jeito certo</div>
        </div>

        <div id="ob-step1">
          <div style="font-size:13px;color:var(--color-text-secondary);margin-bottom:1rem;display:flex;gap:8px">
            <span style="background:var(--color-text-primary);color:#fff;border-radius:50%;width:20px;height:20px;display:inline-flex;align-items:center;justify-content:center;font-size:11px;flex-shrink:0">1</span>
            <span>Passo 1 de 3 — Criar perfil</span>
          </div>
          <div class="card">
            <div style="margin-bottom:1rem">
              <label style="font-size:13px;font-weight:500;display:block;margin-bottom:6px">Seu nome</label>
              <input id="ob-name" type="text" placeholder="Ex: João Silva" style="width:100%;border:0.5px solid var(--color-border-tertiary);border-radius:8px;padding:10px 12px;font-size:15px;font-family:inherit;background:var(--color-background-primary);color:#1a1a18">
            </div>
            <div style="margin-bottom:1.25rem">
              <label style="font-size:13px;font-weight:500;display:block;margin-bottom:6px">Email</label>
              <input id="ob-email" type="email" placeholder="seu@email.com" style="width:100%;border:0.5px solid var(--color-border-tertiary);border-radius:8px;padding:10px 12px;font-size:15px;font-family:inherit;background:var(--color-background-primary);color:#1a1a18">
            </div>
            <button class="btn btn-primary" style="width:100%" onclick="obStep1()">Continuar →</button>
          </div>
        </div>

        <div id="ob-step2" style="display:none">
          <div style="font-size:13px;color:var(--color-text-secondary);margin-bottom:1rem;display:flex;gap:8px">
            <span style="background:var(--color-text-primary);color:#fff;border-radius:50%;width:20px;height:20px;display:inline-flex;align-items:center;justify-content:center;font-size:11px;flex-shrink:0">2</span>
            <span>Passo 2 de 3 — Conectar IA</span>
          </div>
          <div class="card">
            <p style="font-size:14px;line-height:1.7;margin-bottom:1rem">Para que a IA possa te ensinar, você precisará de uma chave gratuita do <strong>Groq</strong>. É rápido e 100% gratuito.</p>
            <div style="background:var(--color-background-secondary);border-radius:8px;padding:12px;margin-bottom:1rem;font-size:13px;line-height:1.8">
              <div style="font-weight:500;margin-bottom:4px">Como obter sua chave:</div>
              <div>1. Acesse <a href="https://console.groq.com/keys" target="_blank" style="color:var(--color-text-info)">console.groq.com/keys</a></div>
              <div>2. Faça login (pode usar sua conta Google)</div>
              <div>3. Clique em <strong>Create API Key</strong></div>
              <div>4. Copie a chave e cole abaixo</div>
            </div>
            <div style="margin-bottom:1.25rem">
              <label style="font-size:13px;font-weight:500;display:block;margin-bottom:6px">Sua chave Groq</label>
              <input id="ob-apikey" type="password" placeholder="gsk_..." style="width:100%;border:0.5px solid var(--color-border-tertiary);border-radius:8px;padding:10px 12px;font-size:15px;font-family:inherit;background:var(--color-background-primary);color:#1a1a18">
              <div style="font-size:12px;color:var(--color-text-secondary);margin-top:4px">Sua chave é armazenada apenas no seu dispositivo.</div>
            </div>
            <button class="btn btn-primary" style="width:100%" onclick="obStep2()">Verificar chave →</button>
            <div id="ob-key-error" style="font-size:13px;color:#e24b4a;margin-top:8px;display:none"></div>
          </div>
        </div>

        <div id="ob-step3" style="display:none">
          <div style="font-size:13px;color:var(--color-text-secondary);margin-bottom:1rem;display:flex;gap:8px">
            <span style="background:var(--color-text-primary);color:#fff;border-radius:50%;width:20px;height:20px;display:inline-flex;align-items:center;justify-content:center;font-size:11px;flex-shrink:0">3</span>
            <span>Passo 3 de 3 — Exame de nivelamento</span>
          </div>
          <div class="card">
            <p style="font-size:14px;line-height:1.7;margin-bottom:1rem">Ótimo, <strong id="ob-welcome-name"></strong>! Sua chave está funcionando.</p>
            <p style="font-size:14px;line-height:1.7;margin-bottom:1rem">Agora vamos descobrir seu nível de inglês. O exame leva cerca de 10 minutos e tem 3 partes: leitura, escrita e gramática.</p>
            <p style="font-size:13px;color:var(--color-text-secondary);margin-bottom:1.25rem">Não se preocupe se seu inglês ainda for básico — o exame se adapta. Seu plano será gerado com base no resultado.</p>
            <button class="btn btn-primary" style="width:100%" onclick="obStartExam()">Fazer o exame agora →</button>
          </div>
        </div>
      </div>

      <div id="main-app" style="display:none">
      <div class="top-bar">
        <div class="app-name">English Vivo</div>
        <div class="level-widget" id="level-widget">
          <div class="level-row">
            <span class="level-chip" id="lw-level"></span>
            <span class="next-chip" id="lw-arrow"></span>
          </div>
          <div class="prog-bar-wrap"><div class="prog-bar-fill" id="lw-bar" style="width:0%"></div></div>
          <div class="prog-pct" id="lw-pct"></div>
        </div>
        <button id="lang-toggle" onclick="toggleUiLang()" title="Switch language" style="background:none;border:0.5px solid var(--color-border-tertiary);border-radius:20px;padding:4px 10px;font-size:12px;cursor:pointer;margin-left:auto;align-self:center">🇧🇷 PT</button>
      </div>

      <nav>
        <button class="nav-btn active" id="nav-plano" onclick="showSection('plano')" data-i18n="O Plano">O Plano</button>
        <button class="nav-btn" id="nav-explorar" onclick="showSection('explorar')" data-i18n="Explorar">Explorar</button>
      </nav>

      <div id="plano" class="section active">
        <div id="plano-no-exam" class="no-exam-banner" style="display:none">
          <div style="font-size:32px;margin-bottom:.75rem">📋</div>
          <div style="font-size:16px;font-weight:500;margin-bottom:8px" data-i18n="Comece pelo exame">Comece pelo exame</div>
          <p style="font-size:14px;color:var(--color-text-secondary);margin-bottom:1.25rem" data-i18n="O plano é gerado com base no seu nível. Faça o exame de nivelamento primeiro.">O plano é gerado com base no seu nível. Faça o exame de nivelamento primeiro.</p>
          <button class="btn btn-primary" onclick="showExam()" data-i18n="Fazer o exame →">Fazer o exame →</button>
        </div>
        <div id="plano-generating" style="display:none;text-align:center;padding:3rem 1rem">
          <div style="font-size:28px;margin-bottom:1rem">⚙️</div>
          <div style="font-size:15px;font-weight:500;margin-bottom:6px" data-i18n="Gerando seu plano...">Gerando seu plano...</div>
          <div style="font-size:13px;color:var(--color-text-secondary)"><span data-i18n="Criando milestones para o nível">Criando milestones para o nível</span> <span id="gen-level"></span></div>
        </div>
        <div id="plano-main" style="display:none">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1.5rem">
            <div>
              <h1 id="plano-title"></h1>
              <p class="subtitle" style="margin-bottom:0" id="plano-subtitle"></p>
            </div>
          </div>
          <div class="road" id="road"></div>
        </div>
        <div id="lesson-container" style="display:none"></div>

        <div id="exam-panel" style="display:none">
          <div id="exam-intro-panel">
            <button class="btn btn-sm" onclick="hideExam()" style="margin-bottom:1rem;display:none" id="exam-back-btn" data-i18n="← Voltar">← Voltar</button>
            <h1 data-i18n="Exame de Nivelamento">Exame de Nivelamento</h1>
            <p class="subtitle" data-i18n="Três fases · ~10 minutos · A IA determina seu nível">Três fases · ~10 minutos · A IA determina seu nível</p>
            <div class="card">
              <p style="font-size:15px;line-height:1.7;margin-bottom:1rem" data-i18n="Este exame avalia seu inglês em leitura, escrita livre e gramática. Ao final você recebe um nível CEFR (A1 a C2) e seu plano de estudos é gerado automaticamente.">Este exame avalia seu inglês em leitura, escrita livre e gramática. Ao final você recebe um nível CEFR (A1 a C2) e seu plano de estudos é gerado automaticamente.</p>
              <button class="btn btn-primary" onclick="startExam()" data-i18n="Começar →">Começar →</button>
            </div>
            <div id="exam-prev" style="display:none">
              <div class="card" style="border:2px solid var(--color-border-info)">
                <div style="font-size:13px;color:var(--color-text-secondary);margin-bottom:4px" data-i18n="Último resultado">Último resultado</div>
                <div id="exam-prev-level" style="font-size:22px;font-weight:500;margin-bottom:4px"></div>
                <div id="exam-prev-date" style="font-size:13px;color:var(--color-text-secondary)"></div>
                <button class="btn btn-sm" style="margin-top:1rem" onclick="startExam()" data-i18n="Refazer exame">Refazer exame</button>
              </div>
            </div>
          </div>
          <div id="exam-phase-panel" style="display:none">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem">
              <div><div style="font-size:13px;color:var(--color-text-secondary)" id="phase-label"></div><div style="font-size:16px;font-weight:500" id="phase-title"></div></div>
              <div style="display:flex;gap:5px" id="phase-dots"></div>
            </div>
            <div id="phase-content"></div>
            <div style="margin-top:1.25rem;display:flex;gap:8px;flex-wrap:wrap" id="phase-actions"></div>
          </div>
          <div id="exam-grading-panel" style="display:none;text-align:center;padding:3rem 1rem">
            <div style="font-size:32px;margin-bottom:1rem">⏳</div>
            <div style="font-size:16px;font-weight:500;margin-bottom:8px" data-i18n="Avaliando suas respostas...">Avaliando suas respostas...</div>
          </div>
          <div id="exam-result-panel" style="display:none">
            <div class="card" style="margin-bottom:1rem;border:2px solid var(--color-border-info)">
              <div style="font-size:13px;color:var(--color-text-secondary);margin-bottom:4px" data-i18n="Seu nível CEFR">Seu nível CEFR</div>
              <div id="result-level" style="font-size:48px;font-weight:500;margin-bottom:6px"></div>
              <div id="result-label" style="font-size:16px;font-weight:500;margin-bottom:10px"></div>
              <div id="result-desc" style="font-size:14px;line-height:1.7;color:var(--color-text-secondary);margin-bottom:1rem"></div>
              <div style="border-top:0.5px solid var(--color-border-tertiary);padding-top:1rem">
                <div id="result-breakdown" style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px"></div>
              </div>
            </div>
            <button class="btn btn-primary" onclick="afterExam()" data-i18n="Ver meu plano →">Ver meu plano →</button>
          </div>
        </div>
      </div>

      </div><!-- end main-app -->

      <div id="explorar" class="section">
        <div id="exp-home">
          <h1 data-i18n="Explorar">Explorar</h1>
          <p class="subtitle">Ferramentas livres — sem roteiro</p>
          <div class="exp-grid">
            <div class="exp-tile" onclick="expShow('stories')"><div class="exp-tile-icon">📖</div><div class="exp-tile-name" data-i18n="Histórias">Histórias</div><div class="exp-tile-desc" data-i18n="Leitura em inglês com tradução">Leitura em inglês com tradução</div></div>
            <div class="exp-tile" onclick="expShow('debate')"><div class="exp-tile-icon">⚔️</div><div class="exp-tile-name" data-i18n="Debate">Debate</div><div class="exp-tile-desc" data-i18n="A IA joga contra você (em inglês)">A IA joga contra você (em inglês)</div></div>
            <div class="exp-tile" onclick="expShow('topics')"><div class="exp-tile-icon">🔍</div><div class="exp-tile-name" data-i18n="Gramática">Gramática</div><div class="exp-tile-desc" data-i18n="Pergunte o que quiser">Pergunte o que quiser</div></div>
            <div class="exp-tile" onclick="expShow('vocab')"><div class="exp-tile-icon">📚</div><div class="exp-tile-name" data-i18n="Vocabulário">Vocabulário</div><div class="exp-tile-desc" data-i18n="Palavras salvas">Palavras salvas</div></div>
          </div>
        </div>
        <div id="exp-stories" style="display:none">
          <button class="btn btn-sm" onclick="expBack()" style="margin-bottom:1rem" data-i18n="← Explorar">← Explorar</button>
          <div id="exp-story-list">
            <div class="card card-btn" onclick="expOpenStory(0)"><span class="tag tag-green" data-i18n="Igreja">Igreja</span><div style="font-size:15px;font-weight:500">The Sunday visitor</div><div style="font-size:13px;color:var(--color-text-secondary)">Um missionário americano visita a IBBV</div></div>
            <div class="card card-btn" onclick="expOpenStory(1)"><span class="tag tag-amber" data-i18n="Cotidiano">Cotidiano</span><div style="font-size:15px;font-weight:500">At the grocery store</div><div style="font-size:13px;color:var(--color-text-secondary)">Comprando o básico em inglês</div></div>
            <div class="card card-btn" onclick="expOpenStory(2)"><span class="tag tag-coral" data-i18n="Família">Família</span><div style="font-size:15px;font-weight:500">Talking about my family</div><div style="font-size:13px;color:var(--color-text-secondary)">Uma apresentação simples</div></div>
            <div class="card card-btn" onclick="expGenStory()"><span class="tag tag-purple" data-i18n="+ Nova">+ Nova</span><div style="font-size:15px;font-weight:500" data-i18n="Gerar nova história">Gerar nova história</div><div style="font-size:13px;color:var(--color-text-secondary)" data-i18n="A IA cria para você">A IA cria para você</div></div>
          </div>
          <div id="exp-reading" style="display:none">
            <div id="exp-read-phase">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.75rem">
                <p style="font-size:13px;color:var(--color-text-secondary)" data-i18n="Leia. Toque nas palavras destacadas para ver a tradução.">Leia. Toque nas palavras destacadas para ver a tradução.</p>
                <button class="btn btn-sm" onclick="expHideText()" data-i18n="Pronto →">Pronto →</button>
              </div>
              <div class="card" style="background:var(--color-background-secondary);border:none"><div id="exp-story-text" class="story-text" style="font-size:15px"></div></div>
            </div>
            <div id="exp-after-read" style="display:none">
              <h2 id="exp-story-title" style="font-size:18px;font-weight:500;margin-bottom:.5rem"></h2>
              <p id="exp-story-ctx" class="subtitle"></p>
              <button class="btn btn-primary" onclick="expStartChat()" data-i18n="Conversar (em inglês) →">Conversar (em inglês) →</button>
              <button class="btn btn-sm" style="margin-left:8px" onclick="expBackToStoryList()" data-i18n="Outra história">Outra história</button>
            </div>
          </div>
          <div id="exp-chat" style="display:none">
            <button class="btn btn-sm" onclick="expBackToReading()" style="margin-bottom:1rem" data-i18n="← História">← História</button>
            <div class="chat-wrap">
              <div class="chat-header"><strong id="exp-char"></strong><p id="exp-scenario"></p></div>
              <div class="messages" id="exp-messages"></div>
              <div class="voice-status" id="exp-vstatus"></div>
              <div class="chat-input-row">
                <button class="btn btn-icon" id="exp-mic" onclick="toggleExpMic()">🎤</button>
                <textarea id="exp-input" rows="2" placeholder="Responda em inglês..." data-i18n-ph="Responda em inglês..."></textarea>
                <button class="btn btn-primary btn-icon" onclick="expSendChat()">→</button>
              </div>
            </div>
          </div>
        </div>
        <div id="exp-debate" style="display:none">
          <button class="btn btn-sm" onclick="expBack()" style="margin-bottom:1rem" data-i18n="← Explorar">← Explorar</button>
          <div id="exp-debate-setup">
            <p class="subtitle" data-i18n="A IA defende o lado oposto. Argumente em inglês.">A IA defende o lado oposto. Argumente em inglês.</p>
            <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:1rem">
              <button class="btn btn-sm" onclick="setExpTopic('Learning English is essential for everyone today')">English for all?</button>
              <button class="btn btn-sm" onclick="setExpTopic('Faith should guide every decision in life')">Faith and decisions</button>
              <button class="btn btn-sm" onclick="setExpTopic('Big cities are better than small towns')">City vs town</button>
              <button class="btn btn-sm" onclick="setExpTopic('Technology brings families closer together')">Technology and family</button>
            </div>
            <input id="exp-debate-topic" placeholder="Ou escreva seu tema (em inglês)..." data-i18n-ph="Ou escreva seu tema (em inglês)..." style="width:100%;border:0.5px solid var(--color-border-tertiary);border-radius:8px;padding:10px 12px;font-size:15px;font-family:inherit;background:var(--color-background-primary);margin-bottom:8px;color:#1a1a18">
            <button class="btn btn-primary" onclick="expStartDebate()" data-i18n="Começar →">Começar →</button>
          </div>
          <div id="exp-debate-chat" style="display:none">
            <div class="card" style="padding:.75rem 1rem;margin-bottom:1rem;display:flex;justify-content:space-between;align-items:center">
              <span style="font-size:14px" id="exp-debate-label"></span><span class="tag tag-coral" style="margin:0" data-i18n="Debate">Debate</span>
            </div>
            <div class="chat-wrap">
              <div class="messages" id="exp-debate-msgs"></div>
              <div class="voice-status" id="exp-debate-vstatus"></div>
              <div class="chat-input-row">
                <button class="btn btn-icon" id="exp-debate-mic" onclick="toggleExpDebateMic()">🎤</button>
                <textarea id="exp-debate-input" rows="2" placeholder="Argumente em inglês..." data-i18n-ph="Argumente em inglês..."></textarea>
                <button class="btn btn-primary btn-icon" onclick="expSendDebate()">→</button>
              </div>
            </div>
          </div>
        </div>
        <div id="exp-topics" style="display:none">
          <button class="btn btn-sm" onclick="expBack()" style="margin-bottom:1rem" data-i18n="← Explorar">← Explorar</button>
          <div id="exp-topic-grid" class="topic-grid">
            <button class="topic-btn" onclick="expStartTopic('articles','Artigos (a/an/the)')"><div style="font-size:18px;margin-bottom:5px">A</div><div style="font-size:14px;font-weight:500" data-i18n="Artigos">Artigos</div><div style="font-size:12px;color:var(--color-text-secondary)">a, an, the</div></button>
            <button class="topic-btn" onclick="expStartTopic('to_be','Verbo to be')"><div style="font-size:18px;margin-bottom:5px">↔</div><div style="font-size:14px;font-weight:500" data-i18n="Verbo to be">Verbo to be</div><div style="font-size:12px;color:var(--color-text-secondary)">am, is, are</div></button>
            <button class="topic-btn" onclick="expStartTopic('present_simple','Presente simples')"><div style="font-size:18px;margin-bottom:5px">⏱</div><div style="font-size:14px;font-weight:500">Present simple</div><div style="font-size:12px;color:var(--color-text-secondary)" data-i18n="rotina e fatos">rotina e fatos</div></button>
            <button class="topic-btn" onclick="expStartTopic('past_simple','Passado simples')"><div style="font-size:18px;margin-bottom:5px">⟲</div><div style="font-size:14px;font-weight:500">Past simple</div><div style="font-size:12px;color:var(--color-text-secondary)" data-i18n="ontem, na semana passada">ontem, na semana passada</div></button>
            <button class="topic-btn" onclick="expStartTopic('prepositions','Preposições')"><div style="font-size:18px;margin-bottom:5px">↗</div><div style="font-size:14px;font-weight:500" data-i18n="Preposições">Preposições</div><div style="font-size:12px;color:var(--color-text-secondary)">in, on, at...</div></button>
            <button class="topic-btn" onclick="expStartTopic('plurals','Plurais')"><div style="font-size:18px;margin-bottom:5px">✦</div><div style="font-size:14px;font-weight:500" data-i18n="Plurais">Plurais</div><div style="font-size:12px;color:var(--color-text-secondary)" data-i18n="-s, -es, irregulares">-s, -es, irregulares</div></button>
            <button class="topic-btn" onclick="expStartTopic('questions','Perguntas')"><div style="font-size:18px;margin-bottom:5px">❓</div><div style="font-size:14px;font-weight:500" data-i18n="Perguntas">Perguntas</div><div style="font-size:12px;color:var(--color-text-secondary)">do, does, did, wh-</div></button>
            <button class="topic-btn" onclick="expStartTopic('false_cognates','Falsos cognatos')"><div style="font-size:18px;margin-bottom:5px">⚠</div><div style="font-size:14px;font-weight:500" data-i18n="Falsos cognatos">Falsos cognatos</div><div style="font-size:12px;color:var(--color-text-secondary)">pretend ≠ pretender</div></button>
          </div>
          <div id="exp-topic-chat" style="display:none">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
              <strong id="exp-topic-title"></strong>
              <button class="btn btn-sm" onclick="resetExpTopics()" data-i18n="← Tópicos">← Tópicos</button>
            </div>
            <div class="chat-wrap">
              <div class="explore-messages" id="exp-topic-msgs"></div>
              <div class="explore-input-row">
                <input id="exp-topic-input" placeholder="Pergunte algo (em português)..." data-i18n-ph="Pergunte algo (em português)..." onkeydown="if(event.key==='Enter')expSendTopic()">
                <button class="btn btn-primary btn-sm" onclick="expSendTopic()">→</button>
              </div>
            </div>
          </div>
        </div>
        <div id="exp-vocab" style="display:none">
          <button class="btn btn-sm" onclick="expBack()" style="margin-bottom:1rem" data-i18n="← Explorar">← Explorar</button>
          <h2 style="font-size:16px;font-weight:500;margin-bottom:1rem" data-i18n="Vocabulário salvo">Vocabulário salvo</h2>
          <div id="exp-vocab-list"></div>
        </div>
      </div>

      <div class="ev-version-tag">English Vivo v<?php echo esc_html(EV_VERSION); ?></div>
    </div>
    </div>
    <?php
    return ob_get_clean();
});
