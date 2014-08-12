function create_contact_info(theuser,thedomain) {
        var thecontact=(theuser + '@' + thedomain);
        thecontact='<A href="mailto:' + thecontact + '">' + 'Email' + '</a>';
        return thecontact;
}
