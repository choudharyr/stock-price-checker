chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'checkPrice') {
    handlePriceCheck(request.url).then(sendResponse);
    return true;
  }
});

async function handlePriceCheck(url: string): Promise<string> {
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
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const [result] = await chrome.scripting.executeScript({
      target: { tabId: tab.id! },
      func: () => {
        const priceElement = document.querySelector('[data-testid="qsp-price"]');
        return priceElement ? priceElement.textContent : null;
      }
    });
    
    return result.result || 'Price not found';
  } catch (error) {
    console.error('Error checking price:', error);
    throw error;
  }
}