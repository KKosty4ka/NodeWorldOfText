var cache = {};

module.exports.startup_internal = async function(vars) {
    var db_img = vars.db_img;
    var all = await db_img.all("SELECT name, data, mime FROM images");
    for(var i = 0; i < all.length; i++) {
        var img = all[i];
        var name = img.name;
        var data = img.data;
        var mime = img.mime;
        cache[name] = { data, mime };
    }
}

module.exports.add_cache = function(name, data, mime) {
    cache[name] = { data, mime };
}

module.exports.GET = async function(req, serve, vars) {
    var get_third = vars.get_third;
    var db_img = vars.db_img;
    var path = vars.path;

    var img_name = get_third(path, "other", "backgrounds");

    var data = await db_img.get("SELECT data, mime FROM images WHERE name=?", img_name);

    if(!data) return serve("Image not found", 404);

    serve(data.data, 200, { mime: data.mime_type });
}