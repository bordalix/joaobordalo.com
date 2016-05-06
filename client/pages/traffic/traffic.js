camURLsForIDs = function(array_of_ids) {
  var camURLs = [];
  array_of_ids.forEach( function( id, idx ) {
    camURLs.push("https://www.viaverde.pt/DesktopModules/Traffic/Handlers/Api.ashx?lang=PT&action=cameraimage&cameraId="+id);
  })
  return camURLs;
}

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