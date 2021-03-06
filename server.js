var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var hbs = require('hbs');
var app = express();
var data = require('./data');

app.use(express.static('public'));
app.use('/includes', express.static('/public/views/includes'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'html');
app.set('views', __dirname + '/public/views');
app.engine('html', hbs.__express);

app.get('/', function(req, res) { res.render('index') });
app.get('/login', function(req, res) { res.render('pages/login/main'); });

// realtime
app.get('/realtime', function(req, res) { res.render('pages/realtime/main'); });
app.get('/realtime/listpic', function(req, res) {
	res.render('pages/realtime/listpic');
});
app.get('/api/workorder/list', function(req, res) {
	res.send(data.liveinfos);
});
app.get('/api/workorder/info', function(req, res) {
	res.send(data.workorderInfo);
});
app.get('/api/workorder/listpic', function(req, res) {
	res.send(data.listpics);
});
app.get('/api/workorder', function(req, res) {
	res.send(data.workorders);
});
app.get('/api/workorder', function(req, res) {
	res.send(data.workorders);
});
app.get('/api/workorder/1', function(req, res) {
	res.send(data.workorder);
});
app.get('/api/user', function(req, res) {
	res.send(data.users);
});

app.get('/machine', function(req, res) { res.render('pages/machine/main'); });
app.get('/machine/info', function(req, res) { res.render('pages/machine/info'); });
app.get('/workorder', function(req, res) { res.render('pages/workorder/main'); });
app.get('/workorder/info', function(req, res) { res.render('pages/workorder/info'); });
app.get('/workorder/new', function(req, res) { res.render('pages/workorder/new'); });
app.get('/mold', function(req, res) { res.render('pages/mold/main'); });
app.get('/mold/info', function(req, res) { res.render('pages/mold/info'); });
app.get('/unusual', function(req, res) { res.render('pages/unusual/main'); });
app.get('/member', function(req, res) { res.render('pages/member/main'); });
app.get('/member/manage', function(req, res) { res.render('pages/member/manage'); });

// history
app.get('/history', function(req, res) { res.render('pages/history/main'); });
app.get('/api/history/filter', function(req, res) {
	switch(req.query.type){
		case "work_order_id":
			res.send(data.workorderLists);
		break;
		case "machine_id":
			res.send(data.machineLists);
		break;
		case "mold_id":
			res.send(data.moldLists);
		break;
		default:
			res.send({});
			
		break;
	}
});
app.get('/api/history/list', function(req, res) {
	res.send(data.historyInfos);
});

app.get('/api/factory/list', function(req, res) {
	res.send(data.factories);
});

app.get('/user', function(req, res) { res.render('pages/user/main'); });

app.listen(app.get('port'));