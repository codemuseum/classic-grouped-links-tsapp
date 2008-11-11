class Group < ActiveRecord::Base
  belongs_to :page_object
  has_many :links, :order => :position, :dependent => :destroy
  
  attr_accessor :added_links
  validates_associated :links
  after_save :save_links
  
  
  # Responsible for removing and adding all links to this group. The general flow is:
  #  If the link isn't a part of the links array already, save to added_links for after_save
  #  If the link is missing from the array, mark it to be removed for after_save 
  def assigned_links=(array_hash)
    # Find new links (but no duplicates)
    self.added_links = []
    array_hash.each do |h|
      unless links.detect { |c| c.id.to_s == h[:id] } || self.added_links.detect { |f| f.id.to_s == h[:id] }
        c = !h[:id].blank? ? Link.find(h[:id]) : Link.new
        c.group = self
        c.attributes = h.reject { |k,v| k == :id } # input values, but don't try to overwrite the id
        self.added_links << c unless c.nil?
      end
    end
    # Delete removed links
    links.each do |c|
      if h = array_hash.detect { |h| h[:id] == c.id.to_s }
        c.attributes = h.reject { |k,v| k == :id }
      else
        c.destroy_association = 1
      end
    end
  end
  
  ###### Association Specific Code

  # Used for other models that might need to mark a slide as *no longer* associated 
  attr_accessor :destroy_association

  # Used for other models (like an page_object) that might need to mark this slide as *no longer* associated
  def destroy_association?
    destroy_association.to_i == 1
  end
  
  protected

    # Destroy links marked for deletion, and adds links marked for addition.
    # Done this way to account for association auto-saves.
    def save_links
      self.links.each { |c| if c.destroy_association? then c.destroy else c.save end }
      self.added_links.each { |c| c.save unless c.nil? } unless self.added_links.nil?
    end
  
end
