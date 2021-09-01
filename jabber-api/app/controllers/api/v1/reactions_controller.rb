class Api::V1::ReactionsController < ApplicationController
  before_action :get_message

  def index
  end

  def delete
  end

  def create
    @reaction = @message.reactions.build reaction_params
    @reaction.user_id = current_user.id
    @reaction.save

    render_jsonapi_response @reaction
  end

  private
  def get_message
    @message = Message.find params[:message_id]
  end

  def reaction_params
    params.require(:reaction).permit(:emoji)
  end
end
