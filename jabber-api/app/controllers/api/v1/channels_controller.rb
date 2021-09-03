class Api::V1::ChannelsController < ApplicationController

  def index
    @channels = current_user.channels.all
    # @channels += Channel.public_channels

    render jsonapi: @channels, fields: {channels: [:id, :title, :desc, :private]}
  end

  def show
    render jsonapi: Channel.find(params[:id])
  end

  def create
    channel_params[:created_by] = current_user.id

    @channel = current_user.owned_channels.new(channel_params)
    @channel.users << current_user
    @channel.save

    render_jsonapi_response(@channel)

  end

  def messages
    @channel = Channel.find params[:id]
    @messages = @channel.messages.includes(:author, :reaction_counts)

    render jsonapi: @messages, include: :reaction_counts
  end

  private
  def channel_params
   params.require(:channel).permit(:title, :desc, :private, :created_by)
  end
end
