require 'rails_helper'

RSpec.describe "Reactions", type: :request do
  describe "GET /index" do
    it "returns http success" do
      get "/reactions/index"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /delete" do
    it "returns http success" do
      get "/reactions/delete"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /create" do
    it "returns http success" do
      get "/reactions/create"
      expect(response).to have_http_status(:success)
    end
  end

end
