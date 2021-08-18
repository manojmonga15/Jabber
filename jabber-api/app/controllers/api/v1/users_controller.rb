class Api::V1::UsersController < ApplicationController
  before_action :find_user, only: [:show]

  def show
    render_jsonapi_response(@user)
  end

  private

  def find_user
    @user = User.find(params[:id])
  end
end
