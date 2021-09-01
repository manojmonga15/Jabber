class Api::V1::UsersController < ApplicationController
  before_action :find_user, only: [:show, :update]

  def show
    render_jsonapi_response(@user)
  end

  def update
    @user.update! user_params
    render_jsonapi_response(@user)
  end

  private

  def find_user
    @user = User.find(params[:id])
  end

  def user_params
    params.require(:user).permit(:name, :bio, :avatar)
  end
end
