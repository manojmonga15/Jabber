class Api::V1::MessagesController < ApplicationController
  def create
    @message = Message.new message_params
    @message.author_id = current_user.id

    @message.save
    render_jsonapi_response(@message)
  end

  private
  def message_params
    params.require(:message).permit(:body, :messageable_id, :messageable_type)
  end
end
