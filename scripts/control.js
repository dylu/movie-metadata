// Reminder of global variables.
// mLens_movies


/**
 * Functions that handle global updating of all modules.
 */
load_data();

/**
 * First draw of every module
 */
function execute_control()
{
	drawModule_genre();
	drawModule_month();
	drawModule_table();
	drawModule_mpaaRating();
}

/**
 * Update all filtered values
 */
function updateFiltered()
{
	filter_movies();

	updateDBs();
    redrawFiltered();
}

/**
 * Update each module's specific values
 */
function updateDBs()
{
    update_genresDB(true);
    update_monthDB();
	update_tableDB();
	update_mpaaDB();
}

/**
 * Redraw all modules.
 */
function redrawFiltered()
{
	drawFiltered_genre();

	recalculateAxes_month();
	redrawAxes_month();
	drawFiltered_month();
	redrawFiltered_table();
	drawFiltered_mpaa();
}