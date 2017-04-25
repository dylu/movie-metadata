// Reminder of global variables.
// mLens_movies


load_data();

function execute_control()
{

	// console.log("[control.js | execute_control] - start.");
	// console.log(mLens_movies);

	drawModule_genre();
	drawModule_month();
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
}

function redrawFiltered()
{
	drawFiltered_genre();
}