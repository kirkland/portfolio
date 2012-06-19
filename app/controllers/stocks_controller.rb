class StocksController < ApplicationController
  def quote
    @symbol = params[:symbol]
    @price = YahooApi.quote(@symbol)

    render :layout => false
  end
end
