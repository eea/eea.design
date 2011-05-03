from Products.Five import BrowserView


class SmartView(BrowserView):
    """
    """

    def getTemplateName(self):
        if 'smartTemplate' in self.request:
            return self.request['smartTemplate']
        elif self.context.hasProperty('defaultSmartTemplate'):
            return self.context.getProperty('defaultSmartTemplate')
        return 'folder_listing'

    def getTemplate(self):
        name = self.getTemplateName()
        return getattr(self.context, name)

    def getListingMacro(self):
        template = self.getTemplate()
        return template.macros.get('listing')
