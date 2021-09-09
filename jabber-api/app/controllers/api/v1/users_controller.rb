class Api::V1::UsersController < ApplicationController
  before_action :find_user, only: [:show, :update]

  def index
    @users = User.all_except(current_user.id)
    render_jsonapi_response(@users)
  end

  def show
    render_jsonapi_response(@user)
  end

  def update
    update_params = user_params
    update_params.delete :avatar if update_params[:avatar] == "null"
    @user.update! update_params
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
