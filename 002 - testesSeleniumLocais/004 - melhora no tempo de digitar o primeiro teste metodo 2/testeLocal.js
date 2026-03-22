const { Builder, By } = require('selenium-webdriver');
const path = require('path');

/**
 * Digita um texto em um elemento de forma lenta, caractere por caractere.
 * @param {WebElement} element - O elemento onde o texto será digitado.
 * @param {string} text - O texto a ser digitado.
 * @param {number} [delay=150] - O tempo de espera em milissegundos entre cada caractere.
 */
async function typeSlowly(element, text, delay = 150) {
    for (const char of text) {
        await element.sendKeys(char);
        await driver.sleep(delay); // 'driver' precisa estar no escopo
    }
}


async function testeComFuncaoAuxiliar() {
    // Precisamos que 'driver' seja acessível dentro da função auxiliar
    // Uma forma é declará-la no escopo global do módulo (não é ideal, mas funciona para este exemplo)
    // A forma melhor é passar o driver como parâmetro. Vamos fazer isso.
    
    let driver = await new Builder().forBrowser('firefox').build();

    try {
        const caminhoDoArquivo = path.resolve(__dirname, 'index.html');
        const url = 'file://' + caminhoDoArquivo;
        
        await driver.get(url);

        const campoNome = await driver.findElement(By.id('campo_nome'));
        
        // Chamando nossa função auxiliar reutilizável!
        await typeSlowly(driver, campoNome, 'Selenium', 100); // Delay de 100ms

        console.log("Texto digitado com a função auxiliar.");
        
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

// Vamos reescrever a função auxiliar da forma correta, recebendo o driver
async function typeSlowly(driver, element, text, delay = 150) {
    for (const char of text) {
        await element.sendKeys(char);
        await driver.sleep(delay);
    }
}

testeComFuncaoAuxiliar();