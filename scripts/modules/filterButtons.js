

function updateButtons()
{

}


function newButton(filterString)
{
	d3.select("#allButton")
		.classed("noDisplay", true);

	var filterSplit = filterString.split(":");
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
		// .attr("class", "classgoeshere")
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

