const { Builder, By, Key, until } = require('selenium-webdriver');

async function testeDeLogin() {
    const driver = await new Builder().forBrowser('firefox').build();
    
    try {
        // Dados de teste
        const URL = 'https://the-internet.herokuapp.com/login'; // Site de testes público
        const USER = 'tomsmith';
        const PASS = 'SuperSecretPassword!';
        const MENSAGEM_SUCESSO_ESPERADA = 'You logged into a secure area!';

        // 1. Abrir a página de login
        await driver.get(URL);

        // 2. Preencher o nome de usuário
        await driver.findElement(By.id('username')).sendKeys(USER);

        // 3. Preencher a senha
        await driver.findElement(By.id('password')).sendKeys(PASS);

        // 4. Clicar no botão de login
        await driver.findElement(By.css('button[type="submit"]')).click();

        // 5. Esperar a mensagem de sucesso aparecer e validá-la
        // Usamos uma espera explícita para garantir que a mensagem esteja visível
        let elementoMensagem = await driver.wait(
            until.elementLocated(By.id('flash')), 
            10000 // Timeout de 10 segundos
        );

        let mensagemTexto = await elementoMensagem.getText();
        
        // 6. Verificação (Assertion)
        if (mensagemTexto.includes(MENSAGEM_SUCESSO_ESPERADA)) {
            console.log('✅ Teste de Login PASSOU!');
        } else {
            console.log(`❌ Teste de Login FALHOU! Mensagem recebida: "${mensagemTexto}"`);
        }

    } catch (error) {
        console.error('Ocorreu um erro no teste de login:', error);
    } finally {
        await driver.quit();
    }
}

testeDeLogin();