/* DROP */	
var oDiv = null;
var timer = null;
var delayTime = 500;

function objRef(mitid) {
	if(document.getElementById)	 { return document.getElementById(mitid); }
	else if (document.all) { return document.all[mitid]; }
}

function showMenu(menuDiv) {

	objRef(menuDiv).style.display = "block";
	
	if(timer) { clearTimeout(timer); }
	if(menuDiv !== oDiv) {
		if(oDiv) { objRef(oDiv).style.display = "none"; }
	oDiv = menuDiv;
	}
}


function hideMenu(navn) {
	n_navn = navn;
	timer = setTimeout(objRef(n_navn).style.display = "none", delayTime);
	//timer = setTimeout('objRef(n_navn).style.display = "none"', delayTime);
}

