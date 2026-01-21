import $ from 'jquery'

import webmunkSpiderManager, { WebmunkContentSpider } from '@bric/webmunk-spider/spider'

export class WebmunkPerplexityContentSpider extends WebmunkContentSpider {
  name():string {
    return 'Perplexity'
  }

  toString():string {
    return 'WebmunkPerplexityContentSpider'
  }

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
    // const response = {
    //   spiderName: 'ChatGPT',
    //   results: [],
    //   urls: [],
    //   loggedIn: false
    // }

    console.log('[perplexity] fetchResults')

    window.setTimeout(() => {
      console.log(`[${this.name()}]: fetchResults... ${window.location.href.toLowerCase()}`)

      if (window.location.href.toLowerCase() === 'https://www.perplexity.ai/') {
        console.log(`[${this.name()}]: CHECKING LOGIN...`)
        console.log($('div[data-testid="login-modal"]').length)

        if ($('div[data-testid="login-modal"]').length > 0) { // Logged in...
          console.log(`[${this.name()}]: Sending needs login...`)
          chrome.runtime.sendMessage({
            messageType: 'spiderLoginResults',
            spiderName: this.name(),
            loggedIn: false
          })
        } else {
          console.log(`[${this.name()}]: Sending needs NO login...`)
          chrome.runtime.sendMessage({
            messageType: 'spiderLoginResults',
            spiderName: this.name(),
            loggedIn: true
          })
        }
        return
      } else if (window.location.href.toLowerCase() === 'https://www.perplexity.ai/library') {
        console.log(`${this.name()}: Looking for links...`)
        let urls = []

        window.setTimeout(() => {
          $('a').each((index, item) => {
            const href = $(item).attr('href')

            console.log(`${this.name()}: checking ${href}...`)

            if (href.startsWith('/search/')) {
              urls.push(`https://www.perplexity.ai${href}`)
            }
          })

          chrome.runtime.sendMessage({
            messageType: 'spiderSources',
            spiderName: this.name(),
            urls
          })
        }, 2000)

        return
      } else if (window.location.href.toLowerCase().startsWith('https://www.perplexity.ai/search/')) {
        let conversation = []

        $('.group/query').each((index, item) => {
          $(item).find('.select-text').each((turnIndex, turn) => {
            conversation.push({
              speaker: 'user',
              content: $(turn).text(),
            })
          })
        })

        $('.prose').each((index, item) => {
          $(item).find('.select-text').each((turnIndex, turn) => {
            conversation.push({
              speaker: 'user',
              content: $(turn).html(),
            })
          })
        })

        chrome.runtime.sendMessage({
          messageType: 'spiderResults',
          spiderName: this.name(),
          payload: {
            conversation
          }
        })

        return
      }

    }, 1000)

    // } else if (window.location.href.toLowerCase().startsWith('https://chatgpt.com/')) {
    //   // Conversation page
    // } else if (window.location.href.toLowerCase() === 'https://chatgpt.com/') {
    //   if ($('div.group/sidebar button div:trimmedTextEquals("Account")').length > 0) {
    //     response.loggedIn = true
    //   }
    // }
  }
}

const spider = new WebmunkPerplexityContentSpider()
webmunkSpiderManager.registerSpider(spider)

export default spider
