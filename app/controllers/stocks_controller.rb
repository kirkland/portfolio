class StocksController < ApplicationController
  def quote
    @symbol = params[:symbol]
    @price = YahooApi.quote(@symbol)

    if Rails.env.development?
      @price = @price.to_f + rand(5).to_f
    end

    render :layout => false
  end
end
