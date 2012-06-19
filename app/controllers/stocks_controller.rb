class StocksController < ApplicationController
  def quote
    @symbol = params[:symbol]
    @price = YahooApi.quote(@symbol)
  end
end
