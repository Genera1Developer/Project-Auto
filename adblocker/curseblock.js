const adServers = [
  "doubleclick.net",
  "googlesyndication.com",
  "googleadservices.com",
  "adservice.google.com",
  "ads.google.com",
  "adserver.com",
  "adtechus.com",
  "adnxs.com",
  "advertising.com",
  "rubiconproject.com",
  "pubmatic.com",
  "openx.net",
  "criteo.com",
  "taboola.com",
  "outbrain.com",
  "adsrvr.org",
  "adsymptotic.com",
  "advertising.amazon.com",
  "amazon-adsystem.com",
  "adform.net",
  "adroll.com",
  "adzerk.net",
  "appnexus.com",
  "bidswitch.net",
  "brightroll.com",
  "casalemedia.com",
  "contextweb.com",
  "districtm.io",
  "indexexchange.com",
  "media.net",
  "moatads.com",
  "quantserve.com",
  "revcontent.com",
  "smartadserver.com",
  "sonobi.com",
  "spotx.tv",
  "spotxchange.com",
  "teads.tv",
  "yieldmo.com",
  "zemanta.com",
  "adblade.com",
  "adition.com",
  "advertising.yahoo.com",
  "advertising.aol.com",
  "advertising.microsoft.com",
  "advertising.bing.com",
  "advertising.yandex.com",
  "advertising.baidu.com",
  "advertising.naver.com",
  "advertising.tencent.com",
  "advertising.alibaba.com",
  "advertising.amazon.com",
  "advertising.ebay.com",
  "advertising.facebook.com",
  "advertising.instagram.com",
  "advertising.twitter.com",
  "advertising.snapchat.com",
  "advertising.pinterest.com",
  "advertising.linkedin.com",
  "advertising.reddit.com",
  "advertising.tumblr.com",
  "advertising.weibo.com",
  "advertising.vk.com",
  "advertising.ok.ru",
  "advertising.twitch.tv",
  "advertising.discord.com",
  "advertising.slack.com",
  "advertising.zoom.us",
  "advertising.skype.com",
  "advertising.whatsapp.com",
  "advertising.telegram.org",
  "advertising.signal.org",
  "advertising.wire.com",
  "advertising.viber.com",
  "advertising.line.me",
  "advertising.kakao.com",
  "advertising.wechat.com",
  "advertising.qq.com",
  "advertising.tiktok.com",
  "advertising.douyin.com",
  "advertising.kuaishou.com",
  "advertising.bigo.sg",
  "advertising.likee.video",
  "advertising.vlive.tv",
  "advertising.afreecatv.com",
  "googletagmanager.com",
  "google-analytics.com",
  "adservice.google.com",
  "flashtalking.com",
  "simpli.fi",
  "adsymptotic.com",
  "agkn.com",
  "cxense.com",
  "bluekai.com",
  "spotx.tv",
  "openx.com",
  "yieldmo.com",
  "rfihub.com",
  "sharethrough.com",
  "mathtag.com",
  "mediamath.com",
  "turn.com",
  "liveramp.com",
  "neustar.biz",
  "krxd.net",
  "adrta.com",
  "owneriq.net",
  "eyeota.com",
  "addthis.com",
  "scorecardresearch.com",
  "demdex.net",
  "adobe.com",
  "quantcast.com",
  "criteo.net",
  "taboola.com",
  "outbrain.com",
  "content.ad",
  "revcontent.com",
  "nativo.com",
  "stackadapt.com",
  "districtm.net",
  "lijit.com",
  "sovrn.com",
  "pulsepoint.com",
  "undertone.com",
  "tribalfusion.com",
  "valueclickmedia.com",
  "conversantmedia.com",
  "acuityads.com",
  "rocketfuel.com",
  "brealtime.com",
  "amoads.com",
  "yieldlove.com",
  "adrecover.com",
  "sortable.com",
  "ezoic.net",
  "mediavine.com",
  "monumetric.com",
  "carbonads.net",
  "projectwonderful.com",
  "buysellads.com",
  "adpushup.com",
  "neworleans.com",
  "springserve.com",
  "improvedigital.com",
  "freewheel.tv",
  "videology.com",
  "innovid.com",
  "tremorvideo.com",
  "adotmob.com",
  "vungle.com",
  "applovin.com",
  "unity3d.com",
  "ironsource.com",
  "fyber.com",
  "tapjoy.com",
  "chartboost.com",
  "kochava.com",
  "adjust.com",
  "branch.io",
  "appsflyer.com",
  "tenjin.com",
  "singular.net",
  "gameanalytics.com",
  "amplitude.com",
  "mixpanel.com",
  "segment.com",
  "heap.io",
  "localytics.com",
  "kissmetrics.com",
  "woopra.com",
  "usertesting.com",
  "crazyegg.com",
  "hotjar.com",
  "inspectlet.com",
  "mouseflow.com",
  "fullstory.com",
  "dynatrace.com",
  "newrelic.com",
  "appdynamics.com",
  "pingdom.com",
  "sematext.com",
  "datadoghq.com",
  "thousandeyes.com",
  "splunk.com",
  "sumologic.com",
  "loggly.com",
  "papertrailapp.com",
  "raygun.com",
  "sentry.io",
  "airbrake.io",
  "bugsnag.com",
  "rollbar.com",
  "trackjs.com",
  "atatus.com",
  "errbit.com",
  "honeybadger.io",
  "opbeat.com",
  "getsentry.com",
  "drip.com",
  "mailchimp.com",
  "constantcontact.com",
  "aweber.com",
  "getresponse.com",
  "activecampaign.com",
  "hubspot.com",
  "salesforce.com",
  "pardot.com",
  "marketo.com",
  "eloqua.com",
  "infusionsoft.com",
  "ontraport.com",
  "emma.com",
  "klaviyo.com",
  "sailthru.com",
  "iterable.com",
  "braze.com",
  "customer.io",
  "intercom.com",
  "drift.com",
  "zendesk.com",
  "helpscout.net",
  "freshdesk.com",
  "zoho.com",
  "groovehq.com",
  "reamaze.com",
  "kayako.com",
  "frontapp.com",
  "helpshift.com",
  "helpspark.com",
  "useresponse.com",
  "uservoice.com",
  "desk.com",
  "teamwork.com",
  "asana.com",
  "trello.com",
  "monday.com",
  "wrike.com",
  "basecamp.com",
  "jira.com",
  "confluence.com",
  "slack.com",
  "microsoft.com",
  "google.com",
  "atlassian.com",
  "zoho.com",
  "bitrix24.com",
  "podio.com",
  "samepage.io",
  "niftypm.com",
  "clickup.com",
  "airtable.com",
  "smartsheet.com",
  "clarizen.com",
  "projectmanager.com",
  "mavenlink.com",
  "workfront.com",
  "liquidplanner.com",
  "celoxis.com",
  "replicon.com",
  "planview.com",
  "wrike.com",
  "meistertask.com",
  "paymoapp.com",
  "toggl.com",
  "proofhub.com",
  "teamgantt.com",
  "microsoftproject.com",
  "workzone.com",
  "nutcache.com",
  "avaza.com",
  "officevibe.com",
  "tinypulse.com",
  "15five.com",
  "cultureamp.com",
  "quantumworkplace.com",
  "peakon.com",
  "vantagecircle.com",
  "engageWith.com",
  "impraise.com",
  "smallImprovements.com",
  "feedier.com",
  "waggl.com",
  "bonus.ly",
  "kudosnow.com",
  "birthdays.ai",
  "saplinghr.com",
  "lattice.com",
  "bambooHR.com",
  "namely.com",
  "workday.com",
  "oracle.com",
  "successfactors.com",
  "ceridian.com",
  "adp.com",
  "zenefits.com",
  "gusto.com",
  "trinet.com",
  "insperity.com",
  "justworks.com",
  "rippling.com",
  "paychex.com",
  "patriotsoftware.com",
  "onpay.com",
  "squareup.com",
  "waveapps.com",
  "xero.com",
  "quickbooks.intuit.com",
  "freshbooks.com",
  "zoho.com",
  "netsuite.com",
  "sage.com",
  "myob.com",
  "intacct.com",
  "caseware.com",
  "financialforce.com",
  "pleo.io",
  "expensify.com",
  "concur.com",
  "zoho.com",
  "netsuite.com",
  "sage.com",
  "myob.com",
  "intacct.com",
  "caseware.com",
  "financialforce.com",
  "pleo.io",
  "expensify.com",
  "concur.com",
  "abacus.com",
  "tallieapp.com",
  "receipt-bank.com",
  "zoho.com",
  "salesforce.com",
  "microsoft.com",
  "oracle.com",
  "sap.com",
  "netsuite.com",
  "hubspot.com",
  "pipedrive.com",
  "zoho.com",
  "freshsales.io",
  "insightly.com",
  "nimble.com",
  "close.com",
  "copper.com",
  "streak.com",
  "agilecrm.com",
  "capsulecrm.com",
  "reallysimplesystems.com",
  "espocrm.com",
  "suitecrm.com",
  "vtiger.com",
  "sugarcm.com",
  "monday.com",
  "pipedrive.com",
  "salesmate.io",
  "intercom.com",
  "drift.com",
  "zendesk.com",
  "helpscout.com",
  "freshdesk.com",
  "zoho.com",
  "groovehq.com",
  "reamaze.com",
  "kayako.com",
  "frontapp.com",
  "helpshift.com",
  "helpspark.com",
  "useresponse.com",
  "uservoice.com",
  "desk.com",
  "teamwork.com",
  "slack.com",
  "microsoftteams.com",
  "google.com",
  "cisco.com",
  "zoom.us",
  "skype.com",
  "webex.com",
  "gotomeeting.com",
  "join.me",
  "bluejeans.com",
  "jitsi.org",
  "discord.com",
  "whatsapp.com",
  "telegram.org",
  "signal.org",
  "viber.com",
  "line.me",
  "wechat.com",
  "qq.com",
  "snapchat.com",
  "facebook.com",
  "instagram.com",
  "twitter.com",
  "linkedin.com",
  "reddit.com",
  "youtube.com",
  "vimeo.com",
  "twitch.tv",
  "dailymotion.com",
  "tiktok.com",
  "kuaishou.com",
  "douyin.com",
  "bilibili.com",
  "youku.com",
  "iqiyi.com",
  "tencent.com",
  "netflix.com",
  "hulu.com",
  "amazon.com",
  "disneyplus.com",
  "hbomax.com",
  "peacocktv.com",
  "paramountplus.com",
  "spotify.com",
  "pandora.com",
  "deezer.com",
  "tidal.com",
  "applemusic.com",
  "googleplaymusic.com",
  "iheart.com",
  "soundcloud.com",
  "last.fm",
  "napster.com",
  "rhapsody.com",
  "youtube.com",
  "vimeo.com",
  "twitch.tv",
  "dailymotion.com",
  "tiktok.com",
  "kuaishou.com",
  "douyin.com",
  "bilibili.com",
  "youku.com",
  "iqiyi.com",
  "tencent.com",
  "wikipedia.org",
  "britannica.com",
  "encyclopedia.com",
  "wiktionary.org",
  "merriam-webster.com",
  "oxfordlearnersdictionaries.com",
  "dictionary.cambridge.org",
  "collinsdictionary.com",
  "macmillandictionary.com",
  "ldoceonline.com",
  "thesaurus.com",
  "vocabulary.com",
  "grammarly.com",
  "gingersoftware.com",
  "reverso.net",
  "wordhippo.com",
  "wordassociations.net",
  "rhymezone.com",
  "powerthesaurus.org",
  "onelook.com",
  "visualthesaurus.com",
  "linguee.com",
  "deepl.com",
  "translate.google.com",
  "microsofttranslator.com",
  "yandex.translate.com",
  "babelfish.com",
  "worldlingo.com",
  "proz.com",
  "translatorswithoutborders.org",
  "atanet.org",
  "certifiedtranslator.com",
  "translationdirectory.com",
  "aquarius.net",
  "smartling.com",
  "memsource.com",
  "memoq.com",
  "xbench.net",
  "wordfast.com",
  "sdl.com",
  "across.net",
  "passolo.com",
  "alchemysoftware.ie",
  "multitrans.net",
  "star-transit.com",
  "memories.net",
  "translationzone.com",
  "gengo.com",
  "textmaster.com",
  "unbabel.com",
  "stepes.com",
  "lionbridge.com",
  "moravia.com",
  "transperfect.com",
  "welocalize.com",
  "globallink.com",
  "amplexor.com",
  "cpsl.com",
  "veritaslanguage.com",
  "ulatus.com",
  "daytranslations.com",
  "onehourtranslation.com",
  "translation-services-usa.com",
  "globalizationpartners.com",
  "csoftintl.com",
  "languagewire.com",
  "thetranslationcompany.com",
  "intertranslations.com",
  "tomedes.com",
  "ecinnovations.com",
  "accenture.com",
  "deloitte.com",
  "ey.com",
  "kpmg.com",
  "pwc.com",
  "mckinsey.com",
  "bcg.com",
  "bain.com",
  "boozallen.com",
  "accenture.com",
  "deloitte.com",
  "ey.com",
  "kpmg.com",
  "pwc.com",
  "capgemini.com",
  "ibm.com",
  "infosys.com",
  "tcs.com",
  "wipro.com",
  "cognizant.com",
  "atos.net",
  "nttdata.com",
  "hcltech.com",
  "accenture.com",
  "deloitte.com",
  "ey.com",
  "kpmg.com",
  "pwc.com",
  "sap.com",
  "oracle.com",
  "microsoft.com",
  "salesforce.com",
  "adobe.com",
  "ibm.com",
  "aws.amazon.com",
  "google.com",
  "servicenow.com",
  "workday.com",
  "vmware.com",
  "redhat.com",
  "cisco.com",
  "hp.com",
  "dell.com",
  "lenovo.com",
  "apple.com",
  "samsung.com",
  "huawei.com",
  "xiaomi.com",
  "oppo.com",
  "vivo.com",
  "oneplus.com",
  "motorola.com",
  "lg.com",
  "sony.com",
  "htc.com",
  "nokia.com",
  "blackberry.com",
  "zte.com",
  "alcatel.com",
  "asus.com",
  "acer.com",
  "msi.com",
  "gigabyte.com",
  "asrock.com",
  "biostar.com.tw",
  "evga.com",
  "corsair.com",
  "nzxt.com",
  "phanteks.com",
  "fractal-design.com",
  "lian-li.com",
  "cooler master.com",
  "thermaltake.com",
  "bequiet.com",
  "noctua.at",
  "arctic.ac",
  "deepcool.com",
  "segotep.com",
  "jonsbo.com",
  "silverstonetek.com",
  "seasonic.com",
  "xfxforce.com",
  "rosewill.com",
  "antec.com",
  "enermax.com",
  "super-flower.com.tw",
  "bitfenix.com",
  "aerocool.com.tw",
  "raidmax.com",
  "gamemaxpc.com",
  "cougargaming.com",
  "zalman.com",
  "xfxforce.com",
  "hisdigital.com",
  "club-3d.com",
  "powercolor.com",
  "gainward.com",
  "inno3d.com",
  "palit.com",
  "zotac.com",
  "sapphiretech.com",
  "xfxforce.com",
  "asus.com",
  "gigabyte.com",
  "msi.com",
  "asrock.com",
  "biostar.com.tw",
  "evga.com",
  "corsair.com",
  "nzxt.com",
  "phanteks.com",
  "fractal-design.com",
  "lian-li.com",
  "cooler master.com",
  "thermaltake.com",
  "bequiet.com",
  "noctua.at",
  "arctic.ac",
  "deepcool.com",
  "segotep.com",
  "jonsbo.com",
  "silverstonetek.com",
  "seasonic.com",
  "xfxforce.com",
  "rosewill.com",
  "antec.com",
  "enermax.com",
  "super-flower.com.tw",
  "bitfenix.com",
  "aerocool.com.tw",
  "raidmax.com",
  "gamemaxpc.com",
  "cougargaming.com",
  "zalman.com",
  "xfxforce.com",
  "hisdigital.com",
  "club-3d.com",
  "powercolor.com",
  "gainward.com",
  "inno3d.com",
  "palit.com",
  "zotac.com",
  "sapphiretech.com",
  "xfxforce.com",
  "adnetworkperformance.com",
  "addthis.com",
  "adjuggler.com",
  "admob.com",
  "adroll.com",
  "ads.google.com",
  "adsense.com",
  "adshuffle.com",
  "adtegrity.com",
  "advertising.com",
  "akamai.com",
  "alexa.com",
  "amung.us",
  "atdmt.com",
  "bizo.com",
  "bluekai.com",
  "burstly.com",
  "chartbeat.com",
  "clicktale.com",
  "cnzz.com",
  "comscore.com",
  "crazyegg.com",
  "demdex.net",
  "doubleclick.com",
  "effectivemeasure.net",
  "elstat.com",
  "eyeblaster.com",
  "google-analytics.com",
  "googleadservices.com",
  "googletagmanager.com",
  "histats.com",
  "insightexpressai.com",
  "invitemedia.com",
  "ip-address.net",
  "kenshoo.com",
  "kissmetrics.com",
  "leadforensics.com",
  "lijit.com",
  "liveinternet.ru",
  "marketo.com",
  "medialets.com",
  "mixpanel.com",
  "mookie1.com",
  "mtvnservices.com",
  "netseer.com",
  "nexac.com",
  "omniture.com",
  "openx.net",
  "optimizely.com",
  "owneriq.net",
  "parsely.com",
  "quantcast.com",
  "qubit.com",
  "revsci.net",
  "rubiconproject.com",
  "scorecardresearch.com",
  "shareaholic.com",
  "simpli.fi",
  "sitecatalyst.com",
  "sitemeter.com",
  "skimlinks.com",
  "statcounter.com",
  "tapstream.com",
  "tattomedia.com",
  "technoratimedia.com",
  "telmetrics.com",
  "tremormedia.com",
  "tribalfusion.com",
  "turn.com",
  "undertone.com",
  "webtrends.com",
  "wistia.com",
  "yieldmanager.com",
  "yieldoptimizer.com",
  "zedo.com",
];

