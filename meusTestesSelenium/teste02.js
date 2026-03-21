// Importa as classes necessárias da biblioteca selenium-webdriver
const { Builder, By, Key } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');

// Função assíncrona para executar o teste
async function meuPrimeiroTeste() {
    // Configura as opções do Chrome (opcional, mas útil)
    let options = new firefox.Options();
    // options.addArguments('--headless'); // Descomente esta linha para rodar sem abrir a janela do navegador

    // Cria uma instância do navegador Chrome
    let driver = await new Builder()
        .forBrowser('firefox')
        .setChromeOptions(options)
        .build();

    try {
        // 1. Navega até a página do Google
        await driver.get('https://www.google.com');

        // 2. Encontra o campo de pesquisa pelo seu nome ('q')
        let campoDePesquisa = await driver.findElement(By.name('q'));

        // 3. Digita "Selenium WebDriver" no campo e pressiona Enter
        await campoDePesquisa.sendKeys('Selenium WebDriver', Key.RETURN);

        // 4. Espera um pouco para a página carregar (só para demonstração)
        await driver.sleep(2000); // Não é a melhor forma de esperar, vamos ver uma melhor depois!

        // 5. Obtém o título da página de resultados
        let titulo = await driver.getTitle();
        console.log(`O título da página é: ${titulo}`);

        // 6. Verifica se o título contém a palavra "Selenium WebDriver"
        if (titulo.includes('Selenium WebDriver')) {
            console.log('✅ Teste passou! O título está correto.');
        } else {
            console.log('❌ Teste falhou! O título não é o esperado.');
        }

    } catch (error) {
        console.error('Ocorreu um erro durante o teste:', error);
    } finally {
        // 7. Fecha o navegador e encerra a sessão do WebDriver
        // É CRUCIAL fazer isso no bloco `finally` para garantir que o navegador feche,
        // mesmo que o teste falhe.
        await driver.quit();
    }
}

// Executa a função principal
meuPrimeiroTeste();