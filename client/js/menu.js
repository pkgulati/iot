var menuStyle = {
  menu: 'context_menu',
  menuSeparator: 'context_menu_separator'
};
var contextMenuOptions = {
  classNames: menuStyle,
  menuItems: [
    {
      label: 'I am here', id: 'menu_option1',
      className: 'menu_item', eventName: 'option1_clicked'
    }
  ],
  pixelOffset: new google.maps.Point(0, 0),
  zIndex: 5
};
var contextMenu = new ContextMenu(map, contextMenuOptions);
google.maps.event.addListener(contextMenu, 'menu_item_selected',
  function (latLng, eventName, source) {
    switch (eventName) {

      case 'option1_clicked':
        console.log(latLng);
        var xhr2 = new XMLHttpRequest();
        xhr2.onreadystatechange = function () { };
        var me = (document.getElementById('me').value).trim();
        var me2 = window.location.href.split("#").length>1?window.location.href.split("#")[1]:"";
        if (me == '' && me2 == '') { alert('Who are you? (See bottom of map!)'); break; }
        if(me=='') {
          document.getElementById('me').value = me2;
          me = me2;
        }
        var u = "/api/Locations/loc/?url=" + me + "/https://@" + latLng.lat() + "," + latLng.lng() + ",";
        console.log(u);
        xhr2.open('GET', u, true);
        xhr2.send();
        break;
      default:
        console.log('default_clicked');
        // freak out
        break;
    }
  });
google.maps.event.addListener(map, 'rightclick', function (mouseEvent) {
  contextMenu.show(mouseEvent.latLng, map);
});
