'use strict';

var $ = window.jQuery = require('jquery');
var config = require('../config/url');
var header = require('../includes/header');
var info = require('./machine-info');

/* DOM */
var $machineNewBtn = $('#machine-new-button');
var $machineTable = $('#machine-table');

initialize();

function initialize() {
	header.include();
	info.init();
	bindEvents();
}

function bindEvents() {
	$machineNewBtn.on('click', gotoMachineNewInfoPage);
	$machineTable.on('click', '.detail-info-button', gotoMachineDetailInfoPage);
}

function gotoMachineNewInfoPage() {
	window.location.href = config.machineUrl + 'new';
}

function gotoMachineDetailInfoPage() {
	var ID = $(this).data('id');
	window.location.href = config.machineUrl + 'info?ID=' + ID;
}