const { Builder, By, until } = require('selenium-webdriver');
const path = require('path');

// URL do nosso arquivo local
const URL = 'file://' + path.resolve(__dirname, '../formulario.html');

// ===================================================================
// FUNÇÃO AUXILIAR PARA DIGITAÇÃO LENTA
// ===================================================================
/**
 * Digita um texto em um elemento de forma lenta, caractere por caractere.
 * @param {WebElement} element - O elemento onde o texto será digitado.
 * @param {string} text - O texto a ser digitado.
 * @param {number} [delay=100] - O tempo de espera em milissegundos entre cada caractere.
 */
async function typeSlowly(driver, element, text, delay = 100) {
    for (const char of text) {
        await element.sendKeys(char);
        await driver.sleep(delay);
    }
}
// ===================================================================


// Função auxiliar para esperar e obter o texto da mensagem
async function obterMensagem(driver) {
    const elementoMensagem = await driver.wait(until.elementLocated(By.id('mensagem')), 5000);
    return await elementoMensagem.getText();
}

// --- Cenários de Teste ---

async function testarEnvioComSucesso(driver) {
    console.log("\n--- Cenário 1: Envio com Sucesso ---");
    await driver.get(URL); // Garante que a página está "limpa"

    // Usando a função de digitação lenta
    const nomeElement = await driver.findElement(By.id('nome'));
    await typeSlowly(driver, nomeElement, 'João da Silva');

    const emailElement = await driver.findElement(By.id('email'));
    await typeSlowly(driver, emailElement, 'joao.silva@example.com');

    const senhaElement = await driver.findElement(By.id('senha'));
    await typeSlowly(driver, senhaElement, 'senha12345');

    await driver.findElement(By.id('masculino')).click();
    await driver.findElement(By.id('cidade')).sendKeys('São Paulo'); // Select pode usar sendKeys normal
    await driver.findElement(By.id('termos')).click();
    
    await driver.findElement(By.css('button[type="submit"]')).click();

    await driver.sleep(3000);

    const mensagem = await obterMensagem(driver);
    if (mensagem.includes('Sucesso! Cadastro de João da Silva')) {
        console.log('✅ PASSOU: Mensagem de sucesso exibida corretamente.');
    } else {
        console.log(`❌ FALHOU: Mensagem inesperada. Recebido: "${mensagem}"`);
    }
}

async function testarFalhaNomeVazio(driver) {
    console.log("\n--- Cenário 2: Falha - Nome Vazio ---");
    await driver.get(URL);

    // Preenche tudo menos o nome
    const emailElement = await driver.findElement(By.id('email'));
    await typeSlowly(driver, emailElement, 'joao.silva@example.com');

    const senhaElement = await driver.findElement(By.id('senha'));
    await typeSlowly(driver, senhaElement, 'senha12345');

    await driver.findElement(By.id('masculino')).click();
    await driver.findElement(By.id('cidade')).sendKeys('São Paulo');
    await driver.findElement(By.id('termos')).click();

    await driver.findElement(By.css('button[type="submit"]')).click();

    await driver.sleep(3000);

    const mensagem = await obterMensagem(driver);
    if (mensagem.includes('Erro: O campo Nome é obrigatório.')) {
        console.log('✅ PASSOU: Mensagem de erro para nome vazio exibida.');
    } else {
        console.log(`❌ FALHOU: Mensagem inesperada. Recebido: "${mensagem}"`);
    }
}

async function testarFalhaSenhaCurta(driver) {
    console.log("\n--- Cenário 3: Falha - Senha Curta ---");
    await driver.get(URL);
    
    const nomeElement = await driver.findElement(By.id('nome'));
    await typeSlowly(driver, nomeElement, 'João da Silva');

    const emailElement = await driver.findElement(By.id('email'));
    await typeSlowly(driver, emailElement, 'joao.silva@example.com');
    
    const senhaElement = await driver.findElement(By.id('senha'));
    await typeSlowly(driver, senhaElement, '123'); // Senha curta

    await driver.findElement(By.id('masculino')).click();
    await driver.findElement(By.id('cidade')).sendKeys('São Paulo');
    await driver.findElement(By.id('termos')).click();

    await driver.findElement(By.css('button[type="submit"]')).click();

    await driver.sleep(3000);

    const mensagem = await obterMensagem(driver);
    if (mensagem.includes('Erro: A senha deve ter pelo menos 8 caracteres.')) {
        console.log('✅ PASSOU: Mensagem de erro para senha curta exibida.');
    } else {
        console.log(`❌ FALHOU: Mensagem inesperada. Recebido: "${mensagem}"`);
    }
}

async function testarFalhaTermosNaoAceitos(driver) {
    console.log("\n--- Cenário 4: Falha - Termos Não Aceitos ---");
    await driver.get(URL);

    const nomeElement = await driver.findElement(By.id('nome'));
    await typeSlowly(driver, nomeElement, 'João da Silva');

    const emailElement = await driver.findElement(By.id('email'));
    await typeSlowly(driver, emailElement, 'joao.silva@example.com');

    const senhaElement = await driver.findElement(By.id('senha'));
    await typeSlowly(driver, senhaElement, 'senha12345');

    await driver.findElement(By.id('masculino')).click();
    await driver.findElement(By.id('cidade')).sendKeys('São Paulo');
    // Não clica nos termos

    await driver.findElement(By.css('button[type="submit"]')).click();

    await driver.sleep(3000);

    const mensagem = await obterMensagem(driver);
    if (mensagem.includes('Erro: Você deve aceitar os termos de uso.')) {
        console.log('✅ PASSOU: Mensagem de erro para termos não aceitos exibida.');
    } else {
        console.log(`❌ FALHOU: Mensagem inesperada. Recebido: "${mensagem}"`);
    }
}


// --- Função Principal que Executa Todos os Testes ---
async function executarTodosOsTestes() {
    let driver = await new Builder().forBrowser('chrome').build();
    console.log('Iniciando a suíte de testes do formulário (com digitação lenta)...');

    try {
        await testarEnvioComSucesso(driver);
        await testarFalhaNomeVazio(driver);
        await testarFalhaSenhaCurta(driver);
        await testarFalhaTermosNaoAceitos(driver);
        console.log('\n🎉 Suíte de testes concluída!');
    } catch (error) {
        console.error('\n💥 Ocorreu um erro inesperado durante os testes:', error);
    } finally {
        await driver.quit();
        console.log('Navegador fechado.');
    }
}

// Inicia os testes
executarTodosOsTestes();