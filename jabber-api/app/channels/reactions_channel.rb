class ReactionsChannel < ApplicationCable::Channel
  def subscribed
    stop_all_streams
    stream_from "message-#{params['message_id']}:reactions"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
