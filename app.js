var storyboard = require('storyboard');
var Sequelize = require('sequelize');
var path = require('path');
var CronJob = require('cron').CronJob;
var Redis = require('ioredis');

storyboard.addListener(require('storyboard/lib/listeners/console').default);
var story = storyboard.mainStory;

var config = require('./config');

var redis = new Redis(config.redis);

config.db.options.logging = (toLog)=> {
    story.debug('SQL', toLog);
};

var sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, config.db.options);

var models = {
    ProxerWatcher: sequelize.import(path.join(__dirname, 'sql_models', 'ProxerWatcher')),
    ProxerAnime: sequelize.import(path.join(__dirname, 'sql_models', 'ProxerAnime'))
};

models.ProxerWatcher.belongsTo(models.ProxerAnime);
models.ProxerAnime.hasMany(models.ProxerWatcher);

sequelize.sync();

var cron = new CronJob('/*todo*/',()=>{
    //todo request proxer api
},null,true);

story.info('ProxerWatcher started.')