class MessagesChannel < ApplicationCable::Channel
  def subscribed
    stop_all_streams
    #@channel = Channel.find params[:id]
    #stream_for @channel
    stream_from "chat-#{params['messageable_id']}:messages"
  end

  def receive(data)

  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
