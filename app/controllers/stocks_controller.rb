class StocksController < ApplicationController

  before_filter :find_or_create_porfolio, :only => [:update_portfolio, :portfolio]

  def quote
    @symbol = params[:symbol]
    @price = YahooApi.quote(@symbol)

    if Rails.env.development?
      @price = @price.to_f + rand(5).to_f
    end

    render :layout => false
  end

  def update_portfolio
    portfolio_data = ActiveSupport::JSON.decode(params[:data])
    @portfolio.portfolio_data = portfolio_data
    @portfolio.save!
    render :text => @portfolio.inspect and return
  end

  def portfolio
    render :json => @portfolio.portfolio_data
  end

  private

  def find_or_create_porfolio
    session_id = request.session_options[:id]
    @portfolio = Portfolio.find_or_create_by_session_id(session_id)
  end
end
