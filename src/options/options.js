document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('configForm');
    const apiKeyInput = document.getElementById('apiKey');
    const turmaInput = document.getElementById('turma');
    const idadeInput = document.getElementById('idade');
    const professoraInput = document.getElementById('professora'); 
    const periodoPadraoSelect = document.getElementById('periodoPadrao');
    const testarBtn = document.getElementById('testarBtn');
    const statusDiv = document.getElementById('status');

    carregarConfiguracoes();

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        await salvarConfiguracoes();
    });

    testarBtn.addEventListener('click', async function() {
        await testarAPIKey();
    });

    async function carregarConfiguracoes() {
        try {
            const result = await chrome.storage.sync.get([
                'apiKey',
                'turma',
                'idade',
                'professora',
                'periodoPadrao'
            ]);

            if (result.apiKey) {
                apiKeyInput.value = result.apiKey;
            }
            if (result.turma) {
                turmaInput.value = result.turma;
            }
            if (result.idade) {
                idadeInput.value = result.idade;
            }
            if (result.professora) {
                professoraInput.value = result.professora;
            }
            if (result.periodoPadrao) {
                periodoPadraoSelect.value = result.periodoPadrao;
            }
        } catch (error) {
            console.error('Erro ao carregar configurações:', error);
            mostrarStatus('Erro ao carregar configurações', 'error');
        }
    }

    async function salvarConfiguracoes() {
        const config = {
            apiKey: apiKeyInput.value.trim(),
            turma: turmaInput.value.trim(),
            idade: idadeInput.value.trim(),
            professora: professoraInput.value.trim(),
            periodoPadrao: periodoPadraoSelect.value
        };

        if (!config.apiKey) {
            mostrarStatus('A API Key é obrigatória', 'error');
            return;
        }

        try {
            await chrome.storage.sync.set(config);
            mostrarStatus('Configurações salvas!', 'success');
        } catch (error) {
            console.error('Erro ao salvar configurações:', error);
            mostrarStatus('Erro ao salvar configurações', 'error');
        }
    }

    async function testarAPIKey() {
    const apiKey = apiKeyInput.value.trim();
    
    if (!apiKey) {
        mostrarStatus('Digite sua API Key para testar', 'error');
        return;
    }

    mostrarStatus('Testando...', 'success');

    try {
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: 'Teste de conexão, responda apenas com "ok" se estiver funcionando'
                    }]
                }]
            })
        });

        if (response.ok) {
            const data = await response.json();
            mostrarStatus('✅ API Key válida!', 'success');
        } else {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Erro na API');
        }

    } catch (error) {
        console.error('Erro ao testar API Key:', error);
        mostrarStatus(`❌ Erro: ${error.message}`, 'error');
    }
}

    function mostrarStatus(mensagem, tipo) {
        statusDiv.textContent = mensagem;
        statusDiv.className = `status ${tipo}`;
        statusDiv.classList.remove('hidden');

        setTimeout(() => {
            statusDiv.classList.add('hidden');
        }, 5000);
    }

    async function salvarConfiguracoes() {
    const config = {
        apiKey: apiKeyInput.value.trim(),
        turma: turmaInput.value.trim(),
        idade: idadeInput.value.trim(),
        professora: professoraInput.value.trim(),
        periodoPadrao: periodoPadraoSelect.value
    };

    if (!config.apiKey) {
        mostrarStatus('A API Key é obrigatória', 'error');
        return;
    }

    try {
        await chrome.storage.sync.set(config);
        
        const saved = await chrome.storage.sync.get(['apiKey']);
        console.log('API Key salva:', saved.apiKey ? '✅ Sim' : '❌ Não');
        
        mostrarStatus('Configurações salvas!', 'success');
    } catch (error) {
        console.error('Erro ao salvar configurações:', error);
        mostrarStatus('Erro ao salvar configurações', 'error');
    }
}
});
