function getBrowserWidth()
{
	if (window.innerWidth)
	{
		return window.innerWidth;
	}
	else if (document.documentElement && document.documentElement.clientWidth !== 0)
	{
		return document.documentElement.clientWidth;
	}
	else if (document.body)
	{
		return document.body.clientWidth;
	}
	
	return 0;
}

function addLoadListener(fn)
{
	if (typeof window.addEventListener !== 'undefined')
	{
		window.addEventListener('load', fn, false);
	}
	else if (typeof document.addEventListener !== 'undefined')
	{
		document.addEventListener('load', fn, false);
	}
	else if (typeof window.attachEvent !== 'undefined')
	{
		window.attachEvent('onload', fn);
	}
	else
	{
		return false;
	}	
	return true;
}

function checkBrowserWidth()
{
	var theWidth = getBrowserWidth();
	if (theWidth === 0)
	{
		var resolutionCookie = document.cookie.match(/(^|;)tmib_res_layout[^;]*(;|$)/);

		if (resolutionCookie !== null)
		{
			setActiveStyleSheet(unescape(resolutionCookie[0].split("=")[1]),1);
		}
		
		addLoadListener(checkBrowserWidth);
		
		return false;
	}

	if (theWidth > 800 && theWidth < 1030)
	{ 
		setActiveStyleSheet("800 to 1024",1);
		document.cookie = "tmib_res_layout=" + escape("800 to 1024");
	}
	else if (theWidth > 1024 && theWidth < 1285)
	{
		setActiveStyleSheet("1024 to 1280",1);
		document.cookie = "tmib_res_layout=" + escape("1024 to 1280");
	}
	else if (theWidth > 1280)
	{
		setActiveStyleSheet("1280up",1);
		document.cookie = "tmib_res_layout=" + escape("1280up");
	}
	else 
	{
		setActiveStyleSheet("",1);
		document.cookie = "tmib_res_layout=";
	}
	
	return true;
}




AttachEvent(window, "resize", checkBrowserWidth, false);
