const { Builder, By } = require('selenium-webdriver');
const path = require('path');

async function testePaginaLocalLento() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        const caminhoDoArquivo = path.resolve(__dirname, 'index.html');
        const url = 'file://' + caminhoDoArquivo;
        
        await driver.get(url);
        console.log("Página aberta. Aguardando 2 segundos...");
        await driver.sleep(2000); // Pausa de 2 segundos para você ver a página carregada

        await driver.findElement(By.id('campo_nome')).sendKeys('Selenium');
        console.log("Nome digitado. Aguardando 1 segundo...");
        await driver.sleep(1000); // Pausa para ver o texto sendo digitado

        await driver.findElement(By.id('botao_enviar')).click();
        console.log("Botão clicado. Aguardando 3 segundos para ver o resultado...");
        await driver.sleep(3000); // Pausa longa para ver a mensagem de sucesso aparecer

        const resultadoTexto = await driver.findElement(By.id('resultado')).getText();
        
        const resultadoEsperado = 'Olá, Selenium! Seja bem-vinda(o).';
        if (resultadoTexto === resultadoEsperado) {
            console.log('✅ Teste PASSOU!');
        } else {
            console.log(`❌ Teste FALHOU!`);
        }

    } catch (error) {
        console.error('Ocorreu um erro durante o teste:', error);
    } finally {
        await driver.quit();
    }
}

testePaginaLocalLento();