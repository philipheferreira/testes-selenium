const { Builder, By } = require('selenium-webdriver');
const path = require('path'); // Importa o módulo 'path'

async function testePaginaLocalRelativo() {
    let driver = await new Builder().forBrowser('firefox').build();

    try {
        // __dirname é uma variável do Node.js que contém o caminho do diretório
        // onde o script atual está localizado.
        // path.resolve() cria um caminho absoluto a partir de partes.
        const caminhoDoArquivo = path.resolve(__dirname, 'index.html');
        
        // Constrói a URL com o protocolo file://
        const url = 'file://' + caminhoDoArquivo;

        console.log(`Abrindo a URL local: ${url}`);
        
        // O resto do código de teste é o mesmo...
        await driver.get(url);
        await driver.findElement(By.id('campo_nome')).sendKeys('Selenium');
        await driver.findElement(By.id('botao_enviar')).click();
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

testePaginaLocalRelativo();