class StocksController < ApplicationController
  def quote
    render :text => YahooApi.quote(params[:symbol])
  end
end
