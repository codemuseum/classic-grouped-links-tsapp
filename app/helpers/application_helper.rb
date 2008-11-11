# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper
  def chop_protocol(url)
    return nil unless url
    parts = url.split(/:\/\//)
    result = nil
    if parts.size > 1
      result = parts[1] 
    else
      result = parts[0]
    end

    result.gsub(/\/$/, '')
  end
  
  def screenshot_url(url, relative = nil)
    full_url = url
    unless url.index('://') || !relative
      full_url = relative[0... relative.index('/', relative.index('://') + '://'.length)] + url
    end
    "http://images.websnapr.com/?key=mvjezQ7ceRo3&size=S&url=#{full_url}"
  end
end
