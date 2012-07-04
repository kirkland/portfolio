PortfolioApp::Application.routes.draw do
  match '/quote/:symbol' => 'stocks#quote'

  get '/portfolio' => 'stocks#portfolio'
  post '/update_portfolio' => 'stocks#update_portfolio'

  root :to => 'application#app'
end
