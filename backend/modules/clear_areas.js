var utils = require("../utils/utils.js");
var san_nbr = utils.san_nbr;

function isMainPage(name) {
	return name == "" || name.toLowerCase() == "main" || name.toLowerCase() == "owot";
}

module.exports = async function(data, server, params) {
	var user = params.user;
	var channel = params.channel;
	var world = params.world;

	var tile_database = server.tile_database;
	var broadcastMonitorEvent = server.broadcastMonitorEvent;
	var rate_limiter = server.rate_limiter;
	var loadPlugin = server.loadPlugin;

	var memkeyAccess = world.opts.memKey && world.opts.memKey == params.keyQuery;

	var is_owner = user.id == world.ownerId || (user.superuser && isMainPage(world.name));
	var is_member = !!world.members.map[user.id] || memkeyAccess || (user.superuser && isMainPage(world.name)) || is_owner;

	var feature_perm = world.feature.quickErase;
	var can_owner = is_owner;
	var can_member = (is_member && feature_perm) || is_owner;
	if(!can_owner && !can_member) return; // redundant check (areas checked in tile_database.js)

	var tileX = san_nbr(data.tileX);
	var tileY = san_nbr(data.tileY);
	var charX = san_nbr(data.charX);
	var charY = san_nbr(data.charY);
	var charWidth = san_nbr(data.charWidth);
	var charHeight = san_nbr(data.charHeight);

	var ipAddress;
	var ipAddressVal;
	var ipAddressFam;
	if(params.ws && params.ws.sdata) {
		ipAddress = params.ws.sdata.ipAddress;
		ipAddressVal = params.ws.sdata.ipAddressVal;
		ipAddressFam = params.ws.sdata.ipAddressFam;
	} else {
		ipAddress = params.ipAddress;
		ipAddressVal = params.ipAddressVal;
		ipAddressFam = params.ipAddressFam;
	}

	var idLabel = ipAddress;

	broadcastMonitorEvent("Clear", ipAddress + " set 'clear' on world '" + world.name + "' (" + world.id + "), coords (" + tileX + ", " + tileY + ")");

	var plugin = loadPlugin();
	// plugin interface is subject to change - use at your own risk
	if(plugin && plugin.clear) {
		try {
			plugin.clear({
				ip: ipAddress,
				is_owner, is_member,
				tileX, tileY, charX, charY, charWidth, charHeight, // unprocessed
				user, world
			});
		} catch(e) {}
	}

	var no_log_edits = world.opts.noLogEdits;

	// the x position going from 0 - 127 may be used at times
	var charIdx = charY * CONST.tileCols + charX;
	charX = charIdx % CONST.tileCols;
	charY = Math.floor(charIdx / CONST.tileCols);

	if(charIdx < 0 || charIdx >= CONST.tileArea) { // out of range coords
		return [true, "PARAM"];
	}

	if(!rate_limiter.setHold(idLabel, world.id, tileX, tileY)) {
		return [true, "RATE"];
	}

	await tile_database.write(tile_database.types.clear, {
		tileX, tileY,
		charX, charY,
		charWidth, charHeight,
		user, world, is_owner, is_member,
		channel, no_log_edits
	});

	rate_limiter.releaseHold(idLabel, world.id, tileX, tileY);
}