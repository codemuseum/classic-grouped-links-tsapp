var ClassicGroupedLinksEdit = {
  init: function() {
    this.uniqueCount = 0;
    $$('div.app-classic-grouped-links').each(function(el) {
      el.getElementsBySelector('.link a').each(function(listing) { listing.observe('click', function(ev) { ev.stop(); }) }); // Allow the links to be draggable by turning off their behavior
      
      var groupsBox = el.getElementsBySelector('.groups')[0];
      ClassicGroupedLinksEdit._observeDrags(groupsBox);
      groupsBox.getElementsBySelector('div.group.draggable').each(function(g) { ClassicGroupedLinksEdit._observeRemoveElement(g); });
      groupsBox.getElementsBySelector('div.link.draggable').each(function(l) { ClassicGroupedLinksEdit._observeLink(l); });
      
      var groupCreationCode = el.getElementsBySelector('.new-group-code')[0].remove().innerHTML;
      el.getElementsBySelector('a.new-group').each(function(newGroup) { newGroup.observe('click', function() { ClassicGroupedLinksEdit._newGroup(groupsBox, groupCreationCode); }) });
      
      var linkCreationCode = el.getElementsBySelector('.new-link-code')[0].remove().innerHTML;
      el.getElementsBySelector('a.new-link').each(function(newLink) { newLink.observe('click', function(ev) { ClassicGroupedLinksEdit._newLink(groupsBox, linkCreationCode); }) });
      
      el.ancestors().detect(function(anc) { return anc.tagName == 'FORM' }).observe('submit', function(ev) { ClassicGroupedLinksEdit._saveOrder(el); });
    });
  },
  
  _newGroup: function(targetEl, html) {
    var newEl=$(document.createElement('div'));
    newEl.update(html.replace(/_INDEX_/g, this.uniqueCount++));
    newEl = newEl.firstDescendant().remove();
    targetEl.appendChild(newEl);
    newEl.getElementsBySelector('input')[0].focus();
    newEl.scrollTo();
    
    this._unobserveDrags(targetEl);
    this._observeDrags(targetEl);
    this._observeRemoveElement(newEl);
  },
  
  _newLink: function(targetEl, html) {
    var placement = targetEl.getElementsBySelector('div.group')[0];
    if (!placement) { alert("Please add a group first, before adding a link!"); return; }
    
    var newEl=$(document.createElement('div'));
    newEl.update(html.replace(/_INDEX_/g, this.uniqueCount++));
    newEl = newEl.firstDescendant().remove();
    placement.appendChild(newEl);
    newEl.getElementsBySelector('input')[0].focus();
    newEl.scrollTo();
    
    this._unobserveDrags(targetEl);
    this._observeDrags(targetEl);
    this._observeLink(newEl);
  },
  
  _observeDrags: function(groups) {
    groups.getElementsBySelector('div.group').each(function(g) { 
      Sortable.create(g,
          { containment: groups.getElementsBySelector('div.group').collect(function(div) {return div.id}), 
            dropOnEmpty: true, scroll: window, scrollSensitivity: 40, scrollSpeed: 30, tag:'div'});
    });
    
    Sortable.create(groups, { only:'draggable', scroll: window, scrollSensitivity: 40, scrollSpeed: 30, tag:'div', handle: 'ghandle'});
  },
  
  _unobserveDrags: function(groups) {
    Sortable.destroy(groups);
    groups.getElementsBySelector('div.group').each(function(g) { Sortable.destroy(g); });
  },
  
  // also save the link name hashes, so rails can cope with it
  _saveOrder: function(el) {
    var currentGroupPosition = 0;
    el.getElementsBySelector('.group.draggable').each(function(g) {
      var currentLinkPosition = 0;
      positionEl = g.getElementsBySelector('input.position-value')[0];
      positionEl.value = currentGroupPosition++; // Save position
      var groupId = positionEl.name.substring(positionEl.name.indexOf('assigned_groups][') + 'assigned_groups]['.length, positionEl.name.indexOf('][position]'));
      g.getElementsBySelector('input').each(function (i) { i.name = i.name.replace(/_GROUPINDEX_/g, groupId); });
      g.getElementsBySelector('div.link').each(function(l) { 
        l.getElementsBySelector('input.position-value')[0].value = currentLinkPosition++; // Save position
      });
    });
  },
  _observeLink: function(link) {TS.Pages.Selector.register(link); ClassicGroupedLinksEdit._observeRemoveElement(link);},
  _observeRemoveElement: function(el) { el.getElementsBySelector('.remove a')[0].observe('click', function(ev) {ClassicGroupedLinksEdit._removeElement(el);}) },
  _removeElement: function(el) { el.remove();  }
}
ClassicGroupedLinksEdit.init();