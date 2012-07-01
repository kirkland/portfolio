class ApplicationController < ActionController::Base
  protect_from_forgery

  def app
    @session_id = request.session_options[:id]
    @portfolio_data = Portfolio.find_by_session_id @session_id
  end
end
