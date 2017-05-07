
/**
 * Filtered buttons handles the 'filtered by' buttons at the top of the page.
 */


/**
 * Removes a button, not via user click.
 * Usually if selecting a filter auto-removes another, such as month, 
 * since no movie is released both in march and july.
 */
function removeButton(filterString)
{
	console.log("removing Button");
	var filterSplit = filterString.split("_");
	if (filterSplit.length < 2)
	{
		return;
	}

	var filterType = filterSplit[0];
	var filterValue = filterSplit[1];

	if (filters[filterType].has(filterValue))
	{
		filters[filterType].delete(filterValue);
		filters.num--;
	}
	

	if (filters.num <= 0)
	{
		d3.select("#allButton")
			.classed("noDisplay", false);
	}

	d3.select("#filterButtons")
		.select("#" + filterString)
		.remove();

	updateFiltered();
}

/**
 * Creates a new button, with format:
 * 		filterType_filterValue
 * ex:  genre_Action, month_August
 */
function newButton(filterString)
{
	d3.select("#allButton")
		.classed("noDisplay", true);

	var filterSplit = filterString.split("_");
	if (filterSplit.length < 2)
	{
		return;
	}

	var filterType = filterSplit[0];
	var filterValue = filterSplit[1];

	var button = d3.select("#filterButtons")
		.append("button")
		.attr("id", filterString)
		.attr("type", "button")
		.html("<i>" + filterType + "</i>: " + filterValue + "");

	button.on("click", function(d) {
		if (filters[filterType].has(filterValue))
		{
			filters[filterType].delete(filterValue);
			filters.num--;
		}
		

		if (filters.num <= 0)
		{
			d3.select("#allButton")
				.classed("noDisplay", false);
		}

		this.remove();

		updateFiltered();
	});
}

