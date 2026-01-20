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

  Array.from(str).forEach((it:string) => {
    id += it.charCodeAt(0)
  })

  return id * 10000 + 7964
}

const urlFilter = '||perplexity.ai/'

console.log(`urlFilter: ${urlFilter}`)

const stripRule = {
  id: stringToId('perplexity-strip'),
  priority: 1,
  action: {
    type: 'modifyHeaders' as const,
    responseHeaders: [
      { header: 'x-frame-options', operation: 'remove' },
      { header: 'content-security-policy', operation: 'remove' }
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

const perplexitySpider = new WebmunkPerplexitySpider()

webmunkSpiderPlugin.registerSpider(perplexitySpider)

export default perplexitySpider