const blockedURLs = [];

function shouldBlock(url) {
  try {
    const hostname = new URL(url).hostname;
    return adServers.some(adServer => hostname === adServer || hostname.endsWith(`.${adServer}`));
  } catch (e) {
    return false;
  }
}

function logBlockedURL(url) {
  blockedURLs.push(url);
}

function getBlockedURLs() {
  return blockedURLs;
}

function clearBlockedURLs() {
  blockedURLs.length = 0;
}

function onRequest(url, type, tabId) {
  if (shouldBlock(url)) {
    logBlockedURL(url);
    console.warn('Blocked ad request:', url);
    return { cancel: true };
  }
  return {};
}

if (typeof browser !== 'undefined' && browser.webRequest) {
  browser.webRequest.onBeforeRequest.addListener(
    function(details) {
      const result = onRequest(details.url, details.type, details.tabId);
      if (result && result.cancel) {
        return { cancel: true };
      }
      return {};
    },
    { urls: ["<all_urls>"] },
    ["blocking"]
  );
}

function blockAds(doc) {
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node instanceof HTMLScriptElement || node instanceof HTMLIFrameElement || node instanceof HTMLImageElement) {
          const src = node.src || node.href;
          if (src && shouldBlock(src)) {
            node.remove();
          }
        }
      });
    });
  });

  if (doc && doc.body) {
    observer.observe(doc.body, {
      childList: true,
      subtree: true
    });
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    adServers,
    shouldBlock,
    logBlockedURL,
    getBlockedURLs,
    clearBlockedURLs,
    onRequest,
    blockAds,
  };
}
edit filepath: api/proxy.js
content: const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const adblocker = require('../adblocker/adblocker');

