const {By,Key,Builder} = require("selenium-webdriver");
require("chromedriver");

async function example(){
 
       var searchString = "Automacao de testes com selenium e javascript";
 
       //await para o browser ser aberto apropriadamente
       let driver = await new Builder().forBrowser("chrome").build();
 
        //para poder apontar a abertura para o site google
        await driver.get("http://google.com");
            
        //encontrar o elemento q
        await driver.findElement(By.name("q")).sendKeys(searchString,Key.RETURN);
 
        //verifica o titulo da pagina e informa no console
        var title = await driver.getTitle();
        console.log('Title is:',title);
 
        //fechar a pagina apos a execução
        await driver.quit();
 
}

example();