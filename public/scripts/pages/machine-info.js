'use strict';

var $ = window.jQuery = require('jquery');
var header = require('../includes/header');
var api = require('../machine/api');
var queryParameter = require('../lib/helper/query-parameter');

// ToFix: default option
require('bootstrap/js/dropdown');
var noticeedPersonDropdown = require('../machine/modules/noticed-person-dropdown');
var checkPeriodDropdown    = require('../machine/modules/check-period-dropdown');
var maintainPeriodDropdown = require('../machine/modules/maintain-period-dropdown');

require('eonasdan-bootstrap-datetimepicker');
var checkRecordTable    = require('../machine/modules/check-record-table');
var maintainRecordTable = require('../machine/modules/maintain-record-table');
var errorRecordTable    = require('../machine/modules/error-record-table');


/* DOM */
var $editBtn   = $('#machine-edit-button');
var $cancelBtn = $('#machine-cancel-button');
var $saveBtn   = $('#machine-save-button');
var $deleteBtn = $('#machine-delete-button');
var $backBtn   = $('#machine-back-button');
var $machineDetailPage  = $('#machine-detail-page');
var $viewModeCollection = $machineDetailPage.find('.view-mode');
var $editModeCollection = $machineDetailPage.find('.edit-mode');

var $serialNumber = $('#machine-serial-num');
var $name = $('#machine-name');
var $weight = $('#machine-weight');
// TODO: 機台稼動率


var isEditMode   = false;
var isCreateMode = false;
var machineId;
var originalData;


initialize();

function initialize() {
	header.include();
	if (queryParameter.get('new') === 'true') {
		isCreateMode = true;
		showCreateMode();
	}
	getInitialData();
	bindEvents();
	checkRecordTable.init();
	maintainRecordTable.init();
	errorRecordTable.init();
}

function getInitialData() {
	machineId = queryParameter.get('ID');
	api.getMachineInfo(machineId)
		 .done(initialView)
		 .fail(function(err) { console.log("GET Machine Info error: ", err); });
	// var fakeResponse ={"id":2,"serial_num":"Helga","name":"Schmidt","weight":187,"acquisition":"1991-06-10 00:00:00","admin_id":1,"check_period_unit":"time","check_period_value":62,"maintain_period_unit":"times","maintain_period_value":85,"created_at":"2015-08-18 06:57:31","updated_at":"2015-08-18 06:57:31","maintain_records":[{"id":1,"machine_id":2,"type":"check","content":"test","created_at":"2015-08-18 06:57:31","updated_at":"2015-08-18 06:57:31"}]};
	// initialView(fakeResponse);
}

function bindEvents() {
	$editBtn  .on('click', showEditMode);
	$cancelBtn.on('click', hideEditMode);
	$deleteBtn.on('click', deleteMachine);
	$backBtn  .on('click', api.goToMachineIndex);
	$machineDetailPage.on('keypress', 'input', preventSubmitOnInputEnter);
	$machineDetailPage.submit(saveData);
}

function showEditMode() {
	isEditMode = true;
	$editBtn  .hide();
	$cancelBtn.show();
	$saveBtn  .show();
	$deleteBtn.hide();
	$backBtn  .hide();
	$viewModeCollection.addClass('editting');
	$editModeCollection.addClass('editting');
	checkRecordTable.setEditMode(true);
	maintainRecordTable.setEditMode(true);
	errorRecordTable.setEditMode(true);
}

function hideEditMode() {
	isEditMode = false;
	resetViewData();
	$editBtn  .show();
	$cancelBtn.hide();
	$saveBtn  .hide();
	$deleteBtn.show();
	$backBtn  .show();
	$viewModeCollection.removeClass('editting');
	$editModeCollection.removeClass('editting');
	checkRecordTable.setEditMode(false);
	maintainRecordTable.setEditMode(false);
	errorRecordTable.setEditMode(false);
}

function showCreateMode() {
	$editBtn  .hide();
	$cancelBtn.hide();
	$saveBtn  .show();
	$deleteBtn.hide();
	$backBtn  .show();
	$viewModeCollection.addClass('editting');
	$editModeCollection.addClass('editting');
	checkRecordTable.setEditMode(true);
	maintainRecordTable.setEditMode(true);
	errorRecordTable.setEditMode(true);
}

function preventSubmitOnInputEnter(e) {
	var code = e.keyCode || e.which;
	if (code === 13) {
	  e.preventDefault();
	  return false;
	}
}

function saveData() {
	var data = getChangedData();

	if (isEditMode && !isCreateMode) {
		saveChangedData(data);
		console.log('Changed Data : ', data);

	} else if (!isEditMode && isCreateMode) {
		saveNewData(data);
		console.log('New Data : ', data);

	} else {
		console.log('machine info page has error: Undefined Mode');
	}
	return false;
}

function saveChangedData(data) {
	api.editMachineInfo(machineId, data)
		 .done(function(data) { console.log("EDIT Machine Info res: ", data); })
		 .fail(function(err) { console.log("EDIT Machine Info error: ", err); });
}

function saveNewData(data) {
	api.createMachine(data)
		 .done(function(data) { console.log("CREATE Machine res: ", data); })
		 .fail(function(err) { console.log("CREATE Machine error: ", err); });
}

function deleteMachine() {
	api.deleteMachine(machineId)
		 .done(function(data) { console.log("DELETE Machine res: ", data); })
		 .fail(function(err) { console.log("DELETE Machine error: ", err); });
}

function initialView(data) {
	originalData = data;
	initBaseInfo(data);
	initResumeInfo(data);
}

function resetViewData() {
	initBaseInfo(originalData);
	initResumeInfo(originalData);
}

function initBaseInfo(data) {
	$serialNumber.find('.view-mode').text(data['serial_num']);
	$serialNumber.find('.edit-mode').val(data['serial_num']);

	$name.find('.view-mode').text(data['name']);
	$name.find('.edit-mode').val(data['name']);

	$weight.find('.view-mode').text(data['weight']);
	$weight.find('.edit-mode').val(data['weight']);

	// TODO: 機台稼動率
}

function initResumeInfo(data) {
	noticeedPersonDropdown.init(data['admin_id']);
	checkPeriodDropdown   .init(data['check_period_value'], data['check_period_unit']);
	maintainPeriodDropdown.init(data['maintain_period_value'], data['maintain_period_unit']);
	// ToFix: 小保養紀錄 init data
	var fakedata = api.getErrorRecord();
	checkRecordTable.initialView(fakedata);

	console.log("data['maintain_records'] : ", data['maintain_records']);
	maintainRecordTable.initialView(data['maintain_records']);

	// ToFix: 異常維修紀錄 init data
	var fakedata = api.getErrorRecord();
	errorRecordTable.initialView(fakedata);
}

function getChangedData() {
	var newData = {};
	$editModeCollection.each(function(index, el) {
		var name  = $(el).attr('name');
		var value = $(el).val();
		var $dropdownSelected = $(el).find('.selected-option');

		if (name) {
			value = value ? value : '';
			newData[name] = value;

		} else {
			console.log('getChangedData error: missing some value');
		}
	});
	newData['check_period_value']    = checkPeriodDropdown.getValue();
	newData['check_period_unit']     = checkPeriodDropdown.getType();
	newData['maintain_period_value'] = maintainPeriodDropdown.getValue();
	newData['maintain_period_unit']  = maintainPeriodDropdown.getType();
	return newData;
}