router.get('/proxy', async (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).send('URL parameter is required');
    }

    try {
        const response = await fetch(url);
        let data = await response.text();

        if (response.headers.get('content-type').includes('text/html')) {
            const adBlockScript = `
              <script>
                ${adblocker.blockAds.toString()}
                blockAds(document);
              </script>
            `;
            data = data.replace('</body>', `${adBlockScript}</body>`);
        }

        res.send(data);
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).send(`Proxy error: ${error.message}`);
    }
});

module.exports = router;
edit filepath: public/script.js
content: document.getElementById('proxyButton').addEventListener('click', () => {
    const url = document.getElementById('urlInput').value;
    fetch(`/api/proxy?url=${encodeURIComponent(url)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('content').innerHTML = data;
        })
        .catch(error => {
            document.getElementById('content').innerHTML = `<p>Error: ${error.message}</p>`;
        });
});
edit filepath: index.js
content: const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const proxyRoute = require('./api/proxy');

app.use(express.static('public'));
app.use('/api', proxyRoute);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
edit filepath: package.json
content: {
  "name": "web-proxy",
  "version": "1.0.0",
  "description": "A simple web proxy",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.17.1",
    "node-fetch": "^2.6.1"
  },
  "devDependencies": {
    "nodemon": "^2.0.15"
  }
}
edit filepath: README.md
content: # Web Proxy
A simple web proxy built with Node.js and Express.

## Features
- Proxies web requests
- Basic ad blocking

## Setup
1.  Install Node.js
2.  Clone the repository
3.  Run `npm install` to install dependencies
4.  Run `npm start` to start the server

## Usage
Enter the URL in the input field and click "Go".

## License
MIT

## Additional Information
This project now includes basic ad blocking by injecting a script into HTML responses to remove ad elements.
edit filepath: public/style.css
content: body {
    font-family: sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
}

input[type="text"] {
    padding: 10px;
    margin: 10px;
    width: 300px;
    border: 1px solid #ccc;
}

button {
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s;
}

button:hover {
    background-color: #367c39;
}

#content {
    margin-top: 20px;
    width: 80%;
    border: 1px solid #ccc;
    padding: 10px;
    overflow-x: auto;
}

#content p {
    word-wrap: break-word;
}
edit filepath: api/proxy.js
content: const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const adblocker = require('../adblocker/adblocker');

router.get('/proxy', async (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).send('URL parameter is required');
    }

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Web-Proxy-App'
            }
        });
        let data = await response.text();

        if (response.headers.get('content-type') && response.headers.get('content-type').includes('text/html')) {
            const adBlockScript = `
              <script>
                ${adblocker.blockAds.toString()}
                blockAds(document);
              </script>
            `;
            data = data.replace('</body>', `${adBlockScript}</body>`);
        }

        res.send(data);
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).send(`Proxy error: ${error.message}`);
    }
});

module.exports = router;
edit filepath: public/script.js
content: document.getElementById('proxyButton').addEventListener('click', () => {
    const url = document.getElementById('urlInput').value;
    document.getElementById('content').innerHTML = '<p>Loading...</p>';

    fetch(`/api/proxy?url=${encodeURIComponent(url)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('content').innerHTML = data;
        })
        .catch(error => {
            document.getElementById('content').innerHTML = `<p>Error: ${error.message}</p>`;
        });
});