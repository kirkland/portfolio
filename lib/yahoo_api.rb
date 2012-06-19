require "net/http"
require "uri"

class YahooApi
  class << self
    def quote(symbol)
      uri = URI.parse("http://download.finance.yahoo.com/d/quotes.csv?s=#{symbol}&f=l1")

      response = Net::HTTP.get_response(uri).body.strip
    end
  end
end
