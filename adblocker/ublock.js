const filterLists = [
    '/adblocker/filters/easylist.txt'
];

let blockingRules = [];

async function loadFilterLists() {
    for (const list of filterLists) {
        const response = await fetch(list);
        const text = await response.text();
        const rules = parseFilterList(text);
        blockingRules = blockingRules.concat(rules);
    }
    console.log('Filter lists loaded:', blockingRules.length, 'rules');
}

function parseFilterList(text) {
    const rules = [];
    const lines = text.split('\n');
    for (const line of lines) {
        if (line.startsWith('||') && line.endsWith('^')) {
            const domain = line.slice(2, -1);
            rules.push(domain);
        }
    }
    return rules;
}

function blockAds() {
  
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.tagName === 'SCRIPT' || node.tagName === 'IFRAME' || node.tagName === 'IMG') {
                    const src = node.src || node.href;
                    if (src && blockingRules.some(rule => src.includes(rule))) {
                        node.remove(); // Block the ad
                        console.log(`Blocked ad from: ${src}`);
                    }
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

function unblockAds() {
    observer.disconnect(); 
    console.log('Ad Block disabled');
}

loadFilterLists();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { blockAds, unblockAds, loadFilterLists };
}

function blockAds() {
    console.log('uBlock: Blocking ads...');
}

function unblockAds() {
    console.log('uBlock: Disabling ad-blocking...');
}
