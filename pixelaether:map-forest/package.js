Package.describe({
  name: 'pixelaether:map-forest',
  version: '0.0.1',
  summary: 'A heavily wooded map',
  git: 'https://github.com/CharlesHolbrow/pixelaether/',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.4');
  api.use('ecmascript');

  // We have to use the tileset dependency so that we gaurantee
  // that we call TilesetDDS.add() before calling MapDDS.add()
  api.use(['pixelaether:tileset-elements', 'pixelaether:game-server-maps'], 'server');

  // we have to imply the tileset dependency so that the tileset
  // image will be accessible via url.
  api.imply('pixelaether:tileset-elements', ['server', 'client']);

  api.mainModule('map-forest.js', 'server');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('pixelaether:map-forest');
  api.mainModule('map-forest-tests.js');
});
