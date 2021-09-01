Rails.application.routes.draw do
  mount ActionCable.server => '/cable'
  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      resources :users, only: [:show]
      resources :channels, only: [:create, :show, :index] do
        get :messages, on: :member
      end
      resources :messages do
        resources :reactions, only: [:index, :create, :delete]
      end
    end
  end
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  devise_for :users,
    defaults: { format: :json },
    path: '',
    path_names: {
      sign_in: 'api/v1/login',
      sign_out: 'api/v1/logout',
      registration: 'api/v1/signup'
    },
    controllers: {
      sessions: :sessions,
      registrations: :registrations
    }
end
