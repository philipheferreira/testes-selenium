const { Builder, By } = require('selenium-webdriver');
const path = require('path');

async function testeComDigitacaoLenta() {
    let driver = await new Builder().forBrowser('firefox').build();

    try {
        const caminhoDoArquivo = path.resolve(__dirname, 'index.html');
        const url = 'file://' + caminhoDoArquivo;
        
        await driver.get(url);

        // Encontra o elemento de input uma vez
        const campoNome = await driver.findElement(By.id('campo_nome'));
        
        const textoParaDigitar = 'Selenium';
        const delayEntreTeclas = 150; // 150 milissegundos por caractere

        // Loop para digitar cada caractere lentamente
        for (const letra of textoParaDigitar) {
            await campoNome.sendKeys(letra);
            await driver.sleep(delayEntreTeclas);
        }

        console.log("Texto digitado lentamente. Aguardando 1 segundo antes de clicar...");
        await driver.sleep(1000);

        await driver.findElement(By.id('botao_enviar')).click();
        
        const resultadoTexto = await driver.findElement(By.id('resultado')).getText();
        const resultadoEsperado = 'Olá, Selenium! Seja bem-vinda(o).';
        await driver.sleep(1000);
        
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

testeComDigitacaoLenta();