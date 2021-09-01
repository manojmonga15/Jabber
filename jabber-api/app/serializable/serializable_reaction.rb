class SerializableReaction < JSONAPI::Serializable::Resource
  type 'reactions'
  id { @object.message_id.to_s + '_' + @object.emoji }

  attributes :emoji, :message_id
  attribute :count do
    if @object.respond_to? :count
      @object.count
    else
      ""
    end
  end

  attribute :users do
    if @object.respond_to? :users
      @object.users
    else
      ""
    end
  end
  # attribute :user_name do
  #   @object.user.name
  # end
  # attribute :user_avatar do
  #   @object.user.image
  # end

end
