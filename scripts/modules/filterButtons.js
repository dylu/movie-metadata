

function updateButtons()
{

}


function newButton(filterString)
{
	var filterSplit = filterString.split(":");
	if (filterSplit.length < 2)
	{
		return;
	}

	var filterType = filterSplit[0];
	var filterValue = filterSplit[1];

	d3.select("#filterButtons")
		.append("button")
		.attr("id", filterString)
		.attr("type", "button")
		// .attr("class", "classgoeshere")
		.html("<i>" + filterType + "</i>: " + filterValue + "");
}

