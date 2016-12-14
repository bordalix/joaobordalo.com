camURLsForIDs = function(array_of_ids) {
  var camURLs = [];
  array_of_ids.forEach( function( id, idx ) {
    camURLs.push('/images/traffic/viaverde_' + id + '.jpeg?' + new Date().getTime());
  })
  return camURLs;
}

Template.traffic.onCreated(function () {
  const text = 'Traffic near the 25 Abril bridge';
  DocHead.removeDocHeadAddedTags();
  DocHead.setTitle(text);
  DocHead.addMeta({name: "description", content: text});
});

Template.traffic.helpers({
  camsA2: function() {
    var camIDs  = [305,306,307,5,308,309,310,311,7,312,313,149,532,314,316];
    return camURLsForIDs(camIDs);
  },
  camsNS: function() {
    var camIDs  = [78,79,80,81];
    return camURLsForIDs(camIDs);
  }
})