
//Convert number (1000000) to e.g. 1.000.000
function addDots(num)
{
	return String(num).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."); 
	//return parseFloat(num, 10).toFixed(2).replace(/\./g, ",").toString().replace(/(\d)(?=(\d{3})+\,)/g, "$1.").toString()
}

