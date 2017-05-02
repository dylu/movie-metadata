// Reminder of global variables.
// mLens_movies


load_data();

function execute_control()
{

	// console.log("[control.js | execute_control] - start.");
	// console.log(mLens_movies);

	drawModule_genre();
	drawModule_month();
	drawModule_table();
}

function updateFiltered()
{
	filter_movies();

	updateDBs();
    redrawFiltered();
}

function updateDBs()
{
    update_genresDB(true);
    update_monthDB();
	update_tableDB();
}

function redrawFiltered()
{
	drawFiltered_genre();

	recalculateAxes_month();
	redrawAxes_month();
	drawFiltered_month();
	redrawFiltered_table();
}