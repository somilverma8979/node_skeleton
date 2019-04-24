const SteemConnect    = require('sc2-sdk');
const config = require('config');

module.exports  = function(wagner) {
    return SteemConnect.Initialize({
	    app: 'steem-bounty-app',
	    callbackURL: config.app_route,
	    scope: ['vote','comment','claim_reward_balance','custom_json','comment_options']
	});
}
