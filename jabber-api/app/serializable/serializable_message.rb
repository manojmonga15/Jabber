class SerializableMessage < JSONAPI::Serializable::Resource
  type 'messages'

  attribute :timestamp do
    @object.updated_at.strftime("%m/%d/%Y %-I:%M %p")
  end

  attributes :body, :messageable_id, :messageable_type
  attribute :author_name do
    @object.author.name
  end
  attribute :author_avatar do
    @object.author.image
  end

  has_many :reaction_counts

  link :self do
    @url_helpers.api_v1_channel_path(@object.id)
  end
end
