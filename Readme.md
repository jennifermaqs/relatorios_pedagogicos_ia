# 📝 Gerador de Relatórios Pedagógicos com IA

Uma extensão para Chrome desenvolvida para auxiliar professores na elaboração de relatórios individuais de alunos. A ferramenta utiliza a API do **Google Gemini 2.0 Flash** para transformar observações breves em textos pedagógicos completos, formais e estruturados.

> **Projeto desenvolvido com foco em produtividade docente e integração com Inteligência Artificial Generativa.**

## 🚀 Funcionalidades

* **Geração Automática:** Transforma anotações simples e tópicos em um relatório dissertativo completo.
* **Estrutura Pedagógica:** O texto é gerado seguindo os pilares:
    * Aspectos Físicos e Psicomotores
    * Aspectos Sociais
    * Aspectos Emocionais
    * Aspectos Cognitivos
    * Conclusão com mensagem à família
* **Personalização:** Permite configurar dados padrão (Turma, Idade, Nome do Professor) para não precisar digitar repetidamente.
* **Histórico de Configuração:** Salva suas preferências e API Key localmente usando o `chrome.storage`.
* **Fácil Exportação:** Botão dedicado para copiar o relatório gerado para a área de transferência.

## 🛠️ Tecnologias Utilizadas

* **JavaScript (ES6+)**
* **HTML5 & CSS3**
* **Chrome Extensions API (Manifest V3)**
    * `chrome.storage` para persistência de dados.
    * `chrome.runtime` para comunicação entre scripts.
* **Google Gemini API** (Model: `gemini-2.0-flash`)

## 📦 Como Instalar

Como esta extensão ainda não está publicada na Chrome Web Store, você deve instalá-la em modo de desenvolvedor:
1.  Faça o download deste repositório ou clone-o em sua máquina:
    ```bash
    git clone [https://github.com/jennifermaqs/relatorios_pedagogicos_ia.git]
    ```
2.  Abra o navegador Chrome e acesse: `chrome://extensions/`
3.  No canto superior direito, ative o botão **Modo do desenvolvedor**.
4.  Clique no botão **Carregar sem compactação**.
5.  Selecione a pasta onde você salvou os arquivos do projeto.
6.  A extensão aparecerá na sua barra de ferramentas!

## ⚙️ Configuração Obrigatória

Para que a extensão funcione, é necessário obter uma chave de API gratuita do Google:
1.  Acesse o [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  Gere uma **API Key**.
3.  Na extensão, clique com o botão direito no ícone e vá em **Opções** (ou clique no botão de engrenagem na interface).
4.  Cole sua chave no campo "API Key" e clique em **Salvar Configurações**.
5.  Você pode clicar em "Testar API Key" para garantir que a conexão está funcionando.


**Desenvolvido para auxiliar educadores** 🍎