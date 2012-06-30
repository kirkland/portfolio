class ApplicationController < ActionController::Base
  protect_from_forgery

  def app
    @session_id = request.session_options[:id]
    @portfolio_data = Portfolio.find_by_user_id request.session_options[:id]
  end
end
