// Caching the river...
app.factory('myCache', function($cacheFactory) {
    return $cacheFactory('myData');
});