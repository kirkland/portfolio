Portfolio::Application.routes.draw do
  match '/quote/:symbol' => 'stocks#quote'

  root :to => 'application#app'
end
