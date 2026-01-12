import webmunkSpiderManager { WebmunkContentSpider } from '@bric/webmunk-spider/spider'

export class WebmunkPerplexityContentSpider extends WebmunkContentSpider {
  urlMatches(url:string): boolean {
    if (window.location.href.toLowerCase() === 'https://www.perplexity.ai/') {
      return true // Login check page
    }

    if (window.location.href.toLowerCase() === 'https://www.perplexity.ai/library') {
      return true // Library page
    }

    if (window.location.href.toLowerCase().startsWith('https://www.perplexity.ai/search/')) {
      return true // Conversation page
    }

    return false
  }

  fetchResults() {
    const response = {
      spiderName: 'Perplexity',
      results: [],
      urls: [],
      loggedIn: false
    }

    if (window.location.href.toLowerCase() === 'https://www.perplexity.ai/library') {
      // Library page
    } else if (window.location.href.toLowerCase().startsWith('https://www.perplexity.ai/search/')) {
      // Conversation page
    } else if (window.location.href.toLowerCase() === 'https://www.perplexity.ai/') {
      if ($('div.group/sidebar button div:trimmedTextEquals("Account")').length > 0) {
        response.loggedIn = true
      }
    }
  }
}

const spider = new WebmunkPerplexityContentSpider()
webmunkSpiderManager.registerSpider(spider)

export default spider
