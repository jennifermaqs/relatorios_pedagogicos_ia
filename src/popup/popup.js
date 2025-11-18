document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('relatorioForm');
    const nomeAlunoInput = document.getElementById('nomeAluno');
    const periodoSelect = document.getElementById('periodo');
    const periodoPersonalizadoInput = document.getElementById('periodoPersonalizado');
    const turmaInput = document.getElementById('turma');
    const idadeInput = document.getElementById('idade');
    const professoraInput = document.getElementById('professora');
    const anotacoesTextarea = document.getElementById('anotacoes');
    const gerarBtn = document.getElementById('gerarBtn');
    const loadingDiv = document.getElementById('loading');
    const errorDiv = document.getElementById('error');
    const relatorioSection = document.getElementById('relatorioSection');
    const relatorioTexto = document.getElementById('relatorioTexto');
    const copiarBtn = document.getElementById('copiarBtn');
    const configBtn = document.getElementById('configBtn');

    async function carregarConfiguracoes() {
        try {
            const result = await chrome.storage.sync.get(['apiKey', 'turma', 'idade', 'professora', 'periodoPadrao']);
            
            console.log('Configurações carregadas:', result);
            
            if (!result.apiKey) {
                mostrarErro('Configure sua API key nas configurações da extensão primeiro.');
                gerarBtn.disabled = true;
            } else {
                console.log('API Key encontrada');
                gerarBtn.disabled = false;
            }

            if (result.periodoPadrao) {
                periodoSelect.value = result.periodoPadrao;
                periodoSelect.dispatchEvent(new Event('change'));
            }

            if (result.turma) {
                turmaInput.placeholder = `Padrão: ${result.turma}`;
            }
            if (result.idade) {
                idadeInput.placeholder = `Padrão: ${result.idade}`;
            }
            if (result.professora) {
                professoraInput.placeholder = `Padrão: ${result.professora}`;
            }
        } catch (error) {
            console.error('Erro ao carregar configurações:', error);
            mostrarErro('Erro ao carregar configurações.');
        }
    }

    async function gerarRelatorio(nomeAluno, periodo, anotacoes) {
        mostrarLoading(true);
        esconderErro();
        esconderRelatorio();

        try {
            const config = await chrome.storage.sync.get(['apiKey', 'turma', 'idade', 'professora']);
            
            if (!config.apiKey) {
                throw new Error('API Key não configurada. Configure nas opções da extensão.');
            }

            const turma = turmaInput.value.trim() || config.turma || 'INFANTIL V-A';
            const idade = idadeInput.value.trim() || config.idade || '5 ANOS';
            const professora = professoraInput.value.trim() || config.professora || 'TIA MILVIA';

            const prompt = `
CRIAR UM RELATÓRIO INDIVIDUAL ${periodo.toUpperCase()}
NOME DO ALUNO: ${nomeAluno}
TURMA: ${turma}
IDADE: ${idade}
PROFESSORA: ${professora}

ANOTAÇÕES DO PROFESSOR:
${anotacoes}

INSTRUÇÕES IMPORTANTES:
SEGUIR AS INSTRUÇÕES ABAIXO E NO FINAL DEIXAR UMA CONCLUSÃO COM MENSAGEM DE INCENTIVO DIRECIONADA À FAMÍLIA. USAR UMA LINGUAGEM FORMAL, CLARA, OBJETIVA E DESCRITIVA, EVITANDO TERMOS TÉCNICOS EXCESSIVOS, JULGAMENTOS E COMPARAÇÕES.

ESPECIFICAMENTE PARA A SEÇÃO "CONCLUSÃO E MENSAGEM DE INCENTIVO":
- Faça um resumo geral do desenvolvimento do aluno
- Destaque os pontos fortes e aspectos que precisam de atenção
- Inclua uma mensagem direcionada à família aconselhando sobre o ponto de atenção, caso haja, e convidando para uma parceria com a escola
- Foque na importância do acompanhamento familiar e da frequência escolar
- Seja encorajador e ofereça disponibilidade para diálogo
- Evite mensagens muito curtas ou genéricas diretamente para a criança

ESTRUTURA OBRIGATÓRIA (divida o relatório nestas seções):
1. Aspectos Físicos e Psicomotores
2. Aspectos Sociais
3. Aspectos Emocionais
4. Aspectos Cognitivos
5. Conclusão e Mensagem de Incentivo
`;

            const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${config.apiKey}`;

            console.log('Enviando solicitação...');

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Erro da API:', errorData);
                throw new Error(errorData.error?.message || `Erro HTTP: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                const relatorio = data.candidates[0].content.parts[0].text;
                console.log('✅ Relatório gerado!');
                mostrarRelatorio(relatorio);
            } else {
                throw new Error('Resposta inesperada da API');
            }

        } catch (error) {
            console.error('Erro ao gerar relatório:', error);
            mostrarErro(`Erro: ${error.message}`);
        } finally {
            mostrarLoading(false);
        }
    }

    function mostrarLoading(mostrar) {
        if (mostrar) {
            loadingDiv.classList.remove('hidden');
            gerarBtn.disabled = true;
            gerarBtn.textContent = 'Gerando...';
        } else {
            loadingDiv.classList.add('hidden');
            gerarBtn.disabled = false;
            gerarBtn.textContent = 'Gerar Relatório';
        }
    }

    function mostrarErro(mensagem) {
        errorDiv.textContent = mensagem;
        errorDiv.classList.remove('hidden');
    }

    function esconderErro() {
        errorDiv.classList.add('hidden');
    }

    function mostrarRelatorio(texto) {
        relatorioTexto.textContent = texto;
        relatorioSection.classList.remove('hidden');
    }

    function esconderRelatorio() {
        relatorioSection.classList.add('hidden');
    }

    function mostrarMensagemSucesso(mensagem) {
        alert(mensagem);
    }

   
    carregarConfiguracoes();

    periodoSelect.addEventListener('change', function() {
        if (this.value === 'outro') {
            periodoPersonalizadoInput.classList.remove('hidden');
            periodoPersonalizadoInput.required = true;
        } else {
            periodoPersonalizadoInput.classList.add('hidden');
            periodoPersonalizadoInput.required = false;
        }
    });

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const nomeAluno = nomeAlunoInput.value.trim();
        const anotacoes = anotacoesTextarea.value.trim();
        let periodo = periodoSelect.value;

        if (periodo === 'outro') {
            periodo = periodoPersonalizadoInput.value.trim();
            if (!periodo) {
                mostrarErro('Digite o período personalizado.');
                return;
            }
        }

        if (!nomeAluno || !anotacoes) {
            mostrarErro('Preencha o nome do aluno e suas anotações.');
            return;
        }

        await gerarRelatorio(nomeAluno, periodo, anotacoes);
    });

    copiarBtn.addEventListener('click', async function() {
        const texto = relatorioTexto.textContent;
        try {
            await navigator.clipboard.writeText(texto);
            mostrarMensagemSucesso('Relatório copiado para a área de transferência!');
        } catch (err) {
            console.error('Erro ao copiar:', err);
            mostrarErro('Erro ao copiar o texto. Tente selecionar e copiar manualmente.');
        }
    });

    configBtn.addEventListener('click', function() {
        chrome.runtime.openOptionsPage();
    });
});