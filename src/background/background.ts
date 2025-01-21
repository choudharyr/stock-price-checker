chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getStockData') {
    handleStockData(request.url, request.needsName).then(sendResponse);
    return true;
  }
});

async function handleStockData(url: string, needsName: boolean): Promise<{ price: string; name?: string }> {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    await chrome.tabs.update(tab.id!, { url });
    
    await new Promise(resolve => {
      chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
        if (tabId === tab.id && info.status === 'complete') {
          chrome.tabs.onUpdated.removeListener(listener);
          resolve(undefined);
        }
      });
    });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const [result] = await chrome.scripting.executeScript({
      target: { tabId: tab.id! },
      func: (getNeedName) => {
        const data: { price: string | null; name?: string } = {
          price: null
        };

        const priceElement = document.querySelector('[data-testid="qsp-price"]');
        data.price = priceElement?.textContent || null;

        //if (getNeedName) {
          const titleElement = document.querySelectorAll('h1')[1];
          if (titleElement) {
            const titleText = titleElement.textContent || '';
            const match = titleText.match(/^[^-]+ - (.+)$/);
            data.name = match ? match[1].trim() : titleText.trim();
          }
        //}

        return data;
      },
      args: [needsName]
    });
    
    if (!result.result.price) {
      //throw new Error(`Price not found for symbol`);
      result.result.price = `Price not found for symbol`;
    }

    return {
      price: result.result.price,
      name: result.result.name
    };
  } catch (error) {
    // Ensure error propagates to the hook
    throw new Error(error instanceof Error ? error.message : 'Unknown error');
  }
}