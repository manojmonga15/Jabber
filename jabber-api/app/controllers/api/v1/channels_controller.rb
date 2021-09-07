class Api::V1::ChannelsController < ApplicationController
  before_action :get_channel, only: [:messages, :add_users]
  def index
    @channels = current_user.channels.order('private DESC')
    # @channels += Channel.public_channels

    render jsonapi: @channels, fields: {channels: [:id, :title, :desc, :private]}
  end

  def show
    @channel = Channel.includes(:users).find params[:id]
    render jsonapi: @channel, include: :users
  end

  def create
    channel_params[:created_by] = current_user.id

    @channel = current_user.owned_channels.new(channel_params)
    @channel.users << current_user
    @channel.save

    render_jsonapi_response(@channel)

  end

  def messages
    @messages = @channel.messages.includes(:author, :reaction_counts)

    render jsonapi: @messages, include: :reaction_counts
  end

  def add_users
    @users = User.find params[:users]
    @channel.users << @users
  end

  private
  def channel_params
   params.require(:channel).permit(:title, :desc, :private, :created_by)
  end

  def get_channel
    @channel = Channel.find params[:id]
  end
end
