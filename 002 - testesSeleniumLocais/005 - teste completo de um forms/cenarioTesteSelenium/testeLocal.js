const { Builder, By, until } = require('selenium-webdriver');
const path = require('path');

// URL do nosso arquivo local
const URL = 'file://' + path.resolve(__dirname, '../formulario.html');

// Função auxiliar para esperar e obter o texto da mensagem
async function obterMensagem(driver) {
    const elementoMensagem = await driver.wait(until.elementLocated(By.id('mensagem')), 5000);
    return await elementoMensagem.getText();
}

// --- Cenários de Teste ---

async function testarEnvioComSucesso(driver) {
    console.log("\n--- Cenário 1: Envio com Sucesso ---");
    await driver.get(URL); // Garante que a página está "limpa"

    await driver.findElement(By.id('nome')).sendKeys('João da Silva');
    await driver.findElement(By.id('email')).sendKeys('joao.silva@example.com');
    await driver.findElement(By.id('senha')).sendKeys('senha12345');
    await driver.findElement(By.id('masculino')).click();
    await driver.findElement(By.id('cidade')).sendKeys('São Paulo'); // Pode usar sendKeys em selects
    await driver.findElement(By.id('termos')).click();
    
    await driver.findElement(By.css('button[type="submit"]')).click();
    
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
    await driver.findElement(By.id('email')).sendKeys('joao.silva@example.com');
    await driver.findElement(By.id('senha')).sendKeys('senha12345');
    await driver.findElement(By.id('masculino')).click();
    await driver.findElement(By.id('cidade')).sendKeys('São Paulo');
    await driver.findElement(By.id('termos')).click();

    await driver.findElement(By.css('button[type="submit"]')).click();

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
    
    await driver.findElement(By.id('nome')).sendKeys('João da Silva');
    await driver.findElement(By.id('email')).sendKeys('joao.silva@example.com');
    await driver.findElement(By.id('senha')).sendKeys('123'); // Senha curta
    await driver.findElement(By.id('masculino')).click();
    await driver.findElement(By.id('cidade')).sendKeys('São Paulo');
    await driver.findElement(By.id('termos')).click();

    await driver.findElement(By.css('button[type="submit"]')).click();

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

    await driver.findElement(By.id('nome')).sendKeys('João da Silva');
    await driver.findElement(By.id('email')).sendKeys('joao.silva@example.com');
    await driver.findElement(By.id('senha')).sendKeys('senha12345');
    await driver.findElement(By.id('masculino')).click();
    await driver.findElement(By.id('cidade')).sendKeys('São Paulo');
    // Não clica nos termos

    await driver.findElement(By.css('button[type="submit"]')).click();

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
    console.log('Iniciando a suíte de testes do formulário...');

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