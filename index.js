const {Builder, By, Key, until} = require('selenium-webdriver');
const {Options} = require('selenium-webdriver/chrome')

const ps5_params = {
  disk: [
    'https://www.bestbuy.com/site/sony-playstation-5-console/6426149.p?skuId=6426149'
  ],
  digital: [
    'https://www.bestbuy.com/site/sony-playstation-5-digital-edition-console/6430161.p?skuId=6430161'
  ]
};

const xbox_params = {
  series_x: [
  ],
  series_s: []
};

const screen = {
  width: 640,
  height: 480
};

headless_mode_options = new Options().headless().windowSize(screen)
                        .addArguments('--no-proxy-server')
                        .addArguments("--proxy-server='direct://'")
                        .addArguments("--proxy-bypass-list=*");



const sendNotification = () => {
  console.log('Notification!')
};

const buildDriver = async (browser = 'chrome', options) => {
  if (options) {
    return await new Builder().forBrowser(browser).setChromeOptions(options).build()
  }
  return await new Builder().forBrowser(browser).build();
};

const checkProductStatus = async (url, driver) => {
  if (!url) {
    console.error(`No URL provided: ${url}`)
    return
  }
  console.log('Checking Product Status')
  await driver.get(url);
  const status = await driver.findElement(By.className('add-to-cart-button')).getText();
  console.log(status);
  if (status !== 'Sold Out') {
    sendNotification();
  }
};

const Search = async (params, driver) => {
  for (const [console_version, version_urls] of Object.entries(params)) {
    console.log(console_version);
    for (const url of version_urls) {
      await checkProductStatus(url, driver);
    }
  }
};

const main = async () => {
  const driver = await buildDriver('chrome', null);
  try {
    await Search(ps5_params, driver);
    await Search(xbox_params, driver);
  } finally {
    await driver.quit();
  }
};

main();