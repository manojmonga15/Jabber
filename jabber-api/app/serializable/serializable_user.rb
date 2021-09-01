class SerializableUser < JSONAPI::Serializable::Resource
  type 'users'

  attributes :email, :name, :image, :bio
  attribute :avatar do
    if @object.avatar.attached?
      @url_helpers.rails_blob_url @object.avatar
    end
  end

  link :self do
    @url_helpers.api_v1_user_path(@object.id)
  end
end
