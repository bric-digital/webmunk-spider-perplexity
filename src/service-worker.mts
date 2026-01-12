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

const perplexitySpider = new WebmunkPerplexitySpider()

webmunkSpiderPlugin.registerSpider(perplexitySpider)

export default perplexitySpider
