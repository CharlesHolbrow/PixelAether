Package.describe({
  summary: 'Create and serve PixelAether maps'
});

Package.onUse(function(api){
  api.use(['mongo', 'dds-server', 'game-server-tilesets', 'urlz', 'deps', 'underscore', 'maps-isomorphic', 'mongo', 'check'], 'server');
  api.export(['MapDDS', 'Maps'], 'server');
  api.addFiles(['MapClass.js', 'MapDDS.js', 'publication.js', 'methods.js'], 'server');
});

Npm.depends({
  async:"0.9.0"
});