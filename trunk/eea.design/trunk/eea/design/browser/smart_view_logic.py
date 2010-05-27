from Products.Five import BrowserView


class SmartView(BrowserView):
    """
    """

    def getTemplate(self):
        s = 'folder_listing'
        if 'smartTemplate' in self.request:
            s = self.request['smartTemplate']
        elif self.context.hasProperty('defaultSmartTemplate'):
            s = self.context.getProperty('defaultSmartTemplate')
        return getattr(self.context, s)

    def getListingMacro(self):
        template = self.getTemplate()
        return template.macros.get('listing')
