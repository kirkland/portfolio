Portfolio::Application.routes.draw do
  match '/quote/:symbol' => 'stocks#quote'
end
