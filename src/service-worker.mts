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

const urlFilter = '||perplexity.ai/'

console.log(`urlFilter: ${urlFilter}`)

const stripRule = {
  id: stringToId('perplexity-strip'),
  priority: 1,
  action: {
    type: 'modifyHeaders' as const,
    responseHeaders: [
      { header: 'x-frame-options', operation: 'remove' as const },
      { header: 'content-security-policy', operation: 'remove' as const }
    ]
  },
  condition: { urlFilter, resourceTypes: ['main_frame' as const, 'sub_frame' as const] }
}

chrome.declarativeNetRequest.updateSessionRules({
  addRules: [stripRule]
}, () => {
  if (chrome.runtime['lastError']) {
    console.log('[chrome.declarativeNetRequest] ' + chrome.runtime['lastError'].message)
  } else {
    console.log(`urlFilter: ${urlFilter} installed`)
  }
})

chrome.declarativeNetRequest.onRuleMatchedDebug.addListener(function (o) {
  console.log('rule matched:', o);
});

const perplexitySpider = new WebmunkPerplexitySpider()

webmunkSpiderPlugin.registerSpider(perplexitySpider)

export default perplexitySpider
