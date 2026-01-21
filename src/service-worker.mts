import webmunkSpiderPlugin, { WebmunkSpider } from '@bric/webmunk-spider/service-worker'

export class WebmunkPerplexitySpider extends WebmunkSpider {
  fetchUrls(): string[] {
    return ['https://www.perplexity.ai/library']
  }

  name(): string {
    return 'Perplexity'
  }

  loginUrl(): string {
    return 'https://www.perplexity.ai/'
  }
}

const stringToId = function (str:string) {
  let id:number = str.length

  let multiplier = 1

  Array.from(str).forEach((it:string) => {
    id += it.charCodeAt(0) * multiplier

    multiplier *= 10
  })

  return id % 5000
}

const urlFilter = '||www.perplexity.ai/'

console.log(`urlFilter: ${urlFilter}`)

const stripRule = {
  id: stringToId('perplexity-strip'),
  priority: 1,
  action: {
    type: 'modifyHeaders' as const,
    responseHeaders: [
      { header: 'X-Frame-Options', operation: 'remove' as const },
      { header: 'Content-Security-Policy', operation: 'remove' as const }
    ]
  },
  condition: { urlFilter, resourceTypes: ['sub_frame' as const, 'main_frame' as const, 'other' as const] }
}

chrome.declarativeNetRequest.updateSessionRules({ // updateSessionRules({
  removeRuleIds: [stripRule.id],
  addRules: [stripRule]
}, () => {
  if (chrome.runtime['lastError']) {
    console.log('[chrome.declarativeNetRequest] ' + chrome.runtime['lastError'].message)
  } else {
    console.log(`[SPIDER] ${urlFilter} installed`)

    chrome.declarativeNetRequest.getSessionRules()
      .then((rules) => {
        console.log('CONFIRM RULES')
        console.log(rules)

        chrome.declarativeNetRequest.testMatchOutcome({
          url: 'https://perplexity.ai/',
          type: 'sub_frame'
        })
        .then((result) => {
          console.log('TEST RESULT')
          console.log(result)
        })
      })
  }
})

chrome.declarativeNetRequest.onRuleMatchedDebug.addListener(function (matchedRule) {
  console.log('[SPIDER] rule matched:', matchedRule);
});

const perplexitySpider = new WebmunkPerplexitySpider()

webmunkSpiderPlugin.registerSpider(perplexitySpider)

export default perplexitySpider
