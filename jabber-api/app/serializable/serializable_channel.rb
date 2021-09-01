class SerializableChannel < JSONAPI::Serializable::Resource
  type 'channels'

  attributes :title, :private, :desc

  link :self do
    @url_helpers.api_v1_channel_path(@object.id)
  end
end
